from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, List, Dict, Any

from .database import Base


class User(Base):
    """User model matching the existing schema."""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    profile_image_url = Column(String)
    bio = Column(Text)
    phone = Column(String)
    location = Column(String)
    interests = Column(JSON, default=list)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owned_clubs = relationship("Club", back_populates="owner")
    memberships = relationship("ClubMembership", back_populates="user")
    event_participations = relationship("EventParticipant", back_populates="user")
    reviews = relationship("ClubReview", back_populates="user")
    uploaded_images = relationship("ClubGallery", back_populates="uploader")
    created_events = relationship("ClubEvent", back_populates="creator")


class Club(Base):
    """Club model with enhanced profile information."""
    __tablename__ = "clubs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    long_description = Column(Text)
    image = Column(String(500))
    location = Column(String(255), nullable=False, index=True)
    member_count = Column(Integer, default=0)
    features = Column(JSON, default=list)
    contact_phone = Column(String)
    contact_email = Column(String)
    website = Column(String)
    social_media = Column(JSON, default=dict)
    rating = Column(Integer, default=5)
    established = Column(String)
    is_active = Column(Boolean, default=True)
    owner_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="owned_clubs")
    memberships = relationship("ClubMembership", back_populates="club")
    events = relationship("ClubEvent", back_populates="club")
    gallery = relationship("ClubGallery", back_populates="club")
    reviews = relationship("ClubReview", back_populates="club")


class ClubMembership(Base):
    """Club membership model."""
    __tablename__ = "club_memberships"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    role = Column(String(50), default="member")  # member, moderator, admin
    joined_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="memberships")
    club = relationship("Club", back_populates="memberships")


class ClubEvent(Base):
    """Club event model."""
    __tablename__ = "club_events"
    
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    event_date = Column(DateTime, nullable=False)
    location = Column(String(255))
    max_participants = Column(Integer)
    current_participants = Column(Integer, default=0)
    status = Column(String(20), default="upcoming")  # upcoming, ongoing, completed, cancelled
    created_by = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    club = relationship("Club", back_populates="events")
    creator = relationship("User", back_populates="created_events")
    participants = relationship("EventParticipant", back_populates="event")


class EventParticipant(Base):
    """Event participant model."""
    __tablename__ = "event_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("club_events.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    registered_at = Column(DateTime, default=func.now())
    attended = Column(Boolean, default=False)
    
    # Relationships
    event = relationship("ClubEvent", back_populates="participants")
    user = relationship("User", back_populates="event_participations")


class ClubGallery(Base):
    """Club gallery/images model."""
    __tablename__ = "club_gallery"
    
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(255))
    uploaded_by = Column(String, ForeignKey("users.id"))
    uploaded_at = Column(DateTime, default=func.now())
    
    # Relationships
    club = relationship("Club", back_populates="gallery")
    uploader = relationship("User", back_populates="uploaded_images")


class ClubReview(Base):
    """Club review/testimonial model."""
    __tablename__ = "club_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    club = relationship("Club", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class ClubApplication(Base):
    """Club application model."""
    __tablename__ = "club_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=True)
    applicant_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    preferred_club = Column(String)
    interests = Column(JSON, default=list)
    motivation = Column(Text, nullable=False)
    answers = Column(JSON, default=dict)
    status = Column(String(20), default="submitted")  # submitted, under_review, approved, rejected
    reviewed_by = Column(String, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class LandingSection(Base):
    """Landing page section model."""
    __tablename__ = "landing_sections"
    
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, default=1)
    key = Column(String, nullable=False, unique=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subtitle = Column(String)
    data = Column(JSON, default=dict)
    design = Column(JSON, default=dict)
    order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    locale = Column(String, default="en")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class NewsArticle(Base):
    """News article model."""
    __tablename__ = "news_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, unique=True, index=True)
    excerpt = Column(Text)
    content = Column(Text, nullable=False)
    featured_image = Column(String)
    category = Column(String)
    tags = Column(JSON, default=list)
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    author_id = Column(String, ForeignKey("users.id"))
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class JoinUsConfiguration(Base):
    """Join Us page configuration model."""
    __tablename__ = "join_us_configurations"
    
    id = Column(Integer, primary_key=True, index=True)
    page_title = Column(String, nullable=False)
    page_subtitle = Column(Text)
    header_gradient = Column(String)
    sections = Column(JSON, nullable=False)
    available_clubs = Column(JSON, default=list)
    available_interests = Column(JSON, default=list)
    success_page = Column(JSON, default=dict)
    terms_text = Column(Text)
    terms_description = Column(Text)
    validation = Column(JSON, default=dict)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())