from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
from fastapi import File, UploadFile
from PIL import Image
import io
import json
import uuid
import logging
import traceback
from ..supabase_client import upload_image, upload_video

logger = logging.getLogger("talent_router")

router = APIRouter(tags=["Talent"])

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

@router.post("/admin/talent", response_model=schemas.TalentProfileResponse)
def create_talent_profile(
    profile: schemas.TalentProfileCreate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    logger.warning(f"[TALENT CREATE] Received payload: user_id={profile.user_id}, stage_name='{profile.stage_name}', category='{profile.category}', bio='{profile.bio}', image_url='{profile.image_url}'")
    
    # Check if exists in the same category
    existing = db.query(models.TalentProfile).filter(
        models.TalentProfile.user_id == profile.user_id,
        models.TalentProfile.category == profile.category
    ).first()
    if existing:
        logger.warning(f"[TALENT CREATE] BLOCKED: user_id={profile.user_id} already has profile in category '{profile.category}' (existing profile id={existing.id})")
        raise HTTPException(status_code=400, detail=f"User already has a talent profile in category '{profile.category}'")
    
    # Check stage name uniqueness: same stage name cannot be used by a DIFFERENT user
    existing_name = db.query(models.TalentProfile).filter(
        models.TalentProfile.stage_name == profile.stage_name,
        models.TalentProfile.user_id != profile.user_id
    ).first()
    if existing_name:
        logger.warning(f"[TALENT CREATE] BLOCKED: stage_name '{profile.stage_name}' already used by user_id={existing_name.user_id}")
        raise HTTPException(status_code=400, detail=f"Stage name '{profile.stage_name}' already taken by another user")

    try:
        data = profile.dict()
        # Serialize list fields to JSON strings for storage
        if data.get("gallery_urls") is not None:
            data["gallery_urls"] = json.dumps(data["gallery_urls"])
        if data.get("included_services") is not None:
            data["included_services"] = json.dumps(data["included_services"])
        
        db_profile = models.TalentProfile(**data)
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        logger.warning(f"[TALENT CREATE] SUCCESS: created profile id={db_profile.id}")
        return db_profile
    except Exception as e:
        db.rollback()
        logger.error(f"[TALENT CREATE] DB ERROR: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/admin/talent", response_model=list[schemas.TalentProfileResponse])
def get_all_talent_profiles(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    profiles = db.query(models.TalentProfile).all()
    return profiles

@router.put("/admin/talent/{profile_id}", response_model=schemas.TalentProfileResponse)
def update_talent_profile(
    profile_id: int,
    profile_update: schemas.TalentProfileUpdate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    db_profile = db.query(models.TalentProfile).filter(models.TalentProfile.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = profile_update.dict(exclude_unset=True)
    # Serialize list fields to JSON strings for storage
    if "gallery_urls" in update_data and update_data["gallery_urls"] is not None:
        update_data["gallery_urls"] = json.dumps(update_data["gallery_urls"])
    if "included_services" in update_data and update_data["included_services"] is not None:
        update_data["included_services"] = json.dumps(update_data["included_services"])
    
    for key, value in update_data.items():
        setattr(db_profile, key, value)

    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/talent", response_model=list[schemas.TalentProfileResponse])
def get_all_active_talents(db: Session = Depends(database.get_db)):
    profiles = db.query(models.TalentProfile).filter(
        models.TalentProfile.is_active == True
    ).all()
    return profiles

@router.get("/talent/{category}", response_model=list[schemas.TalentProfileResponse])
def get_talent_by_category(category: str, db: Session = Depends(database.get_db)):
    profiles = db.query(models.TalentProfile).filter(
        models.TalentProfile.category == category,
        models.TalentProfile.is_active == True
    ).all()
    return profiles

@router.get("/talent/profile/{profile_id}", response_model=schemas.TalentProfileResponse)
def get_talent_profile(profile_id: int, db: Session = Depends(database.get_db)):
    profile = db.query(models.TalentProfile).filter(models.TalentProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.delete("/admin/talent/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_talent_profile(
    profile_id: int,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    db_profile = db.query(models.TalentProfile).filter(models.TalentProfile.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    db.delete(db_profile)
    db.commit()
    return None

@router.post("/admin/talent/upload-image")
async def upload_talent_image(
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, detail="El archivo debe ser una imagen")
        
    try:
        # Open image using Pillow
        image = Image.open(file.file)
        
        # Convert to RGB
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
            
        # Optimization logic
        MAX_SIZE = 2 * 1024 * 1024 # 2MB for talent images
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
        filename = f"{uuid.uuid4()}.webp"
        image_url = upload_image(output_io.getvalue(), filename, folder="talent")
        
        return {"url": image_url}
        
    except Exception as e:
        raise HTTPException(500, detail=f"Image upload failed: {str(e)}")


@router.post("/admin/talent/upload-gallery")
async def upload_gallery_image(
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin)
):
    """Upload a single gallery image for a talent profile."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, detail="El archivo debe ser una imagen")
        
    try:
        image = Image.open(file.file)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
            
        MAX_SIZE = 1 * 1024 * 1024  # 1MB per gallery image
        quality = 85
        output_io = io.BytesIO()
        
        while True:
            output_io.seek(0)
            output_io.truncate()
            image.save(output_io, format="WEBP", quality=quality, optimize=True)
            size = output_io.tell()
            if size <= MAX_SIZE or quality <= 20:
                break
            quality -= 10
            
        filename = f"{uuid.uuid4()}.webp"
        image_url = upload_image(output_io.getvalue(), filename, folder="talent/gallery")
        
        return {"url": image_url}
        
    except Exception as e:
        raise HTTPException(500, detail=f"Gallery image upload failed: {str(e)}")

@router.post("/admin/talent/upload-video")
async def upload_talent_video(
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin)
):
    """Upload a promotional video for a talent profile."""
    if not file.content_type.startswith("video/"):
        raise HTTPException(400, detail="El archivo debe ser un video")
        
    try:
        # Limit video size to ~50MB to avoid overwhelming the server/storage
        # Since we load into memory, for production streaming/large files, direct to S3/Supabase is better.
        # But for this MVP, we process it here.
        file_bytes = await file.read()
        MAX_SIZE = 50 * 1024 * 1024 # 50MB
        if len(file_bytes) > MAX_SIZE:
            raise HTTPException(400, detail="El video excede el límite de 50MB")
            
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'mp4'
        filename = f"{uuid.uuid4()}.{ext}"
        
        video_url = upload_video(file_bytes, filename, content_type=file.content_type, folder="talent/videos")
        
        return {"url": video_url}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, detail=f"Video upload failed: {str(e)}")

