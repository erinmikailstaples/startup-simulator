from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.endpoints import questions
from app import __version__

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("startup-simulator")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events for the FastAPI application.
    """
    # Startup: Run code before the application starts
    logger.info(f"Starting {settings.PROJECT_NAME} v{__version__}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    # Check if OpenAI API key is available
    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY is not set. LLM functionalities may not work properly.")
    
    yield  # The application runs here
    
    # Shutdown: Run code after the application stops
    logger.info(f"Shutting down {settings.PROJECT_NAME}")


# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=__version__,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for testing
@app.get("/")
async def root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "version": __version__,
        "docs": "/docs",
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": __version__,
        "debug": settings.DEBUG,
    }

# Include API routers
app.include_router(
    questions.router,
    prefix=settings.API_V1_STR,
    tags=["questions"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app", 
        host=settings.HOST, 
        port=settings.PORT, 
        reload=settings.DEBUG,
    )
