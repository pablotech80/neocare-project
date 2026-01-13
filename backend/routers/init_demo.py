from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.config import get_db
from backend.models.user import User
from passlib.context import CryptContext

router = APIRouter(prefix="/api/v1", tags=["init"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/init-demo")
def init_demo_user(db: Session = Depends(get_db)):
    """
    Crea el usuario demo si no existe.
    Solo para inicialización en producción.
    """
    email = "neocare@neocare.com"
    
    # Verificar si ya existe
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return {
            "message": "Usuario demo ya existe",
            "user_id": existing_user.id,
            "email": existing_user.email
        }
    
    # Crear usuario demo
    password_hash = pwd_context.hash("team_sigma")
    
    demo_user = User(
        username="NeoCare Demo",
        email=email,
        password_hash=password_hash
    )
    
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    
    return {
        "message": "Usuario demo creado exitosamente",
        "user_id": demo_user.id,
        "email": demo_user.email,
        "credentials": {
            "email": "neocare@neocare.com",
            "password": "team_sigma"
        }
    }
