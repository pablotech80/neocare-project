from pydantic import BaseModel
from typing import Optional

# Esquema base: campos comunes
class CardBase(BaseModel):
    title: str
    list_id: int

# Para crear una tarjeta (POST)
class CardCreate(CardBase):
    pass

# Para actualizar una tarjeta (PUT)
class CardUpdate(BaseModel):
    title: Optional[str] = None
    list_id: Optional[int] = None
    status: Optional[str] = None
    order: Optional[int] = None

# Para devolver una tarjeta (GET, POST, PUT)
class CardOut(CardBase):
    id: int
    status: Optional[str] = None
    order: Optional[int] = None

    class Config:
        orm_mode = True
