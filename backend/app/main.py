from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .database import create_tables, engine
from .auth.routes import router as auth_router

# Create FastAPI application
app = FastAPI(
    title="Morocco Clubs API",
    description="Backend API for Morocco Clubs website",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Morocco Clubs API is running"}

# Include auth routes
app.include_router(auth_router, prefix="/api")

# Clubs routes
@app.get("/api/clubs")
async def get_clubs():
    """Get all clubs - temporary implementation."""
    return {
        "clubs": [
            {
                "id": 1,
                "name": "Atlas Hikers Club",
                "description": "Mountain trekking and hiking adventures",
                "location": "Atlas Mountains",
                "member_count": 250,
                "rating": 5,
                "image": "/images/atlas-hikers.jpg",
                "features": ["Hiking", "Camping", "Photography"],
                "is_active": True,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "name": "Desert Explorers",
                "description": "Sahara expeditions and desert camping",
                "location": "Sahara Desert",
                "member_count": 180,
                "rating": 5,
                "image": "/images/desert-explorers.jpg",
                "features": ["Desert Tours", "Camping", "Camel Rides"],
                "is_active": True,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 3,
                "name": "Coastal Adventures",
                "description": "Beach activities and water sports",
                "location": "Atlantic Coast",
                "member_count": 320,
                "rating": 4,
                "image": "/images/coastal-adventures.jpg",
                "features": ["Surfing", "Beach Volleyball", "Swimming"],
                "is_active": True,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 3
    }

# Events routes
@app.get("/api/events")
async def get_events():
    """Get all events - temporary implementation."""
    return {
        "events": [
            {
                "id": 1,
                "club_id": 1,
                "title": "Atlas Mountain Trek",
                "description": "3-day hiking adventure in the Atlas Mountains",
                "event_date": "2024-12-15T09:00:00Z",
                "location": "Atlas Mountains",
                "max_participants": 20,
                "current_participants": 15,
                "status": "upcoming",
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "club_id": 2,
                "title": "Sahara Desert Camp",
                "description": "2-night camping under the stars",
                "event_date": "2024-12-20T18:00:00Z",
                "location": "Erg Chebbi Dunes",
                "max_participants": 15,
                "current_participants": 8,
                "status": "upcoming",
                "created_at": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 2
    }

# Applications routes
@app.post("/api/applications")
async def submit_application(application_data: dict):
    """Submit membership application - temporary implementation."""
    return {
        "id": 1,
        "status": "submitted",
        "message": "Application submitted successfully! We'll review your application and get back to you soon.",
        "created_at": "2024-01-01T00:00:00Z"
    }

@app.get("/api/applications")
async def get_applications():
    """Get applications for admin review - temporary implementation."""
    return {
        "applications": [
            {
                "id": 1,
                "applicant_name": "Ahmed El-Mansouri",
                "email": "ahmed@example.com",
                "phone": "+212-6-12-34-56-78",
                "preferred_club": "Atlas Hikers Club",
                "interests": ["Hiking", "Photography", "Nature"],
                "motivation": "I'm passionate about exploring Morocco's beautiful mountains...",
                "status": "submitted",
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "applicant_name": "Fatima Zahra",
                "email": "fatima@example.com",
                "phone": "+212-6-98-76-54-32",
                "preferred_club": "Desert Explorers",
                "interests": ["Desert Adventures", "Camping", "Culture"],
                "motivation": "I want to discover the magic of the Sahara Desert...",
                "status": "under_review",
                "created_at": "2024-01-02T00:00:00Z"
            }
        ],
        "total": 2
    }

# Content Management routes
@app.get("/api/content/landing")
async def get_landing_sections():
    """Get landing page sections - temporary implementation."""
    return {
        "sections": [
            {
                "id": 1,
                "key": "hero",
                "type": "hero",
                "title": "Discover Morocco's Adventure Clubs",
                "subtitle": "Join passionate communities exploring the Kingdom's wonders",
                "data": {
                    "backgroundImage": "/images/hero-bg.jpg",
                    "ctaText": "Explore Clubs",
                    "ctaLink": "/clubs"
                },
                "is_visible": True,
                "order": 1
            },
            {
                "id": 2,
                "key": "activities",
                "type": "activities",
                "title": "Popular Activities",
                "subtitle": "Discover amazing adventures across Morocco",
                "data": {
                    "activities": [
                        {
                            "name": "Mountain Hiking",
                            "description": "Explore the Atlas Mountains",
                            "image": "/images/hiking.jpg",
                            "difficulty": "Moderate"
                        },
                        {
                            "name": "Desert Camping",
                            "description": "Sleep under Sahara stars",
                            "image": "/images/camping.jpg",
                            "difficulty": "Easy"
                        }
                    ]
                },
                "is_visible": True,
                "order": 2
            }
        ]
    }

@app.get("/api/content/join-config")
async def get_join_config():
    """Get Join Us form configuration - temporary implementation."""
    return {
        "id": 1,
        "page_title": "Join Our Adventure Community",
        "page_subtitle": "Ready to explore Morocco's wonders with like-minded adventurers?",
        "sections": {
            "personalInfo": {
                "isEnabled": True,
                "title": "Personal Information",
                "description": "Basic details about yourself",
                "icon": "User",
                "order": 1
            },
            "clubPreferences": {
                "isEnabled": True,
                "title": "Club Preferences",
                "description": "Choose your preferred club",
                "icon": "MapPin",
                "order": 2
            },
            "interests": {
                "isEnabled": True,
                "title": "Your Interests",
                "description": "Select your favorite activities",
                "icon": "Heart",
                "order": 3
            },
            "motivation": {
                "isEnabled": True,
                "title": "Tell Us About Yourself",
                "description": "Share your motivation",
                "icon": "FileText",
                "order": 4
            }
        },
        "available_clubs": [
            {
                "id": "atlas-hikers",
                "name": "Atlas Hikers Club",
                "description": "Mountain trekking adventures",
                "members": "250+ Members",
                "isActive": True
            },
            {
                "id": "desert-explorers",
                "name": "Desert Explorers",
                "description": "Sahara expeditions",
                "members": "180+ Members",
                "isActive": True
            }
        ],
        "available_interests": [
            "Hiking", "Camping", "Photography", "Desert Tours", 
            "Beach Activities", "Cultural Tours", "Adventure Sports"
        ]
    }

# Analytics routes (admin only)
@app.get("/api/analytics/dashboard")
async def get_analytics_dashboard():
    """Get analytics dashboard data - temporary implementation."""
    return {
        "overview": {
            "total_clubs": 12,
            "total_members": 850,
            "total_events": 45,
            "pending_applications": 8
        },
        "recent_activity": [
            {
                "type": "new_application",
                "message": "New membership application from Ahmed El-Mansouri",
                "timestamp": "2024-01-01T00:00:00Z"
            },
            {
                "type": "event_created",
                "message": "Atlas Mountain Trek event created",
                "timestamp": "2024-01-02T00:00:00Z"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)