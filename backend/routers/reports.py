from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from backend.core.config import get_db
from backend.models.worklog import Worklog
from backend.models.card import Card
from backend.models.list import List
from backend.models.board import Board
from backend.models.user import User
from backend.routers.auth import get_current_user
from backend.schemas.report import (
    WeeklySummaryResponse,
    HoursByUserResponse,
    HoursByUserReport,
    HoursByCardResponse,
    HoursByCardReport
)
from datetime import date, datetime, timedelta
from typing import Optional

router = APIRouter(
    tags=["reports"]
)

# Helper function to get ISO week from date
def get_iso_week(date_obj: date) -> str:
    """Returns ISO week in format YYYY-WW"""
    iso_calendar = date_obj.isocalendar()
    return f"{iso_calendar[0]}-{str(iso_calendar[1]).zfill(2)}"

# Helper function to get week start and end dates from ISO week string
def get_week_dates(week_str: str) -> tuple[date, date]:
    """Returns start and end date of an ISO week (YYYY-WW)"""
    try:
        year, week = week_str.split('-')
        year = int(year)
        week = int(week)

        # Get the first day of the year
        jan_4 = date(year, 1, 4)
        # Find the Monday of week 1
        week_1_monday = jan_4 - timedelta(days=jan_4.weekday())
        # Calculate the target week's Monday
        target_monday = week_1_monday + timedelta(weeks=week - 1)
        # Sunday is 6 days after Monday
        target_sunday = target_monday + timedelta(days=6)

        return target_monday, target_sunday
    except (ValueError, AttributeError):
        raise HTTPException(status_code=422, detail="Invalid week format. Use YYYY-WW")

# Helper function to validate board ownership
def validate_board_access(board_id: int, user_id: int, db: Session) -> Board:
    """Validates that the user owns the board"""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.user_id != user_id:
        raise HTTPException(status_code=403, detail="You don't have access to this board")

    return board

