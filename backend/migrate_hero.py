from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        print("Migrating hero_content table...")
        try:
            conn.execute(text('ALTER TABLE hero_content ADD COLUMN "order" INTEGER DEFAULT 0'))
            print("Added 'order' column.")
        except Exception as e:
            print(f"Could not add 'order' column (might exist): {e}")

        try:
            conn.execute(text('ALTER TABLE hero_content ADD COLUMN is_active BOOLEAN DEFAULT 1'))
            print("Added 'is_active' column.")
        except Exception as e:
            print(f"Could not add 'is_active' column (might exist): {e}")
            
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
