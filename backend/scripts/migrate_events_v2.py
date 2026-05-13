"""
Migration script: Add new columns for Events v2, EventZone, EventLineup, and Lead improvements.
Run this ONCE after updating models.py
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from sqlalchemy import text
from app.database import engine

MIGRATIONS = [
    # --- Lead improvements ---
    "ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT",
    "ALTER TABLE leads ADD COLUMN IF NOT EXISTS inquiry_type VARCHAR",
    "ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR DEFAULT 'web'",
    "ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE",
    
    # --- Event new columns ---
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_name VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_address VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS city VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity INTEGER",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS min_age VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS dress_code VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS flyer_url VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS video_promo_url VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_url VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS free_entry BOOLEAN DEFAULT FALSE",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS reservation_required BOOLEAN DEFAULT FALSE",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_email VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_phone VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_instagram VARCHAR",
    "ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_name VARCHAR",
    
    # --- New tables: event_zones ---
    """CREATE TABLE IF NOT EXISTS event_zones (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR NOT NULL,
        price VARCHAR,
        capacity INTEGER,
        perks VARCHAR,
        is_sold_out BOOLEAN DEFAULT FALSE,
        "order" INTEGER DEFAULT 0
    )""",
    
    # --- New tables: event_lineup ---
    """CREATE TABLE IF NOT EXISTS event_lineup (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        artist_name VARCHAR NOT NULL,
        talent_id INTEGER REFERENCES talent_profiles(id),
        set_time VARCHAR,
        role VARCHAR,
        image_url VARCHAR,
        "order" INTEGER DEFAULT 0
    )""",
]

def run():
    print("[*] Running Events v2 migration...")
    with engine.connect() as conn:
        for i, sql in enumerate(MIGRATIONS):
            try:
                conn.execute(text(sql))
                conn.commit()
                label = sql.strip()[:60].replace("\n"," ")
                print(f"  [OK] [{i+1}/{len(MIGRATIONS)}] {label}...")
            except Exception as e:
                conn.rollback()
                print(f"  [SKIP] [{i+1}/{len(MIGRATIONS)}] Skipped: {str(e)[:80]}")
    print("\n[DONE] Migration complete!")

if __name__ == "__main__":
    run()
