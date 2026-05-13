from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from PIL import Image
import io
import uuid
from .. import models, schemas, auth, database
from ..supabase_client import upload_image

router = APIRouter(tags=["CMS"])

def get_current_admin(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not user.role or user.role.name not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return user

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

@router.post("/admin/hero-content", response_model=schemas.HeroContentResponse)
def create_hero_content(
    item: schemas.HeroContentCreate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
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
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
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
        
    db.delete(db_item)
    db.commit()
    return {"status": "deleted"}

@router.post("/admin/upload-image")
async def upload_cms_image(
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin)
):
    if not file.content_type.startswith("image/"):
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
        filename = f"cms_{uuid.uuid4()}.webp"
        image_url = upload_image(output_io.getvalue(), filename, folder="cms")
        
        return {"url": image_url}
        
    except Exception as e:
        raise HTTPException(500, detail=f"Image upload failed: {str(e)}")

