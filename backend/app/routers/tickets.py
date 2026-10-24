from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid

from .. import models, schemas, database, auth
from .admin import get_current_admin

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

# Ticket lifecycle stored in EventTicket.status
TICKET_STATUSES = ("valido", "usado", "cancelado")

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

def _active_ticket_count(db: Session, event_id: int) -> int:
    """Tickets that occupy a place (anything not cancelled)."""
    return db.query(models.EventTicket).filter(
        models.EventTicket.event_id == event_id,
        models.EventTicket.status != "cancelado",
    ).count()

def _to_admin_ticket(ticket: models.EventTicket) -> schemas.AdminTicketResponse:
    return schemas.AdminTicketResponse(
        id=ticket.id,
        status=ticket.status,
        qr_code=ticket.qr_code,
        price_paid=ticket.price_paid,
        created_at=ticket.created_at,
        event_id=ticket.event_id,
        event_title=ticket.event.title if ticket.event else None,
        event_date=ticket.event.date if ticket.event else None,
        zone_id=ticket.zone_id,
        zone_name=ticket.zone.name if ticket.zone else None,
        user_id=ticket.user_id,
        user_email=ticket.user.email if ticket.user else None,
        user_full_name=ticket.user.full_name if ticket.user else None,
    )

@router.get("/my-tickets", response_model=List[schemas.EventTicketResponse])
def get_my_tickets(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    tickets = db.query(models.EventTicket).options(joinedload(models.EventTicket.event)).filter(models.EventTicket.user_id == current_user.id).order_by(models.EventTicket.created_at.desc()).all()
    return tickets

@router.post("/reserve/{event_id}", response_model=schemas.EventTicketResponse)
def reserve_free_ticket(event_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if not event.is_active:
        raise HTTPException(status_code=400, detail="Este evento ya no está disponible")
        
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

    # Enforce capacity when the event defines one
    if event.capacity is not None and event.capacity > 0:
        if _active_ticket_count(db, event_id) >= event.capacity:
            raise HTTPException(status_code=400, detail="No quedan plazas disponibles para este evento")
        
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

# ============================================
# ADMIN
# ============================================

@router.get("/admin", response_model=List[schemas.AdminTicketResponse])
def admin_list_tickets(
    event_id: Optional[int] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    """All tickets with buyer email and event title. Optional filters: event_id, status."""
    query = db.query(models.EventTicket).options(
        joinedload(models.EventTicket.user),
        joinedload(models.EventTicket.event),
        joinedload(models.EventTicket.zone),
    )
    if event_id is not None:
        query = query.filter(models.EventTicket.event_id == event_id)
    if status_filter:
        if status_filter not in TICKET_STATUSES:
            raise HTTPException(status_code=400, detail="Estado de entrada no válido")
        query = query.filter(models.EventTicket.status == status_filter)
    tickets = query.order_by(models.EventTicket.created_at.desc(), models.EventTicket.id.desc()).all()
    return [_to_admin_ticket(t) for t in tickets]

@router.post("/admin/issue", response_model=schemas.EventTicketResponse)
def admin_issue_ticket(
    payload: schemas.AdminTicketIssue,
    current_admin: models.User = Depends(get_current_admin), 
    db: Session = Depends(database.get_db)
):
    event = db.query(models.Event).filter(models.Event.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    user = db.query(models.User).filter(models.User.email == payload.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found with that email")

    if payload.zone_id is not None:
        zone = db.query(models.EventZone).filter(
            models.EventZone.id == payload.zone_id,
            models.EventZone.event_id == event.id,
        ).first()
        if not zone:
            raise HTTPException(status_code=400, detail="La zona no pertenece a este evento")
        
    qr_code = f"MIRROW-{uuid.uuid4().hex[:8].upper()}"
    ticket = models.EventTicket(
        user_id=user.id,
        event_id=event.id,
        zone_id=payload.zone_id,
        status="valido",
        qr_code=qr_code,
        price_paid=payload.price_paid or "Pagado externamente"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.patch("/{ticket_id}/status", response_model=schemas.AdminTicketResponse)
def admin_update_ticket_status(
    ticket_id: int,
    payload: schemas.TicketStatusUpdate,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    """Validate at the door ("usado"), cancel ("cancelado") or restore ("valido") a ticket."""
    if payload.status not in TICKET_STATUSES:
        raise HTTPException(status_code=400, detail="Estado de entrada no válido")

    ticket = db.query(models.EventTicket).options(
        joinedload(models.EventTicket.user),
        joinedload(models.EventTicket.event),
        joinedload(models.EventTicket.zone),
    ).filter(models.EventTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")

    if ticket.status == "cancelado" and payload.status == "usado":
        raise HTTPException(status_code=400, detail="Una entrada cancelada no puede marcarse como usada")

    ticket.status = payload.status
    db.commit()
    db.refresh(ticket)
    return _to_admin_ticket(ticket)
