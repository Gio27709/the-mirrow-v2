from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from PIL import Image
import io
import uuid
from .. import models, schemas, auth, database
from ..supabase_client import upload_image, delete_image, get_path_from_url

router = APIRouter(tags=["Users"])

@router.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/me", response_model=schemas.UserResponse)
def update_user_me(
    user_update: schemas.UserUpdate,
    token: str = Depends(auth.oauth2_scheme),
    db: Session = Depends(database.get_db)
):
    # Authenticate
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    if user_update.username is not None:
        # Check if username exists and is not this user
        existing = db.query(models.User).filter(models.User.username == user_update.username).first()
        if existing and existing.id != user.id:
            raise HTTPException(status_code=400, detail="Username already taken")
        user.username = user_update.username
        
    db.commit()
    db.refresh(user)
    return user

@router.put("/users/me/password")
def update_password(
    password_data: schemas.UserPasswordUpdate,
    token: str = Depends(auth.oauth2_scheme),
    db: Session = Depends(database.get_db)
):
    # Authenticate
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify old password
    if not auth.verify_password(password_data.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    # Update with new hashed password
    user.hashed_password = auth.get_password_hash(password_data.new_password)
    db.commit()
    
    return {"status": "success", "message": "Password updated successfully"}

@router.post("/users/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    token: str = Depends(auth.oauth2_scheme),
    db: Session = Depends(database.get_db)
):
    # Authenticate
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Validation
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, detail="File must be an image")
        
    try:
        # Open image using Pillow
        image = Image.open(file.file)
        
        # Convert to RGB (required for saving as WEBP if original is RGBA)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
            
        # Target size: 1MB
        MAX_SIZE = 1 * 1024 * 1024
        quality = 90
        output_io = io.BytesIO()
        
        # Compression loop
        while True:
            output_io.seek(0)
            output_io.truncate()
            image.save(output_io, format="WEBP", quality=quality, optimize=True)
            
            size = output_io.tell()
            if size <= MAX_SIZE or quality <= 10:
                break
                
            quality -= 10

        # Delete old avatar from Supabase if it exists
        if user.profile_image_url:
            old_path = get_path_from_url(user.profile_image_url)
            if old_path:
                delete_image(old_path)
            
        # Upload to Supabase Storage
        filename = f"{uuid.uuid4()}.webp"
        image_url = upload_image(output_io.getvalue(), filename, folder="avatars")
        
        # Update URL in database
        user.profile_image_url = image_url
        db.commit()
        
        return {"url": image_url}
        
    except Exception as e:
        raise HTTPException(500, detail=f"Image processing failed: {str(e)}")

