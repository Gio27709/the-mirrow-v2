"""
Seed demo data for talent profile ID 2 with the showcase configuration.
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

PROFILE_ID = 2

gallery = json.dumps([
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=1000",
])

services = json.dumps([
    "Equipo de Sonido Incluido",
    "Transporte (Zona Centro)",
    "Seguro de Cancelacion",
])

with engine.connect() as conn:
    conn.execute(text("""
        UPDATE talent_profiles SET
            base_price = :price,
            price_currency = :currency,
            price_unit = :unit,
            location = :location,
            is_available = TRUE,
            gallery_urls = :gallery,
            video_url = :video,
            instagram_url = :ig,
            facebook_url = :fb,
            website_url = :web,
            included_services = :services
        WHERE id = :pid
    """), {
        "price": 350.0,
        "currency": "USD",
        "unit": "Evento",
        "location": "Disponible Globalmente",
        "gallery": gallery,
        "video": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "ig": "https://instagram.com/djmaspequeño",
        "fb": "https://facebook.com/djmaspequeño",
        "web": "https://themirrow.com",
        "services": services,
        "pid": PROFILE_ID,
    })
    conn.commit()
    print(f"Profile ID {PROFILE_ID} updated with demo data!")
