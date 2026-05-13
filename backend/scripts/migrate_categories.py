import os
import sys
from sqlalchemy import text

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.database import engine

def migrate_categories():
    with engine.connect() as connection:
        try:
            # 1. Renombrar Teatro -> Artes Escénicas
            connection.execute(text("""
                UPDATE categories 
                SET name = 'Artes Escénicas', slug = 'artes-escenicas', icon_name = 'Theater' 
                WHERE name = 'Teatro' OR slug = 'theater'
            """))
            print("Teatro actualizado a Artes Escénicas")

            # 2. Renombrar Billar -> Danzas Contemporáneas
            connection.execute(text("""
                UPDATE categories 
                SET name = 'Danzas Contemporáneas', slug = 'danzas-contemporaneas', icon_name = 'Activity' 
                WHERE name = 'Billar' OR slug = 'billiards'
            """))
            print("Billar actualizado a Danzas Contemporáneas")

            # 3. Asegurar iconos en las demás categorías
            connection.execute(text("UPDATE categories SET icon_name = 'Music' WHERE slug = 'musicos'"))
            connection.execute(text("UPDATE categories SET icon_name = 'Disc3' WHERE slug = 'djs'"))
            connection.execute(text("UPDATE categories SET icon_name = 'Mic2' WHERE slug = 'cantantes'"))
            print("Íconos actualizados en Músicos, DJs y Cantantes")

            # 4. Eliminar "Eventos" de las categorías
            connection.execute(text("DELETE FROM categories WHERE slug = 'eventos' OR name = 'Eventos'"))
            print("Categoría 'Eventos' eliminada")

            # 5. Migrar perfiles de talento viejos a los slugs nuevos
            connection.execute(text("UPDATE talent_profiles SET category = 'artes-escenicas' WHERE category = 'theater'"))
            connection.execute(text("UPDATE talent_profiles SET category = 'danzas-contemporaneas' WHERE category = 'billiards'"))
            connection.execute(text("UPDATE talent_profiles SET category = 'musicos' WHERE category = 'musician'"))
            connection.execute(text("UPDATE talent_profiles SET category = 'djs' WHERE category = 'dj'"))
            connection.execute(text("UPDATE talent_profiles SET category = 'cantantes' WHERE category = 'singer'"))
            print("Perfiles de talento migrados a nuevos slugs")

            connection.commit()
            print("Migración completada exitosamente.")
        except Exception as e:
            print(f"Error en la migración: {e}")

if __name__ == "__main__":
    migrate_categories()
