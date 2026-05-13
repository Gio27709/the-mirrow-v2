"""Quick check: verify banner_url column exists."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv()
from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name = 'categories' AND column_name = 'banner_url'"
    ))
    rows = [row[0] for row in result]
    if rows:
        print("OK: banner_url column exists")
    else:
        print("MISSING: banner_url column NOT found")
