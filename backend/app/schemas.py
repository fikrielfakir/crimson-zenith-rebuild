from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum


# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True


# User schemas
class UserBase(BaseSchema):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    interests: List[str] = []


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    interests: Optional[List[str]] = None


class UserResponse(UserBase):
    id: str
    profile_image_url: Optional[str] = None
    is_admin: bool = False
    created_at: datetime
    updated_at: datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Club schemas
class ClubBase(BaseSchema):
    name: str
    description: str
    long_description: Optional[str] = None
    image: Optional[str] = None
    location: str
    features: List[str] = []
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    social_media: Dict[str, Any] = {}
    established: Optional[str] = None


class ClubCreate(ClubBase):
    pass


class ClubUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    image: Optional[str] = None
    location: Optional[str] = None
    features: Optional[List[str]] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    social_media: Optional[Dict[str, Any]] = None
    established: Optional[str] = None
    is_active: Optional[bool] = None


class ClubResponse(ClubBase):
    id: int
    member_count: int = 0
    rating: int = 5
    is_active: bool = True
    owner_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Event schemas
class ClubEventBase(BaseSchema):
    title: str
    description: Optional[str] = None
    event_date: datetime
    location: Optional[str] = None
    max_participants: Optional[int] = None


class ClubEventCreate(ClubEventBase):
    club_id: int


class ClubEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    max_participants: Optional[int] = None
    status: Optional[str] = None


class ClubEventResponse(ClubEventBase):
    id: int
    club_id: int
    current_participants: int = 0
    status: str = "upcoming"
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Application schemas
class ApplicationStatus(str, Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class ClubApplicationBase(BaseSchema):
    applicant_name: str
    email: EmailStr
    phone: str
    preferred_club: Optional[str] = None
    interests: List[str]
    motivation: str
    answers: Dict[str, Any] = {}


class ClubApplicationCreate(ClubApplicationBase):
    pass


class ClubApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    notes: Optional[str] = None


class ClubApplicationResponse(ClubApplicationBase):
    id: int
    club_id: Optional[int] = None
    status: ApplicationStatus = ApplicationStatus.SUBMITTED
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Landing page schemas
class LandingSectionBase(BaseSchema):
    key: str
    type: str
    title: str
    subtitle: Optional[str] = None
    data: Dict[str, Any] = {}
    design: Dict[str, Any] = {}
    order: int = 0
    is_visible: bool = True


class LandingSectionCreate(LandingSectionBase):
    pass


class LandingSectionUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    design: Optional[Dict[str, Any]] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None


class LandingSectionResponse(LandingSectionBase):
    id: int
    page_id: int = 1
    locale: str = "en"
    created_at: datetime
    updated_at: datetime


# News schemas
class NewsArticleBase(BaseSchema):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    featured_image: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    is_published: bool = False
    is_featured: bool = False


class NewsArticleCreate(NewsArticleBase):
    pass


class NewsArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class NewsArticleResponse(NewsArticleBase):
    id: int
    author_id: Optional[str] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


# Join Us Configuration schemas
class JoinUsConfigBase(BaseSchema):
    page_title: str
    page_subtitle: Optional[str] = None
    header_gradient: Optional[str] = None
    sections: Dict[str, Any]
    available_clubs: List[Dict[str, Any]] = []
    available_interests: List[str] = []
    success_page: Dict[str, Any] = {}
    terms_text: Optional[str] = None
    terms_description: Optional[str] = None
    validation: Dict[str, Any] = {}


class JoinUsConfigUpdate(BaseModel):
    page_title: Optional[str] = None
    page_subtitle: Optional[str] = None
    header_gradient: Optional[str] = None
    sections: Optional[Dict[str, Any]] = None
    available_clubs: Optional[List[Dict[str, Any]]] = None
    available_interests: Optional[List[str]] = None
    success_page: Optional[Dict[str, Any]] = None
    terms_text: Optional[str] = None
    terms_description: Optional[str] = None
    validation: Optional[Dict[str, Any]] = None


class JoinUsConfigResponse(JoinUsConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime


# Generic response schemas
class MessageResponse(BaseModel):
    message: str


class ListResponse(BaseModel):
    total: int
    page: int = 1
    per_page: int = 10
    pages: int


# File upload schemas
class FileUploadResponse(BaseModel):
    filename: str
    url: str
    size: int
    content_type: str