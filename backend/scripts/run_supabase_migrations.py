import os
import sys
from dotenv import load_dotenv
from sqlalchemy import text, create_engine

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Cargar variables de entorno (fundamental para conectarnos a Supabase y no al SQLite por defecto)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    # Reemplazar puerto 6543 (pooler) por 5432 (directo) para permitir ALTER TABLE
    DATABASE_URL = DATABASE_URL.replace(":6543/", ":5432/")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def run():
    print("Conectando a Supabase...")
    with engine.begin() as connection:
        try:
            print("1. Agregando columna icon_name a categories...")
            connection.execute(text("ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_name VARCHAR DEFAULT 'Layers'"))
        except Exception as e:
            print(f"Aviso en columna icon_name: {e}")

        print("2. Renombrando categorías y asignando iconos...")
        connection.execute(text("""
            UPDATE categories 
            SET name = 'Artes Escénicas', slug = 'artes-escenicas', icon_name = 'Theater' 
            WHERE name = 'Teatro' OR slug = 'theater'
        """))
        
        connection.execute(text("""
            UPDATE categories 
            SET name = 'Danzas Contemporáneas', slug = 'danzas-contemporaneas', icon_name = 'Activity' 
            WHERE name = 'Billar' OR slug = 'billiards'
        """))
        
        connection.execute(text("UPDATE categories SET icon_name = 'Music' WHERE slug = 'musicos'"))
        connection.execute(text("UPDATE categories SET icon_name = 'Disc3' WHERE slug = 'djs'"))
        connection.execute(text("UPDATE categories SET icon_name = 'Mic2' WHERE slug = 'cantantes'"))
        
        print("3. Eliminando categoría Eventos...")
        connection.execute(text("DELETE FROM categories WHERE slug = 'eventos' OR name = 'Eventos'"))

        print("4. Actualizando perfiles de talento con nuevos slugs...")
        connection.execute(text("UPDATE talent_profiles SET category = 'artes-escenicas' WHERE category = 'theater'"))
        connection.execute(text("UPDATE talent_profiles SET category = 'danzas-contemporaneas' WHERE category = 'billiards'"))
        connection.execute(text("UPDATE talent_profiles SET category = 'musicos' WHERE category = 'musician'"))
        connection.execute(text("UPDATE talent_profiles SET category = 'djs' WHERE category = 'dj'"))
        connection.execute(text("UPDATE talent_profiles SET category = 'cantantes' WHERE category = 'singer'"))

    print("¡Migración en Supabase completada con éxito!")

if __name__ == "__main__":
    run()
