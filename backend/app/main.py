from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from . import models, database
from .database import engine
from .routers import auth, users, admin, talent, cms, categories, events, tickets

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="The Mirrow API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.getenv(
        "CORS_ORIGINS",
        "https://the-mirrow-v2frontend.vercel.app,http://localhost:3000,http://127.0.0.1:3000",
    ).split(",") if o.strip()],
    # Vercel preview deployments of the frontend
    allow_origin_regex=r"https://the-mirrow-v2frontend-[a-z0-9-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event to Seed Roles
@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    try:
        roles = ["owner", "admin", "user"]
        for role_name in roles:
            existing = db.query(models.Role).filter(models.Role.name == role_name).first()
            if not existing:
                print(f"Seeding missing role: {role_name}")
                new_role = models.Role(name=role_name, description=f"System {role_name}")
                db.add(new_role)
        db.commit()
    finally:
        db.close()

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(talent.router)
app.include_router(cms.router)
app.include_router(categories.router)
app.include_router(events.router)
app.include_router(tickets.router)

