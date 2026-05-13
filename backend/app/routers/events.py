from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from .. import models, schemas
from ..database import get_db
from .admin import get_current_admin

router = APIRouter(
    prefix="/events",
    tags=["events"]
)

# ============================================
# EVENTS CRUD
# ============================================

@router.get("/", response_model=List[schemas.EventResponse])
def read_events(skip: int = 0, limit: int = 100, is_active: bool = None, is_featured: bool = None, city: str = None, type: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Event).options(
        joinedload(models.Event.zones),
        joinedload(models.Event.lineup)
    )
    
    if is_active is not None:
        query = query.filter(models.Event.is_active == is_active)
        
    if is_featured is not None:
        query = query.filter(models.Event.is_featured == is_featured)
    
    if city:
        query = query.filter(models.Event.city.ilike(f"%{city}%"))
    
    if type:
        query = query.filter(models.Event.type.ilike(f"%{type}%"))
        
    events = query.order_by(models.Event.created_at.desc()).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=schemas.EventResponse)
def read_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).options(
        joinedload(models.Event.zones),
        joinedload(models.Event.lineup)
    ).filter(models.Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/", response_model=schemas.EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.put("/{event_id}", response_model=schemas.EventResponse)
def update_event(event_id: int, event_update: schemas.EventUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
        
    update_data = event_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_event, key, value)
        
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
        
    db.delete(db_event)
    db.commit()
    return None


# ============================================
# EVENT ZONES CRUD
# ============================================

@router.get("/{event_id}/zones", response_model=List[schemas.EventZoneResponse])
def read_event_zones(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    zones = db.query(models.EventZone).filter(models.EventZone.event_id == event_id).order_by(models.EventZone.order).all()
    return zones

@router.post("/{event_id}/zones", response_model=schemas.EventZoneResponse, status_code=status.HTTP_201_CREATED)
def create_event_zone(event_id: int, zone: schemas.EventZoneCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db_zone = models.EventZone(event_id=event_id, **zone.dict())
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

@router.put("/{event_id}/zones/{zone_id}", response_model=schemas.EventZoneResponse)
def update_event_zone(event_id: int, zone_id: int, zone_update: schemas.EventZoneUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    db_zone = db.query(models.EventZone).filter(models.EventZone.id == zone_id, models.EventZone.event_id == event_id).first()
    if not db_zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    update_data = zone_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_zone, key, value)
    
    db.commit()
    db.refresh(db_zone)
    return db_zone

@router.delete("/{event_id}/zones/{zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event_zone(event_id: int, zone_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    db_zone = db.query(models.EventZone).filter(models.EventZone.id == zone_id, models.EventZone.event_id == event_id).first()
    if not db_zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    db.delete(db_zone)
    db.commit()
    return None


# ============================================
# EVENT LINEUP CRUD
# ============================================

@router.get("/{event_id}/lineup", response_model=List[schemas.EventLineupResponse])
def read_event_lineup(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    lineup = db.query(models.EventLineup).filter(models.EventLineup.event_id == event_id).order_by(models.EventLineup.order).all()
    return lineup

@router.post("/{event_id}/lineup", response_model=schemas.EventLineupResponse, status_code=status.HTTP_201_CREATED)
def create_event_lineup(event_id: int, artist: schemas.EventLineupCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db_artist = models.EventLineup(event_id=event_id, **artist.dict())
    db.add(db_artist)
    db.commit()
    db.refresh(db_artist)
    return db_artist

@router.put("/{event_id}/lineup/{artist_id}", response_model=schemas.EventLineupResponse)
def update_event_lineup(event_id: int, artist_id: int, artist_update: schemas.EventLineupUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    db_artist = db.query(models.EventLineup).filter(models.EventLineup.id == artist_id, models.EventLineup.event_id == event_id).first()
    if not db_artist:
        raise HTTPException(status_code=404, detail="Lineup artist not found")
    
    update_data = artist_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_artist, key, value)
    
    db.commit()
    db.refresh(db_artist)
    return db_artist

@router.delete("/{event_id}/lineup/{artist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event_lineup(event_id: int, artist_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    db_artist = db.query(models.EventLineup).filter(models.EventLineup.id == artist_id, models.EventLineup.event_id == event_id).first()
    if not db_artist:
        raise HTTPException(status_code=404, detail="Lineup artist not found")
    
    db.delete(db_artist)
    db.commit()
    return None

from fastapi import File, UploadFile
import uuid
from ..supabase_client import upload_video

@router.post("/upload-video")
async def upload_event_video(
    file: UploadFile = File(...),
    current_admin: models.User = Depends(get_current_admin)
):
    if not file.content_type.startswith("video/"):
        raise HTTPException(400, detail="El archivo debe ser un video")
        
    try:
        # Check size (Max 50MB)
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)
        
        if size > 50 * 1024 * 1024:
            raise HTTPException(400, detail="El video no debe superar los 50MB")
            
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'mp4'
        filename = f"{uuid.uuid4()}.{file_ext}"
        
        video_url = upload_video(file.file.read(), filename, content_type=file.content_type, folder="events/videos")
        return {"url": video_url}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, detail=f"Video upload failed: {str(e)}")
