from fastapi import FastAPI
from app.routers import auth, boards
from app.core.config import Base, engine
from app.models import user, board, list  # importa los modelos para que se creen las tablas

app = FastAPI()

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Registrar los routers
app.include_router(auth.router)
app.include_router(boards.router)

@app.get("/")
def read_root():
    return {"message": "NeoCare Backend funcionando 🚀"}
