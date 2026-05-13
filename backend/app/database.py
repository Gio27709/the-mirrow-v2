from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import os
# Database URL - using the credentials provided
# Database URL - Hybrid Setup
# If 'DATABASE_URL' is set (Supabase/Cloud), use it. Otherwise, default to local SQLite.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

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
    # PostgreSQL (Supabase) - requires SSL
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
