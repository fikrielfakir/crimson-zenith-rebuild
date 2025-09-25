from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings."""
    
    # Database
    database_url: str = "postgresql://user:password@localhost:5432/morocco_clubs"
    
    # Security
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Admin
    admin_email: str = "admin@morocclubs.com"
    admin_password: str = "admin123"
    
    # File Upload
    upload_path: str = "uploads"
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    
    # CORS
    allowed_origins: list = ["http://localhost:5000", "http://0.0.0.0:5000"]
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"


# Global settings instance
settings = Settings()