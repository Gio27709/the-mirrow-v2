from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import declarative_base, sessionmaker

import os
# Database URL - using the credentials provided
# Database URL - Hybrid Setup
# If 'DATABASE_URL' is set (Supabase/Cloud), use it. Otherwise, default to local SQLite.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# On Vercel the filesystem is read-only: a missing DATABASE_URL must fail loudly
# instead of silently falling back to a local SQLite file.
if os.getenv("VERCEL") and SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    raise RuntimeError("DATABASE_URL is not configured for this deployment")

# Fix for Heroku/Supabase postgres:// urls (SQLAlchemy needs postgresql://)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create Engine
# SQLite needs specific args ("check_same_thread": False) to work with FastAPI
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL (Supabase). Serverless instances are short-lived and the
    # Supabase pooler (port 6543) already pools connections, so don't keep a
    # client-side pool per instance: open/close a connection per request.
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        poolclass=NullPool,
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
