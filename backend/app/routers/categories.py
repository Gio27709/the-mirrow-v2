from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from .. import models, auth, database
from ..supabase_client import upload_image, get_path_from_url, delete_image
from pydantic import BaseModel
import uuid

router = APIRouter(tags=["Categories"])

# ── Banner Specs ──────────────────────────────────────────────
BANNER_RECOMMENDED_WIDTH = 1200
BANNER_RECOMMENDED_HEIGHT = 900
BANNER_MAX_SIZE_MB = 2
BANNER_ASPECT_RATIO = "4:3"

# ── Schemas ───────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    image_url: str | None = None
    icon_name: str | None = "Layers"
    gradient_from: str = "indigo-500"
    gradient_to: str = "purple-500"
    order: int = 0

class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    image_url: str | None = None
    icon_name: str | None = None
    gradient_from: str | None = None
    gradient_to: str | None = None
    order: int | None = None
    is_active: bool | None = None

class CategoryResponse(CategoryCreate):
    id: int
    is_active: bool
    banner_url: str | None = None

    class Config:
        from_attributes = True

# ── Auth Helper ───────────────────────────────────────────────
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

# ── Public Endpoints ──────────────────────────────────────────

@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(database.get_db)):
    """List all active categories ordered by their position."""
    return db.query(models.Category).filter(models.Category.is_active == True).order_by(models.Category.order).all()

@router.get("/categories/banner-specs")
def get_banner_specs():
    """Returns the recommended banner specifications for category images."""
    return {
        "recommended_width": BANNER_RECOMMENDED_WIDTH,
        "recommended_height": BANNER_RECOMMENDED_HEIGHT,
        "max_size_mb": BANNER_MAX_SIZE_MB,
        "aspect_ratio": BANNER_ASPECT_RATIO,
        "allowed_formats": ["JPEG", "PNG", "WebP"],
        "message": f"Tamaño recomendado: {BANNER_RECOMMENDED_WIDTH}×{BANNER_RECOMMENDED_HEIGHT}px (proporción {BANNER_ASPECT_RATIO}). Máximo {BANNER_MAX_SIZE_MB}MB."
    }

# ── Admin CRUD Endpoints ──────────────────────────────────────

@router.post("/admin/categories", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    # Check slug uniqueness
    existing = db.query(models.Category).filter(models.Category.slug == category.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    
    db_cat = models.Category(**category.dict())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.put("/admin/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
        
    update_data = category_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cat, key, value)
        
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.delete("/admin/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Clean up banner from Supabase Storage if exists
    if db_cat.banner_url:
        old_path = get_path_from_url(db_cat.banner_url)
        if old_path:
            delete_image(old_path)
    
    db.delete(db_cat)
    db.commit()
    return None

# ── Banner Upload Endpoint ────────────────────────────────────

@router.post("/admin/categories/{category_id}/banner", response_model=CategoryResponse)
async def upload_category_banner(
    category_id: int,
    file: UploadFile = File(...),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    """Upload a banner image for a category. Stores in Supabase Storage."""
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Tipo de archivo no permitido. Use: JPEG, PNG o WebP"
        )
    
    # Read and validate file size (max 2MB)
    contents = await file.read()
    if len(contents) > BANNER_MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"La imagen excede el tamaño máximo de {BANNER_MAX_SIZE_MB}MB"
        )
    
    # Delete old banner from storage if exists
    if db_cat.banner_url:
        old_path = get_path_from_url(db_cat.banner_url)
        if old_path:
            delete_image(old_path)
    
    # Upload new banner to Supabase Storage
    ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "webp"
    filename = f"banner_{db_cat.slug}_{uuid.uuid4().hex[:8]}.{ext}"
    public_url = upload_image(contents, filename, folder="category-banners")
    
    # Update database record
    db_cat.banner_url = public_url
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.delete("/admin/categories/{category_id}/banner", response_model=CategoryResponse)
def delete_category_banner(
    category_id: int,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    """Remove the banner image from a category."""
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if db_cat.banner_url:
        old_path = get_path_from_url(db_cat.banner_url)
        if old_path:
            delete_image(old_path)
        db_cat.banner_url = None
        db.commit()
        db.refresh(db_cat)
    
    return db_cat
