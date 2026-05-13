import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Cargar variables de entorno
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    # Reemplazar puerto 6543 (pooler) por 5432 (directo) para permitir DDL
    DATABASE_URL = DATABASE_URL.replace(":6543/", ":5432/")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def run():
    print("Conectando a Supabase para crear tablas nuevas...")
    from app.models import Base
    Base.metadata.create_all(bind=engine)
    print("¡Tablas creadas (o actualizadas si no existían) con éxito!")

if __name__ == "__main__":
    run()
