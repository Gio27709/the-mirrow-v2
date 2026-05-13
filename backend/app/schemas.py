from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    accepts_notifications: bool
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one number')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
        
    @field_validator('accepts_notifications')
    @classmethod
    def validate_notifications(cls, v: bool) -> bool:
        if v is False:
            raise ValueError('You must accept notifications to register')
        return v

class UserLogin(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    old_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one number')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserResponse(UserBase):
    id: int
    is_active: bool
    username: Optional[str] = None
    full_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    auth_provider: Optional[str] = None
    role: str

    @field_validator('role', mode='before')
    @classmethod
    def flatten_role(cls, v):
        if hasattr(v, 'name'):
            return v.name
        return str(v)

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# ============================================
# LEADS / CONTACT
# ============================================

class LeadBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None
    inquiry_type: Optional[str] = None  # "evento", "general", "cotizacion", "talento"
    source: Optional[str] = "web"       # "web", "whatsapp", "landing"

class LeadCreate(LeadBase):
    pass

class LeadResponse(LeadBase):
    id: int
    is_read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# HERO CONTENT
# ============================================

class HeroContentBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    bg_gradient: Optional[str] = None
    type: str # carousel or card
    order: int = 0
    is_active: bool = True

class HeroContentCreate(HeroContentBase):
    pass

class HeroContentUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    bg_gradient: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class HeroContentResponse(HeroContentBase):
    id: int

    class Config:
        from_attributes = True


# ============================================
# TALENT PROFILES
# ============================================

class TalentProfileBase(BaseModel):
    stage_name: str
    category: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    rating: float = 5.0
    
    # Pricing & Location
    base_price: Optional[float] = None
    price_currency: str = "USD"
    price_unit: str = "Evento"
    location: Optional[str] = None
    is_available: bool = True
    
    # Media
    gallery_urls: Optional[List[str]] = None   # JSON array of image URLs
    video_url: Optional[str] = None
    
    # Social Media
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    website_url: Optional[str] = None
    tiktok_url: Optional[str] = None
    youtube_url: Optional[str] = None
    
    # Services
    included_services: Optional[List[str]] = None  # ["Equipo de Sonido", "Transporte"]

class TalentProfileCreate(TalentProfileBase):
    user_id: int

class TalentProfileUpdate(BaseModel):
    stage_name: Optional[str] = None
    category: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    rating: Optional[float] = None
    
    # Pricing & Location
    base_price: Optional[float] = None
    price_currency: Optional[str] = None
    price_unit: Optional[str] = None
    location: Optional[str] = None
    is_available: Optional[bool] = None
    
    # Media
    gallery_urls: Optional[List[str]] = None
    video_url: Optional[str] = None
    
    # Social Media
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    website_url: Optional[str] = None
    tiktok_url: Optional[str] = None
    youtube_url: Optional[str] = None
    
    # Services
    included_services: Optional[List[str]] = None

class TalentProfileResponse(TalentProfileBase):
    id: int
    user_id: int

    @field_validator('gallery_urls', mode='before')
    @classmethod
    def parse_gallery_urls(cls, v):
        """Parse JSON string from DB into a Python list."""
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except (json.JSONDecodeError, ValueError):
                return []
        return v

    @field_validator('included_services', mode='before')
    @classmethod
    def parse_included_services(cls, v):
        """Parse JSON string from DB into a Python list."""
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except (json.JSONDecodeError, ValueError):
                return []
        return v

    class Config:
        from_attributes = True


# ============================================
# EVENT ZONES
# ============================================

class EventZoneBase(BaseModel):
    name: str
    price: Optional[str] = None
    capacity: Optional[int] = None
    perks: Optional[str] = None
    is_sold_out: bool = False
    order: int = 0

class EventZoneCreate(EventZoneBase):
    pass

class EventZoneUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[str] = None
    capacity: Optional[int] = None
    perks: Optional[str] = None
    is_sold_out: Optional[bool] = None
    order: Optional[int] = None

class EventZoneResponse(EventZoneBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True


# ============================================
# EVENT LINEUP
# ============================================

class EventLineupBase(BaseModel):
    artist_name: str
    set_time: Optional[str] = None
    role: Optional[str] = None
    image_url: Optional[str] = None
    talent_id: Optional[int] = None
    order: int = 0

class EventLineupCreate(EventLineupBase):
    pass

class EventLineupUpdate(BaseModel):
    artist_name: Optional[str] = None
    set_time: Optional[str] = None
    role: Optional[str] = None
    image_url: Optional[str] = None
    talent_id: Optional[int] = None
    order: Optional[int] = None

class EventLineupResponse(EventLineupBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True


# ============================================
# EVENTS (Full Professional Model)
# ============================================

class EventBase(BaseModel):
    title: str
    type: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    
    # Venue
    location: Optional[str] = None
    venue_name: Optional[str] = None
    venue_address: Optional[str] = None
    city: Optional[str] = None
    capacity: Optional[int] = None
    min_age: Optional[str] = None
    dress_code: Optional[str] = None
    
    # Media
    image_url: Optional[str] = None
    flyer_url: Optional[str] = None
    video_promo_url: Optional[str] = None
    
    # Pricing
    price: Optional[str] = None
    ticket_url: Optional[str] = None
    free_entry: bool = False
    reservation_required: bool = False
    
    # Contact
    contact_whatsapp: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_instagram: Optional[str] = None
    organizer_name: Optional[str] = None
    
    # Config
    is_featured: bool = False
    tags: Optional[str] = None
    is_active: bool = True

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    
    location: Optional[str] = None
    venue_name: Optional[str] = None
    venue_address: Optional[str] = None
    city: Optional[str] = None
    capacity: Optional[int] = None
    min_age: Optional[str] = None
    dress_code: Optional[str] = None
    
    image_url: Optional[str] = None
    flyer_url: Optional[str] = None
    video_promo_url: Optional[str] = None
    
    price: Optional[str] = None
    ticket_url: Optional[str] = None
    free_entry: Optional[bool] = None
    reservation_required: Optional[bool] = None
    
    contact_whatsapp: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_instagram: Optional[str] = None
    organizer_name: Optional[str] = None
    
    is_featured: Optional[bool] = None
    tags: Optional[str] = None
    is_active: Optional[bool] = None

class EventResponse(EventBase):
    id: int
    created_at: datetime
    zones: List[EventZoneResponse] = []
    lineup: List[EventLineupResponse] = []

    class Config:
        from_attributes = True

# ============================================
# EVENT TICKETS
# ============================================

class EventTicketBase(BaseModel):
    event_id: int
    zone_id: Optional[int] = None
    price_paid: Optional[str] = None

class EventTicketCreate(EventTicketBase):
    pass

class EventTicketResponse(EventTicketBase):
    id: int
    user_id: int
    status: str
    qr_code: str
    created_at: datetime
    event: Optional[EventResponse] = None
    
    class Config:
        from_attributes = True
