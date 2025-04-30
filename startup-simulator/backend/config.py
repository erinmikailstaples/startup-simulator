import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Keys (not used in mock version)
    openai_api_key: Optional[str] = Field(None, description="OpenAI API key")
    galileo_api_key: Optional[str] = Field(None, description="Galileo API key")
    
    # Backend settings
    backend_url: str = Field("http://localhost:8000", description="Backend URL")
    
    # Frontend settings
    next_public_api_url: str = Field("http://localhost:8000/api", description="Frontend API URL")
    
    # Galileo settings
    galileo_project: Optional[str] = Field(None, description="Galileo project name")
    galileo_log_stream: Optional[str] = Field(None, description="Galileo log stream name")
    
    # Database
    database_url: str = Field("sqlite:///./database/simulator.db", description="Database URL")
    
    # OpenAI Models
    default_model: str = Field("gpt-4-turbo", description="Default OpenAI model")
    cheaper_model: str = Field("gpt-3.5-turbo", description="Cheaper OpenAI model")
    bleeding_edge_model: str = Field("gpt-4o", description="Bleeding edge OpenAI model")
    
    # Application settings
    debug: bool = Field(True, description="Debug mode")
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

# Initialize settings
settings = Settings()

# For debugging during development
if settings.debug:
    print("⚙️ Configuration loaded with the following settings:")
    print(f"- OpenAI API Key: {'Configured ✅' if settings.openai_api_key else 'Missing ❌'}")
    print(f"- Galileo API Key: {'Configured ✅' if settings.galileo_api_key else 'Missing ❌'}")
    print(f"- Galileo Project: {settings.galileo_project}")
    print(f"- Galileo Log Stream: {settings.galileo_log_stream}")
    print(f"- Default Model: {settings.default_model}") 