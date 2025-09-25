from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from ..database import get_db
from ..models import User
from ..schemas import UserLogin, Token, UserResponse, MessageResponse
from ..config import settings
from .utils import authenticate_user, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login_for_access_token(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
) -> Any:
    """Authenticate user and return access token."""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user or user is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)) -> Any:
    """Get current authenticated user information."""
    return current_user


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user)) -> Any:
    """Logout current user (client-side token removal required)."""
    return {"message": "Successfully logged out"}


# Simple admin login for development/demo purposes
@router.post("/admin-login", response_model=Token)
async def admin_login(user_credentials: UserLogin) -> Any:
    """Simple admin login for development purposes."""
    if (user_credentials.email == settings.admin_email and 
        user_credentials.password == settings.admin_password):
        
        # Create a simple admin user token
        admin_user_id = "admin"
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": admin_user_id, "admin": True}, 
            expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )