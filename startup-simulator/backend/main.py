"""
Main application entry point for Sh*tty Startup Simulator.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

# Change relative imports to absolute imports
from backend.routes import simulate
from backend.config import settings

# Set up logging
logging.basicConfig(
    level=logging.INFO if settings.debug else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("startup-simulator")

# Create FastAPI app
app = FastAPI(
    title="Sh*tty Startup Simulator API",
    description="Raise $10M. Build on vibes. Deploy on Friday.",
    version="0.1.0",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
)

# Setup CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(simulate.router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint for the API."""
    return {
        "name": "Sh*tty Startup Simulator™",
        "tagline": "Raise $10M. Build on vibes. Deploy on Friday.",
        "version": "0.1.0",
        "status": "Ready to disrupt absolutely nothing!",
        "mode": "Mock mode" if settings.mock_mode else "API mode",
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Runs when the application starts up."""
    logger.info("🚀 Starting Sh*tty Startup Simulator API")
    logger.info(f"🔧 Running in {'mock' if settings.mock_mode else 'API'} mode")
    logger.info(f"🔑 Galileo API Key: {'Configured' if settings.galileo_api_key else 'Not configured'}")
    logger.info(f"🔑 OpenAI API Key: {'Configured' if settings.openai_api_key else 'Not configured'}")

# Run the application when this module is executed directly
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug) 