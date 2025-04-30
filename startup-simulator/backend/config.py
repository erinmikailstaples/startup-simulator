import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional, List

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Keys
    openai_api_key: Optional[str] = Field(None, description="OpenAI API key")
    galileo_api_key: Optional[str] = Field(None, description="Galileo API key")
    
    # Backend settings
    backend_url: str = Field("http://localhost:8000", description="Backend URL")
    
    # Frontend settings
    next_public_api_url: str = Field("http://localhost:8000/api", description="Frontend API URL")
    
    # Galileo settings
    galileo_project: str = Field("startup-simulator", description="Galileo project name")
    galileo_log_stream: str = Field("main", description="Galileo log stream name")
    
    # Database
    database_url: str = Field("sqlite:///./database/simulator.db", description="Database URL")
    
    # OpenAI Models
    default_model: str = Field("gpt-4-turbo", description="Default OpenAI model")
    cheaper_model: str = Field("gpt-3.5-turbo", description="Cheaper OpenAI model")
    bleeding_edge_model: str = Field("gpt-4o", description="Bleeding edge OpenAI model")
    
    # Application settings
    debug: bool = Field(True, description="Debug mode")
    mock_mode: bool = Field(
        default_factory=lambda: os.getenv("MOCK_MODE", "True").lower() in ("true", "1", "t"),
        description="Whether to run in mock mode (no actual API calls)"
    )
    
    # CORS settings
    cors_origins: List[str] = Field(
        default_factory=lambda: os.getenv("CORS_ORIGINS", "*").split(","),
        description="Allowed CORS origins"
    )
    
    # LLM settings
    default_temperature: float = Field(0.7, description="Default temperature for LLM responses")
    default_max_tokens: int = Field(800, description="Default max tokens for LLM responses")
    
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
    print(f"- Mock Mode: {'Enabled ✅' if settings.mock_mode else 'Disabled ❌'}")
    print(f"- Galileo Project: {settings.galileo_project}")
    print(f"- Galileo Log Stream: {settings.galileo_log_stream}")
    print(f"- Default Model: {settings.default_model}")
    print(f"- CORS Origins: {settings.cors_origins}")
    print(f"- Default Temperature: {settings.default_temperature}")
    print(f"- Default Max Tokens: {settings.default_max_tokens}") 