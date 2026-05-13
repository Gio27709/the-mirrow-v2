from sqlalchemy import Boolean, Column, Integer, String, Enum, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from .database import Base
import enum

class AuthProvider(str, enum.Enum):
    EMAIL = "email"
    GOOGLE = "google"

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # owner, admin, user
    description = Column(String, nullable=True)
    
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True) 
    hashed_password = Column(String, nullable=True) 
    
    # Profile
    full_name = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    
    # Preferences 
    accepts_notifications = Column(Boolean, default=False, nullable=False)
    
    # System
    is_active = Column(Boolean, default=True)
    auth_provider = Column(String, default=AuthProvider.EMAIL)
    
    # Role Relationship
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")

from sqlalchemy.sql import func
from sqlalchemy import DateTime

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, index=True, nullable=False)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=True)           # Message from contact form
    inquiry_type = Column(String, nullable=True)     # "evento", "general", "cotizacion", "talento"
    source = Column(String, default="web")           # "web", "whatsapp", "landing"
    is_read = Column(Boolean, default=False)         # Admin read status
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContentType(str, enum.Enum):
    CAROUSEL = "carousel"
    CARD = "card"

class HeroContent(Base):
    __tablename__ = "hero_content"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, default=ContentType.CAROUSEL) # carousel, card
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    cta_text = Column(String, nullable=True)
    cta_link = Column(String, nullable=True)
    bg_gradient = Column(String, nullable=True) # CSS class or value
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)


class TalentProfile(Base):
    __tablename__ = "talent_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stage_name = Column(String, index=True, nullable=False)
    category = Column(String, nullable=False) # Stores category slug
    bio = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    rating = Column(Float, default=5.0)
    
    # --- Pricing & Location ---
    base_price = Column(Float, nullable=True)            # e.g. 350.0
    price_currency = Column(String, default="USD")       # "USD", "EUR", "VES"
    price_unit = Column(String, default="Evento")        # "Evento", "Hora", "Show"
    location = Column(String, nullable=True)             # "Caracas, Venezuela"
    is_available = Column(Boolean, default=True)         # Available for booking?
    
    # --- Media Gallery ---
    gallery_urls = Column(Text, nullable=True)           # JSON array of image URLs
    video_url = Column(String, nullable=True)            # YouTube/video URL
    
    # --- Social Media ---
    instagram_url = Column(String, nullable=True)
    facebook_url = Column(String, nullable=True)
    website_url = Column(String, nullable=True)
    tiktok_url = Column(String, nullable=True)
    youtube_url = Column(String, nullable=True)
    
    # --- Services Included ---
    included_services = Column(Text, nullable=True)      # JSON array of strings
    
    user = relationship("User", back_populates="talent_profiles")

# Add back_populates to User model
User.talent_profiles = relationship("TalentProfile", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    banner_url = Column(String, nullable=True)  # Banner image for Explore page (4:3, 1200x900)
    
    # Design Tokens
    gradient_from = Column(String, default="indigo-500")
    gradient_to = Column(String, default="purple-500")
    icon_name = Column(String, default="Layers", nullable=True)
    
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)


# ============================================
# EVENT SYSTEM — Full Professional Model
# ============================================

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    
    # --- Basic Info ---
    title = Column(String, index=True, nullable=False)
    type = Column(String, nullable=True)              # e.g. "Concierto / DJ", "Festival"
    description = Column(Text, nullable=True)         # Rich description of the event
    date = Column(String, nullable=True)              # e.g. "15 Octubre 2026"
    time = Column(String, nullable=True)              # e.g. "20:00 - 02:00"
    
    # --- Venue / Location ---
    location = Column(String, nullable=True)          # Legacy field (venue name)
    venue_name = Column(String, nullable=True)        # Name of the venue
    venue_address = Column(String, nullable=True)     # Full address / Google Maps link
    city = Column(String, nullable=True)              # City
    capacity = Column(Integer, nullable=True)         # Max capacity
    min_age = Column(String, nullable=True)           # "18+", "Todo Público"
    dress_code = Column(String, nullable=True)        # Dress code if applicable
    
    # --- Media ---
    image_url = Column(String, nullable=True)         # Cover image
    flyer_url = Column(String, nullable=True)         # Flyer / poster image
    video_promo_url = Column(String, nullable=True)   # Promo video link (YouTube/IG)
    
    # --- Pricing & Tickets ---
    price = Column(String, nullable=True)             # e.g. "Desde $25"
    ticket_url = Column(String, nullable=True)        # External ticket purchase link
    free_entry = Column(Boolean, default=False)       # Is it free entry?
    reservation_required = Column(Boolean, default=False)  # Requires reservation?
    
    # --- Contact Info ---
    contact_whatsapp = Column(String, nullable=True)  # WhatsApp number
    contact_email = Column(String, nullable=True)     # Organizer email
    contact_phone = Column(String, nullable=True)     # Phone number
    contact_instagram = Column(String, nullable=True) # Instagram handle
    organizer_name = Column(String, nullable=True)    # Organizer / promoter name
    
    # --- Config ---
    is_featured = Column(Boolean, default=False)
    tags = Column(String, nullable=True)              # Comma separated
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # --- Relationships ---
    zones = relationship("EventZone", back_populates="event", cascade="all, delete-orphan", order_by="EventZone.order")
    lineup = relationship("EventLineup", back_populates="event", cascade="all, delete-orphan", order_by="EventLineup.order")


class EventZone(Base):
    """Represents a ticket zone/area within an event (General, VIP, Backstage, etc.)"""
    __tablename__ = "event_zones"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)             # "General", "VIP", "Backstage", "Mesa VIP"
    price = Column(String, nullable=True)             # "$25", "$150"
    capacity = Column(Integer, nullable=True)         # Zone capacity
    perks = Column(String, nullable=True)             # "Open bar, Meet & Greet" (comma separated)
    is_sold_out = Column(Boolean, default=False)      # Sold out flag
    order = Column(Integer, default=0)                # Display order

    event = relationship("Event", back_populates="zones")


class EventLineup(Base):
    """Represents an artist/DJ in the event lineup"""
    __tablename__ = "event_lineup"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    artist_name = Column(String, nullable=False)      # Artist/DJ name
    talent_id = Column(Integer, ForeignKey("talent_profiles.id"), nullable=True)  # Optional link
    set_time = Column(String, nullable=True)          # "22:00 - 23:30"
    role = Column(String, nullable=True)              # "Headliner", "Opening", "Closing", "Special Guest"
    image_url = Column(String, nullable=True)         # Artist photo
    order = Column(Integer, default=0)                # Display order

    event = relationship("Event", back_populates="lineup")
    talent = relationship("TalentProfile", lazy="joined")

class EventTicket(Base):
    """Represents a digital ticket for an event"""
    __tablename__ = "event_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    zone_id = Column(Integer, ForeignKey("event_zones.id", ondelete="SET NULL"), nullable=True) # Optional link to a specific zone
    status = Column(String, default="valido") # "valido", "usado", "cancelado"
    qr_code = Column(String, unique=True, index=True) # Unique code for QR generation
    price_paid = Column(String, nullable=True) # How much they paid, or "Gratis"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="tickets")
    event = relationship("Event", backref="tickets")
    zone = relationship("EventZone")
