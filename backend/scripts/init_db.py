"""Create missing tables and seed roles in the configured database.

Usage (from backend/):  python -m scripts.init_db
Uses DATABASE_URL from the environment / .env.
"""
from app.main import init_db

if __name__ == "__main__":
    init_db()
    print("Database initialised")
