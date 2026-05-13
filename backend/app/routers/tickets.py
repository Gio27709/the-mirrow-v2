from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid

from .. import models, schemas, database, auth
from .admin import get_current_admin

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@router.get("/my-tickets", response_model=List[schemas.EventTicketResponse])
def get_my_tickets(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    tickets = db.query(models.EventTicket).options(joinedload(models.EventTicket.event)).filter(models.EventTicket.user_id == current_user.id).order_by(models.EventTicket.created_at.desc()).all()
    return tickets

@router.post("/reserve/{event_id}", response_model=schemas.EventTicketResponse)
def reserve_free_ticket(event_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if not event.free_entry or not event.reservation_required:
        raise HTTPException(status_code=400, detail="This event does not support free reservations")
        
    # Check if already reserved
    existing = db.query(models.EventTicket).filter(
        models.EventTicket.user_id == current_user.id,
        models.EventTicket.event_id == event_id,
        models.EventTicket.status == "valido"
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="You already have a reservation for this event")
        
    # Generate ticket
    qr_code = f"MIRROW-{uuid.uuid4().hex[:8].upper()}"
    ticket = models.EventTicket(
        user_id=current_user.id,
        event_id=event_id,
        status="valido",
        qr_code=qr_code,
        price_paid="Gratis"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.post("/admin/issue", response_model=schemas.EventTicketResponse)
def admin_issue_ticket(
    event_id: int, 
    user_email: str, 
    price_paid: str = None, 
    zone_id: int = None,
    current_admin: models.User = Depends(get_current_admin), 
    db: Session = Depends(database.get_db)
):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found with that email")
        
    qr_code = f"MIRROW-{uuid.uuid4().hex[:8].upper()}"
    ticket = models.EventTicket(
        user_id=user.id,
        event_id=event_id,
        zone_id=zone_id,
        status="valido",
        qr_code=qr_code,
        price_paid=price_paid or "Pagado externamente"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket
