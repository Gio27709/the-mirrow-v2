"""
Migration: Add new configurable fields to talent_profiles table.
Uses SQLAlchemy + the real DATABASE_URL from .env to alter the Supabase/Postgres table.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

NEW_COLUMNS = [
    # (column_name, sql_type, default)
    ("base_price", "DOUBLE PRECISION", None),
    ("price_currency", "VARCHAR", "'USD'"),
    ("price_unit", "VARCHAR", "'Evento'"),
    ("location", "VARCHAR", None),
    ("is_available", "BOOLEAN", "TRUE"),
    ("gallery_urls", "TEXT", None),
    ("video_url", "VARCHAR", None),
    ("instagram_url", "VARCHAR", None),
    ("facebook_url", "VARCHAR", None),
    ("website_url", "VARCHAR", None),
    ("tiktok_url", "VARCHAR", None),
    ("youtube_url", "VARCHAR", None),
    ("included_services", "TEXT", None),
]

def migrate():
    with engine.connect() as conn:
        # Check existing columns
        result = conn.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'talent_profiles'"
        ))
        existing_columns = {row[0] for row in result.fetchall()}
        print(f"Existing columns: {existing_columns}")
        
        added = []
        skipped = []
        
        for col_name, col_type, default in NEW_COLUMNS:
            if col_name in existing_columns:
                skipped.append(col_name)
                continue
            
            default_clause = f" DEFAULT {default}" if default is not None else ""
            sql = f"ALTER TABLE talent_profiles ADD COLUMN {col_name} {col_type}{default_clause}"
            
            try:
                conn.execute(text(sql))
                added.append(col_name)
                print(f"  [OK] Added column: {col_name} ({col_type})")
            except Exception as e:
                print(f"  [ERR] Error adding {col_name}: {e}")
        
        conn.commit()
        
        print(f"\nMigration Summary:")
        print(f"  Added:   {len(added)} columns")
        print(f"  Skipped: {len(skipped)} (already exist)")
        if skipped:
            print(f"  Existing: {', '.join(skipped)}")

if __name__ == "__main__":
    print("Migrating talent_profiles table (PostgreSQL)...")
    migrate()
    print("Done!")
