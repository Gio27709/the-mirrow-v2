from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from .. import models, schemas, auth, database

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
        
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    db.delete(user)
    db.commit()
    return {"status": "deleted"}

@router.put("/admin/users/{user_id}")
def update_user_details_admin(
    user_id: int,
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    role: Optional[str] = None, # "user", "admin"
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.role and user.role.name == "owner" and current_admin.id != user.id:
         raise HTTPException(status_code=403, detail="Cannot edit Owner")

    # Role Update Logic
    if role is not None:
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
        "recent_users": recent_users
    }
