from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .routes import simulate

# Create FastAPI app
app = FastAPI(
    title="Startup Simulator API",
    description="Raise $10M. Build on vibes. Deploy on Friday.",
    version="0.1.0",
)

# Setup CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, in production specify domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(simulate.router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "Sh*tty Startup Simulator™",
        "tagline": "Raise $10M. Build on vibes. Deploy on Friday.",
        "status": "Ready to disrupt absolutely nothing!",
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 