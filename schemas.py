from pydantic import BaseModel

# --- Usuarios ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

# --- Tableros ---
class BoardCreate(BaseModel):
    title: str

class BoardResponse(BaseModel):
    id: int
    title: str

    class Config:
        orm_mode = True
