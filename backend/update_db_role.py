from app.database import SessionLocal, engine
from sqlalchemy import text

def migrate_roles():
    db = SessionLocal()
    try:
        # 1. Add column if not exists (SQLite doesn't support IF NOT EXISTS in ALTER TABLE mostly, so we wrap in try)
        try:
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user'"))
                conn.commit()
            print("Added role column.")
        except Exception as e:
            print(f"Column might already exist: {e}")

        # 2. Set Owner
        owner_email = "villabonagiovany@gmail.com"
        with engine.connect() as conn:
            conn.execute(text(f"UPDATE users SET role = 'owner' WHERE email = '{owner_email}'"))
            conn.commit()
        print(f"Set {owner_email} as OWNER")

        # 3. Set Admin
        admin_email = "giovanyvillabona@gmail.com"
        with engine.connect() as conn:
            conn.execute(text(f"UPDATE users SET role = 'admin' WHERE email = '{admin_email}'"))
            conn.commit()
        print(f"Set {admin_email} as ADMIN")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_roles()
