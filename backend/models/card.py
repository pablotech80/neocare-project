from sqlalchemy import Column, Integer, String, ForeignKey
from backend.core.config import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    list_id = Column(Integer, ForeignKey("lists.id"))  # relación con la tabla de listas
    status = Column(String, default="todo")            # opcional: estado de la tarjeta
    order = Column(Integer, default=0)                 # opcional: posición dentro de la lista
