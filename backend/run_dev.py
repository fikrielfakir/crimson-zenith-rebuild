#!/usr/bin/env python3
"""
Development server script for the Morocco Clubs API.
Run this to start the FastAPI server in development mode.
"""

import uvicorn
import os
from app.config import settings

if __name__ == "__main__":
    # Ensure uploads directory exists
    os.makedirs(settings.upload_path, exist_ok=True)
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )