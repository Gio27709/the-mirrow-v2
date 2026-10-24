from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from sqlalchemy.orm import Session
from PIL import Image
import io
import uuid
from .. import models, schemas, database
from ..supabase_client import upload_image, delete_file_by_url
from .admin import get_current_admin

router = APIRouter(tags=["CMS"])

# Folders the generic image endpoint may write to
CMS_IMAGE_FOLDERS = {"cms", "events"}

def _require_text(value, message: str):
    if value is not None and not str(value).strip():
        raise HTTPException(status_code=422, detail=message)

@router.post("/leads", response_model=schemas.LeadResponse)
def create_lead(lead: schemas.LeadCreate, db: Session = Depends(database.get_db)):
    db_lead = models.Lead(
        full_name=lead.full_name,
        email=lead.email,
        phone=lead.phone,
        message=lead.message,
        inquiry_type=lead.inquiry_type,
        source=lead.source or "web"
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/admin/leads", response_model=list[schemas.LeadResponse])
def get_leads(admin: models.User = Depends(get_current_admin), db: Session = Depends(database.get_db)):
    leads = db.query(models.Lead).order_by(models.Lead.created_at.desc()).all()
    return leads

@router.patch("/admin/leads/{lead_id}/read")
def toggle_lead_read(lead_id: int, admin: models.User = Depends(get_current_admin), db: Session = Depends(database.get_db)):
    lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.is_read = not lead.is_read
    db.commit()
    return {"status": "updated", "is_read": lead.is_read}

@router.get("/hero-content", response_model=list[schemas.HeroContentResponse])
def get_hero_content(db: Session = Depends(database.get_db)):
    items = db.query(models.HeroContent).filter(models.HeroContent.is_active == True).order_by(models.HeroContent.order).all()
    return items

@router.get("/admin/hero-content", response_model=list[schemas.HeroContentResponse])
def get_all_hero_content(admin: models.User = Depends(get_current_admin), db: Session = Depends(database.get_db)):
    """All slides/cards, including inactive ones (admin only)."""
    return db.query(models.HeroContent).order_by(models.HeroContent.order, models.HeroContent.id).all()

@router.post("/admin/hero-content", response_model=schemas.HeroContentResponse)
def create_hero_content(
    item: schemas.HeroContentCreate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    _require_text(item.title, "El título es obligatorio")
    _require_text(item.image_url, "La imagen es obligatoria")
    db_item = models.HeroContent(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/admin/hero-content/{item_id}", response_model=schemas.HeroContentResponse)
def update_hero_content(
    item_id: int,
    item_update: schemas.HeroContentUpdate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    db_item = db.query(models.HeroContent).filter(models.HeroContent.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Content not found")
    
    update_data = item_update.dict(exclude_unset=True)
    for field, message in (("title", "El título es obligatorio"), ("image_url", "La imagen es obligatoria")):
        if field in update_data:
            if update_data[field] is None:
                raise HTTPException(status_code=422, detail=message)
            _require_text(update_data[field], message)

    old_image = db_item.image_url
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    if old_image and old_image != db_item.image_url:
        delete_file_by_url(old_image)
    return db_item

@router.delete("/admin/hero-content/{item_id}")
def delete_hero_content(
    item_id: int,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    db_item = db.query(models.HeroContent).filter(models.HeroContent.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Content not found")

    old_image = db_item.image_url
    db.delete(db_item)
    db.commit()
    delete_file_by_url(old_image)
    return {"status": "deleted"}

@router.post("/admin/upload-image")
async def upload_cms_image(
    file: UploadFile = File(...),
    folder: str = Query("cms"),
    admin: models.User = Depends(get_current_admin)
):
    if folder not in CMS_IMAGE_FOLDERS:
        raise HTTPException(400, detail="Carpeta de destino no permitida")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, detail="File must be an image")
        
    try:
        # Open image using Pillow
        image = Image.open(file.file)
        
        # Convert to RGB
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
            
        # Optimization logic
        MAX_SIZE = 2 * 1024 * 1024 # 2MB for hero images
        quality = 90
        output_io = io.BytesIO()
        
        while True:
            output_io.seek(0)
            output_io.truncate()
            image.save(output_io, format="WEBP", quality=quality, optimize=True)
            
            size = output_io.tell()
            if size <= MAX_SIZE or quality <= 20:
                break
                
            quality -= 10
            
        # Upload to Supabase Storage
        filename = f"{folder}_{uuid.uuid4()}.webp"
        image_url = upload_image(output_io.getvalue(), filename, folder=folder)
        
        return {"url": image_url}
        
    except Exception as e:
        raise HTTPException(500, detail=f"Image upload failed: {str(e)}")

