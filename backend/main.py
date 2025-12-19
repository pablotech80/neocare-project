from fastapi import FastAPI
from backend.routers import auth, boards, cards
from backend.core.config import Base, engine
from backend.models import user, board, list, card  # importa los modelos para que se creen las tablas

app = FastAPI()

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Registrar los routers
app.include_router(auth.router)
app.include_router(boards.router)
app.include_router(cards.router)

@app.get("/")
def read_root():
    return {"message": "NeoCare Backend funcionando 🚀"}
