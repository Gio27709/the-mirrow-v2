from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional
import os
import uuid
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv

from .. import models, schemas, auth, database

load_dotenv()

router = APIRouter(tags=["Authentication"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
if not GOOGLE_CLIENT_ID:
    # Fallback for dev if env missing, but warn
    print("WARNING: GOOGLE_CLIENT_ID not set in env, using hardcoded default for DEV ONLY")
    GOOGLE_CLIENT_ID = "590205845416-efrc9ehv81cakm7bh8atejobn72i30kb.apps.googleusercontent.com"

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        accepts_notifications=user.accepts_notifications,
        auth_provider=models.AuthProvider.EMAIL
    )
    
    # SAFETY NET: Check for Owner Email
    owner_email = os.getenv("OWNER_EMAIL", "villabonagiovany@gmail.com")
    
    if user.email == owner_email:
        # It's the Boss! Assign Owner Role
        owner_role = db.query(models.Role).filter(models.Role.name == "owner").first()
        if owner_role:
             new_user.role_id = owner_role.id
    else:
        # Regular user
        user_role = db.query(models.Role).filter(models.Role.name == "user").first()
        if user_role:
            new_user.role_id = user_role.id
        
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google-login", response_model=schemas.Token)
def google_login(token_data: schemas.Token, db: Session = Depends(database.get_db)):
    try:
        # Verify the token
        id_info = id_token.verify_oauth2_token(
            token_data.access_token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )

        email = id_info['email']
        
        # Check if user exists
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if not user:
            # Create user
            # Set a random unusable password
            random_password = str(uuid.uuid4())
            hashed_password = auth.get_password_hash(random_password)
            
            user = models.User(
                email=email,
                hashed_password=hashed_password,
                accepts_notifications=True, # Implicit consent for OAuth
                auth_provider=models.AuthProvider.GOOGLE,
                is_active=True,
                full_name=id_info.get('name'),
                profile_image_url=id_info.get('picture')
            )
            
            # SAFETY NET: Check for Owner Email
            owner_email = os.getenv("OWNER_EMAIL", "villabonagiovany@gmail.com")

            if email == owner_email:
                 # It's the Boss! Assign Owner Role
                owner_role = db.query(models.Role).filter(models.Role.name == "owner").first()
                if owner_role:
                    user.role_id = owner_role.id
            else:
                 # Regular user
                user_role = db.query(models.Role).filter(models.Role.name == "user").first()
                if user_role:
                    user.role_id = user_role.id
            
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Create JWT
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    except ValueError as e:
        # Return exact error for debugging
        raise HTTPException(status_code=400, detail=f"Invalid Google Token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google Login failed: {str(e)}")
