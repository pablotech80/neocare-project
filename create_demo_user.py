#!/usr/bin/env python3
"""
Script para crear el usuario demo en la base de datos de producción.
"""
import os
import sys
from passlib.context import CryptContext
from sqlalchemy import create_engine, text

# Configurar bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_demo_user(database_url: str):
    """Crea el usuario demo en la base de datos."""
    
    # Datos del usuario demo
    email = "neocare@neocare.com"
    password = "team_sigma"
    username = "NeoCare Demo"
    
    # Hash de la contraseña
    password_hash = pwd_context.hash(password)
    
    # Conectar a la base de datos
    engine = create_engine(database_url)
    
    try:
        with engine.connect() as conn:
            # Verificar si el usuario ya existe
            result = conn.execute(
                text("SELECT id FROM users WHERE email = :email"),
                {"email": email}
            )
            existing_user = result.fetchone()
            
            if existing_user:
                print(f"✓ Usuario {email} ya existe (ID: {existing_user[0]})")
                return
            
            # Crear el usuario
            result = conn.execute(
                text("""
                    INSERT INTO users (username, email, password_hash)
                    VALUES (:username, :email, :password_hash)
                    RETURNING id
                """),
                {
                    "username": username,
                    "email": email,
                    "password_hash": password_hash
                }
            )
            conn.commit()
            
            user_id = result.fetchone()[0]
            print(f"✓ Usuario demo creado exitosamente!")
            print(f"  ID: {user_id}")
            print(f"  Email: {email}")
            print(f"  Password: {password}")
            
    except Exception as e:
        print(f"✗ Error al crear usuario: {e}")
        sys.exit(1)
    finally:
        engine.dispose()

if __name__ == "__main__":
    # Obtener DATABASE_URL del entorno
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("✗ Error: DATABASE_URL no está configurada")
        print("Uso: DATABASE_URL='postgresql://...' python create_demo_user.py")
        sys.exit(1)
    
    print("Creando usuario demo en la base de datos...")
    create_demo_user(database_url)
