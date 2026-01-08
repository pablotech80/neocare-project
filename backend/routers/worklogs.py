from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.core.config import get_db
from backend.models.worklog import Worklog
from backend.models.card import Card
from backend.models.list import List
from backend.models.board import Board
from backend.models.user import User
from backend.routers.auth import get_current_user
from backend.schemas.worklog import WorklogCreate, WorklogUpdate, WorklogOut, WeeklyWorklogResponse
from datetime import date, datetime, timedelta
from typing import Optional

router = APIRouter(
    tags=["worklogs"]
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

# Helper function to validate card ownership
def validate_card_access(card_id: int, user_id: int, db: Session) -> Card:
    """Validates that the user has access to the card through board ownership"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Get the list and board
    list_obj = db.query(List).filter(List.id == card.list_id).first()
    if not list_obj:
        raise HTTPException(status_code=404, detail="List not found")

    board = db.query(Board).filter(Board.id == list_obj.board_id).first()
    if not board or board.user_id != user_id:
        raise HTTPException(status_code=403, detail="You don't have access to this card")

    return card

# Create worklog for a card
@router.post("/cards/{card_id}/worklogs", response_model=WorklogOut, status_code=201)
def create_worklog(
    card_id: int,
    worklog_data: WorklogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new worklog entry for a card.

    - Requires JWT authentication
    - User must have access to the card
    - Date cannot be in the future
    - Hours must be greater than 0
    - Note is optional (max 200 characters)
    """
    # Validate card access
    validate_card_access(card_id, current_user.id, db)

    # Create worklog
    worklog = Worklog(
        card_id=card_id,
        user_id=current_user.id,
        date=worklog_data.date,
        hours=worklog_data.hours,
        note=worklog_data.note
    )

    db.add(worklog)
    db.commit()
    db.refresh(worklog)

    return worklog

# Get all worklogs for a card
@router.get("/cards/{card_id}/worklogs", response_model=list[WorklogOut])
def get_card_worklogs(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all worklogs for a specific card.

    - Requires JWT authentication
    - User must have access to the card
    - Returns worklogs from all users who worked on the card
    - Ordered by date descending
    """
    # Validate card access
    validate_card_access(card_id, current_user.id, db)

    # Get all worklogs for this card
    worklogs = (
        db.query(Worklog)
        .filter(Worklog.card_id == card_id)
        .order_by(Worklog.date.desc())
        .all()
    )

    return worklogs

# Update a worklog (only owner can update)
@router.patch("/worklogs/{worklog_id}", response_model=WorklogOut)
def update_worklog(
    worklog_id: int,
    worklog_data: WorklogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a worklog entry.

    - Requires JWT authentication
    - Only the author can update their worklog
    - Can only update hours and note (not date or card)
    """
    worklog = db.query(Worklog).filter(Worklog.id == worklog_id).first()

    if not worklog:
        raise HTTPException(status_code=404, detail="Worklog not found")

    # Check ownership
    if worklog.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own worklogs")

    # Update fields
    if worklog_data.hours is not None:
        worklog.hours = worklog_data.hours

    if worklog_data.note is not None:
        worklog.note = worklog_data.note

    db.commit()
    db.refresh(worklog)

    return worklog

# Delete a worklog (only owner can delete)
@router.delete("/worklogs/{worklog_id}", status_code=204)
def delete_worklog(
    worklog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a worklog entry.

    - Requires JWT authentication
    - Only the author can delete their worklog
    """
    worklog = db.query(Worklog).filter(Worklog.id == worklog_id).first()

    if not worklog:
        raise HTTPException(status_code=404, detail="Worklog not found")

    # Check ownership
    if worklog.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own worklogs")

    db.delete(worklog)
    db.commit()

    return None

# Get weekly worklogs for current user
@router.get("/users/me/worklogs", response_model=WeeklyWorklogResponse)
def get_my_weekly_worklogs(
    week: Optional[str] = Query(None, description="Week in ISO format (YYYY-WW). Defaults to current week."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get worklogs for the current user for a specific week.

    - Requires JWT authentication
    - Returns only the authenticated user's worklogs
    - Week format: YYYY-WW (ISO 8601)
    - If no week is provided, returns current week
    - Includes daily totals and weekly total
    """
    # Determine the target week
    if week:
        target_week = week
    else:
        target_week = get_iso_week(date.today())

    # Get start and end dates for the week
    week_start, week_end = get_week_dates(target_week)

    # Get worklogs for the user in this week
    worklogs = (
        db.query(Worklog)
        .filter(
            Worklog.user_id == current_user.id,
            Worklog.date >= week_start,
            Worklog.date <= week_end
        )
        .order_by(Worklog.date.desc())
        .all()
    )

    # Calculate daily totals
    daily_totals = {}
    for worklog in worklogs:
        date_str = worklog.date.isoformat()
        daily_totals[date_str] = daily_totals.get(date_str, 0) + worklog.hours

    # Calculate weekly total
    total_week_hours = sum(worklog.hours for worklog in worklogs)

    return WeeklyWorklogResponse(
        week=target_week,
        total_week_hours=total_week_hours,
        daily_totals=daily_totals,
        worklogs=worklogs
    )
