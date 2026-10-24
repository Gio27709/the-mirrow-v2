from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
import logging
import uuid
from .. import models, schemas, auth, database, supabase_client

logger = logging.getLogger("admin_router")

router = APIRouter(tags=["Admin"])

def get_current_admin(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    # Check role via relationship. Handle case where role might be None (shouldnt happen but safety first)
    if not user or not user.role or user.role.name not in ["admin", "owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return user

def _is_owner(user: models.User) -> bool:
    return bool(user.role and user.role.name == "owner")

def _ensure_can_manage(current_admin: models.User, target: models.User, new_role: Optional[str] = None):
    """Only the owner may manage admins or grant the admin role; nobody can grant owner."""
    if new_role == "owner":
        raise HTTPException(status_code=403, detail="Cannot assign Owner role")
    target_is_admin = bool(target.role and target.role.name == "admin")
    if (target_is_admin or new_role == "admin") and not _is_owner(current_admin):
        raise HTTPException(status_code=403, detail="Only the Owner can manage admins")

@router.put("/admin/users/{user_id}/role")
def update_user_role(
    user_id: int, 
    role: str, # "user", "admin"
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # OWNER PROTECTION
    if target_user.role and target_user.role.name == "owner":
        raise HTTPException(status_code=403, detail="Cannot modify Owner role")
    _ensure_can_manage(current_admin, target_user, role)

    # Find Role ID
    role_obj = db.query(models.Role).filter(models.Role.name == role).first()
    if not role_obj:
         raise HTTPException(status_code=400, detail="Invalid role")

    target_user.role_id = role_obj.id
    db.commit()
    return {"status": "success", "role": role}

@router.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.role and user.role.name == "owner":
        raise HTTPException(status_code=403, detail="Cannot delete Owner")
    _ensure_can_manage(current_admin, user)
        
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    db.delete(user)
    db.commit()
    return {"status": "deleted"}

@router.put("/admin/users/{user_id}", response_model=schemas.UserResponse)
def update_user_details_admin(
    user_id: int,
    payload: schemas.AdminUserUpdate,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    full_name = payload.full_name
    email = payload.email
    role = payload.role

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.role and user.role.name == "owner" and current_admin.id != user.id:
         raise HTTPException(status_code=403, detail="Cannot edit Owner")
    # Nobody may grant the Owner role, not even to themselves
    if role == "owner" and not (user.role and user.role.name == "owner"):
        raise HTTPException(status_code=403, detail="Cannot assign Owner role")
    if current_admin.id != user.id:
        _ensure_can_manage(current_admin, user, role)

    # Role Update Logic
    if role is not None and not (user.role and user.role.name == role):
        if user.role and user.role.name == "owner":
             raise HTTPException(status_code=403, detail="Cannot change Owner role")
        
        # Verify role exists
        role_obj = db.query(models.Role).filter(models.Role.name == role).first()
        if not role_obj:
             raise HTTPException(status_code=400, detail="Invalid role")
             
        user.role_id = role_obj.id

    if full_name is not None:
        user.full_name = full_name
    if email is not None:
        # Check uniqueness if email changing
        if email != user.email:
             existing = db.query(models.User).filter(models.User.email == email).first()
             if existing:
                 raise HTTPException(status_code=400, detail="Email already used")
        user.email = email
        
    db.commit()
    db.refresh(user) # Refresh to load relationships
    return user

@router.get("/admin/users", response_model=list[schemas.UserResponse])
def get_all_users(admin: models.User = Depends(get_current_admin), db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    return users

@router.get("/admin/stats")
def get_admin_stats(admin: models.User = Depends(get_current_admin), db: Session = Depends(database.get_db)):
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.is_active == True).count()
    google_users = db.query(models.User).filter(models.User.auth_provider == models.AuthProvider.GOOGLE).count()
    email_users = db.query(models.User).filter(models.User.auth_provider == models.AuthProvider.EMAIL).count()
    
    # Recent users (last 5)
    recent_users = db.query(models.User).order_by(models.User.id.desc()).limit(5).all()
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "google_users": google_users,
        "email_users": email_users,
        "recent_users": [schemas.UserResponse.model_validate(u) for u in recent_users]
    }


# ============================================
# DIRECT-TO-STORAGE UPLOADS
# ============================================
# Vercel Functions reject request bodies over 4.5 MB, so large files (videos,
# big images) are uploaded by the browser straight to Supabase Storage using a
# short-lived signed upload URL issued here.

MB = 1024 * 1024
UPLOAD_MAX_BYTES = {"image": 10 * MB, "video": 50 * MB}

# content-type -> (extension, kind)
UPLOAD_CONTENT_TYPES = {
    "image/jpeg": ("jpg", "image"),
    "image/png": ("png", "image"),
    "image/webp": ("webp", "image"),
    "video/mp4": ("mp4", "video"),
    "video/webm": ("webm", "video"),
    "video/ogg": ("ogv", "video"),
    "video/quicktime": ("mov", "video"),
}

# folder -> kind of file it accepts
UPLOAD_FOLDERS = {
    "events": "image",
    "events/videos": "video",
    "talent": "image",
    "talent/gallery": "image",
    "talent/videos": "video",
    "cms": "image",
    "category-banners": "image",
}


@router.post("/admin/storage/signed-upload", response_model=schemas.SignedUploadResponse)
def create_signed_upload(
    payload: schemas.SignedUploadRequest,
    current_admin: models.User = Depends(get_current_admin),
):
    folder = payload.folder.strip("/")
    if folder not in UPLOAD_FOLDERS:
        raise HTTPException(status_code=400, detail="Carpeta de destino no permitida")

    content_type = (payload.content_type or "").lower().split(";")[0].strip()
    if content_type not in UPLOAD_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Tipo de archivo no permitido. Imágenes: JPEG, PNG o WebP. Videos: MP4, WebM, OGG o MOV",
        )
    ext, kind = UPLOAD_CONTENT_TYPES[content_type]
    if UPLOAD_FOLDERS[folder] != kind:
        raise HTTPException(
            status_code=400,
            detail="Esta carpeta solo admite " + ("videos" if UPLOAD_FOLDERS[folder] == "video" else "imágenes"),
        )

    max_bytes = UPLOAD_MAX_BYTES[kind]
    if payload.size > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"El archivo supera el máximo de {max_bytes // MB} MB",
        )

    # Never trust the client filename for the object path
    path = f"{folder}/{uuid.uuid4().hex}.{ext}"
    try:
        result = supabase_client.create_signed_upload(path)
    except Exception as exc:
        logger.error("Signed upload URL creation failed for %s: %s", path, exc)
        raise HTTPException(status_code=502, detail="No se pudo preparar la subida del archivo")
    return result
