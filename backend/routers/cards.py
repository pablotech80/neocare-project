from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.config import SessionLocal
from backend.models.card import Card
from backend.schemas.card import CardCreate, CardUpdate, CardOut  # ← importa los esquemas

router = APIRouter(
    prefix="/cards",
    tags=["cards"]
)

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear tarjeta
@router.post("/", response_model=CardOut)
def create_card(card_data: CardCreate, db: Session = Depends(get_db)):
    card = Card(
        title=card_data.title,
        list_id=card_data.list_id,
        status="todo",   # valor por defecto
        order=0          # valor inicial
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card

# Listar todas las tarjetas
@router.get("/", response_model=list[CardOut])
def read_cards(db: Session = Depends(get_db)):
    return db.query(Card).all()

# Actualizar tarjeta (ej. mover entre listas, cambiar título/estado/orden)
@router.put("/{card_id}", response_model=CardOut)
def update_card(card_id: int, card_data: CardUpdate, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Actualizar campos simples
    if card_data.title is not None:
        card.title = card_data.title
    if card_data.list_id is not None:
        card.list_id = card_data.list_id
    if card_data.status is not None:
        card.status = card_data.status

    # Lógica automática de orden
    if card_data.order is not None:
        # Obtener todas las tarjetas de la misma lista excepto la actual
        cards_in_list = (
            db.query(Card)
            .filter(Card.list_id == card.list_id, Card.id != card.id)
            .order_by(Card.order)
            .all()
        )

        # Insertar la tarjeta en la nueva posición
        new_order = card_data.order
        cards_in_list.insert(new_order, card)

        # Reasignar órdenes consecutivos
        for idx, c in enumerate(cards_in_list):
            c.order = idx

    db.commit()
    db.refresh(card)
    return card

# Eliminar tarjeta
@router.delete("/{card_id}")
def delete_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(card)
    db.commit()
    return {"detail": "Card deleted"}

