"""
Migration Script: Add banner_url column to categories table.
Run this once after deploying the model changes.

Usage:
  cd backend
  python -m scripts.migrate_banner_url
"""
import os
import sys

# Add parent directory to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.database import engine

def migrate():
    """Add banner_url column to categories table if it doesn't exist."""
    with engine.connect() as conn:
        # Check if column already exists
        if engine.url.drivername.startswith("sqlite"):
            result = conn.execute(text("PRAGMA table_info(categories)"))
            columns = [row[1] for row in result]
        else:
            # PostgreSQL
            result = conn.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = 'categories' AND column_name = 'banner_url'"
            ))
            columns = [row[0] for row in result]
        
        if "banner_url" in columns:
            print("[OK] Column 'banner_url' already exists. Nothing to do.")
            return
        
        # Add the column
        conn.execute(text("ALTER TABLE categories ADD COLUMN banner_url VARCHAR"))
        conn.commit()
        print("[OK] Column 'banner_url' added to 'categories' table successfully.")

if __name__ == "__main__":
    migrate()
