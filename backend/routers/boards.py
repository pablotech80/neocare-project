from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import SessionLocal
from app.models.board import Board
from app.models.user import User
from app.routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/boards", tags=["boards"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Schemas ---
class BoardCreate(BaseModel):
    title: str

# --- Endpoints ---
@router.post("/")
def create_board(board: BoardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_board = Board(title=board.title, user_id=current_user.id)
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.get("/")
def get_boards(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    boards = db.query(Board).filter(Board.user_id == current_user.id).all()
    return boards
