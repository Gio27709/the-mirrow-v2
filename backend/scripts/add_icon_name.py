import os
import sys
from sqlalchemy import text

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.database import engine

def run_migration():
    with engine.connect() as connection:
        try:
            connection.execute(text("ALTER TABLE categories ADD COLUMN icon_name VARCHAR DEFAULT 'Layers'"))
            connection.commit()
            print("Columna icon_name añadida correctamente.")
        except Exception as e:
            print(f"Error o la columna ya existe: {e}")

if __name__ == "__main__":
    run_migration()