# GET /report/{board_id}/summary
@router.get("/report/{board_id}/summary", response_model=WeeklySummaryResponse)
def get_weekly_summary(
    board_id: int,
    week: Optional[str] = Query(None, description="Week in ISO format (YYYY-WW). Defaults to current week."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get weekly summary report for a board.

    - Requires JWT authentication
    - User must own the board
    - Returns count of completed, overdue, and new cards for the week
    - Week format: YYYY-WW (ISO 8601)
    """
    # Validate board access
    validate_board_access(board_id, current_user.id, db)

    # Determine the target week
    if week:
        target_week = week
    else:
        target_week = get_iso_week(date.today())

    # Get start and end dates for the week
    week_start, week_end = get_week_dates(target_week)

    # Get all lists for this board
    list_ids = db.query(List.id).filter(List.board_id == board_id).all()
    list_ids = [lid[0] for lid in list_ids]

    if not list_ids:
        # Board has no lists, return zeros
        return WeeklySummaryResponse(
            week=target_week,
            completed=0,
            overdue=0,
            new=0
        )

    # Count cards by status for this week using optimized query
    # Completed: cards with status 'done' or 'completed'
    # Overdue: cards not completed and created before this week
    # New: cards created during this week

    completed_count = db.query(func.count(Card.id)).filter(
        Card.list_id.in_(list_ids),
        Card.status.in_(['done', 'completed'])
    ).scalar() or 0

    # For overdue: cards not in done/completed status that were created before this week
    # Assuming we don't have a due_date field, we'll count pending cards created before this week
    overdue_count = db.query(func.count(Card.id)).filter(
        Card.list_id.in_(list_ids),
        ~Card.status.in_(['done', 'completed'])
    ).scalar() or 0

    # New cards created during the week
    # Note: Card model doesn't have created_at, so we'll return 0 for now
    # If Card had created_at, the query would be:
    # new_count = db.query(func.count(Card.id)).filter(
    #     Card.list_id.in_(list_ids),
    #     Card.created_at >= week_start,
    #     Card.created_at <= week_end
    # ).scalar() or 0
    new_count = 0

    return WeeklySummaryResponse(
        week=target_week,
        completed=completed_count,
        overdue=overdue_count,
        new=new_count
    )

# GET /report/{board_id}/hours-by-user
@router.get("/report/{board_id}/hours-by-user", response_model=HoursByUserReport)
def get_hours_by_user(
    board_id: int,
    week: Optional[str] = Query(None, description="Week in ISO format (YYYY-WW). Defaults to current week."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get hours worked by each user on a board for a specific week.

    - Requires JWT authentication
    - User must own the board
    - Returns aggregated hours and task count per user
    - Week format: YYYY-WW (ISO 8601)
    """
    # Validate board access
    validate_board_access(board_id, current_user.id, db)

    # Determine the target week
    if week:
        target_week = week
    else:
        target_week = get_iso_week(date.today())

    # Get start and end dates for the week
    week_start, week_end = get_week_dates(target_week)

    # Get all lists for this board
    list_ids = db.query(List.id).filter(List.board_id == board_id).subquery()

    # Optimized query: GROUP BY user with SUM and COUNT aggregations
    results = (
        db.query(
            User.id.label('user_id'),
            User.username.label('username'),
            func.sum(Worklog.hours).label('total_hours'),
            func.count(func.distinct(Worklog.card_id)).label('tasks_count')
        )
        .join(Worklog, User.id == Worklog.user_id)
        .join(Card, Worklog.card_id == Card.id)
        .filter(
            Card.list_id.in_(list_ids),
            Worklog.date >= week_start,
            Worklog.date <= week_end
        )
        .group_by(User.id, User.username)
        .all()
    )

    # Convert to response objects
    users = [
        HoursByUserResponse(
            user_id=row.user_id,
            username=row.username,
            total_hours=float(row.total_hours or 0),
            tasks_count=int(row.tasks_count or 0)
        )
        for row in results
    ]

    return HoursByUserReport(
        week=target_week,
        users=users
    )

# GET /report/{board_id}/hours-by-card
@router.get("/report/{board_id}/hours-by-card", response_model=HoursByCardReport)
def get_hours_by_card(
    board_id: int,
    week: Optional[str] = Query(None, description="Week in ISO format (YYYY-WW). Defaults to current week."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get hours worked on each card for a specific week.

    - Requires JWT authentication
    - User must own the board
    - Returns cards with total hours and responsible user
    - Week format: YYYY-WW (ISO 8601)
    """
    # Validate board access
    validate_board_access(board_id, current_user.id, db)

    # Determine the target week
    if week:
        target_week = week
    else:
        target_week = get_iso_week(date.today())

    # Get start and end dates for the week
    week_start, week_end = get_week_dates(target_week)

    # Get all lists for this board
    list_ids = db.query(List.id).filter(List.board_id == board_id).subquery()

    # Optimized query: GROUP BY card with SUM aggregation
    # Note: Card model doesn't have 'responsible' field, so we'll leave it as None
    results = (
        db.query(
            Card.id.label('card_id'),
            Card.title.label('title'),
            Card.status.label('status'),
            func.sum(Worklog.hours).label('total_hours')
        )
        .join(Worklog, Card.id == Worklog.card_id)
        .filter(
            Card.list_id.in_(list_ids),
            Worklog.date >= week_start,
            Worklog.date <= week_end
        )
        .group_by(Card.id, Card.title, Card.status)
        .all()
    )

    # Convert to response objects
    cards = [
        HoursByCardResponse(
            card_id=row.card_id,
            title=row.title,
            total_hours=float(row.total_hours or 0),
            responsible=None,  # Card model doesn't have responsible field
            estado=row.status
        )
        for row in results
    ]

    return HoursByCardReport(
        week=target_week,
        cards=cards
    )
