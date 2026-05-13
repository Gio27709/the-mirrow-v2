from app.database import engine, Base
from app.models import HeroContent, ContentType

print("Creating Hero Content table...")
HeroContent.__table__.create(bind=engine)
print("Table created successfully!")
