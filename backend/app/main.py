from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from . import models, database
from .database import engine
from .routers import auth, users, admin, talent, cms, categories, events, tickets

IS_SERVERLESS = bool(os.getenv("VERCEL"))


def init_db():
    """Create missing tables and seed the system roles.

    Runs automatically in local development. On Vercel it would add several
    database round-trips to every cold start, so production runs it on demand
    with `python -m scripts.init_db` (or by setting INIT_DB=1 once).
    """
    models.Base.metadata.create_all(bind=engine)
    db = database.SessionLocal()
    try:
        for role_name in ["owner", "admin", "user"]:
            existing = db.query(models.Role).filter(models.Role.name == role_name).first()
            if not existing:
                print(f"Seeding missing role: {role_name}")
                db.add(models.Role(name=role_name, description=f"System {role_name}"))
        db.commit()
    finally:
        db.close()


if not IS_SERVERLESS or os.getenv("INIT_DB") == "1":
    init_db()

# Interactive API docs only outside production (set ENABLE_DOCS=1 to force them on)
_docs_enabled = not IS_SERVERLESS or os.getenv("ENABLE_DOCS") == "1"
app = FastAPI(
    title="The Mirrow API",
    docs_url="/docs" if _docs_enabled else None,
    redoc_url="/redoc" if _docs_enabled else None,
    openapi_url="/openapi.json" if _docs_enabled else None,
)

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

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(talent.router)
app.include_router(cms.router)
app.include_router(categories.router)
app.include_router(events.router)
app.include_router(tickets.router)

