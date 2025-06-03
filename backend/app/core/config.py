import os
import secrets
from typing import List, Union, Optional

from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # API configuration
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    
    # Project information
    PROJECT_NAME: str = "Startup Simulator"
    PROJECT_DESCRIPTION: str = "An application that simulates startup viability analysis"
    VERSION: str = "0.1.0"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",  # React frontend default
            "http://127.0.0.1:3000",
            "http://localhost:8000",  # FastAPI backend default
            "http://127.0.0.1:8000",
        ],
        alias="ALLOWED_ORIGINS"
    )

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def split_origins(cls, v):
        if isinstance(v, str):
            # Allow comma-separated string or JSON array string
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                import json
                return json.loads(v)
            return [i.strip() for i in v.split(",") if i.strip()]
        return v
    
    # LLM configuration
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Debug settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"


# Create global settings instance
settings = Settings()

