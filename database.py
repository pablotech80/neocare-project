from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Ajusta la cadena de conexión a tu base de datos PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:tu_password@localhost:5432/neocare"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 👇 ESTA FUNCIÓN ES LA QUE TE FALTA
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

