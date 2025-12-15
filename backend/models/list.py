from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.config import Base

class List(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    board_id = Column(Integer, ForeignKey("boards.id"))

    # Relación con Board
    board = relationship("Board", back_populates="lists")

