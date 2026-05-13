import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from app.models import Base, EventTicket
from app.database import engine

print("Creating EventTicket table...")
Base.metadata.create_all(bind=engine, tables=[EventTicket.__table__])
print("Done!")
