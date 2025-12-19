from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.core.config import Base

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)   # 👈 columna correcta
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relación con User
    owner = relationship("User", back_populates="boards")

    # Relación con List
    lists = relationship("List", back_populates="board")
