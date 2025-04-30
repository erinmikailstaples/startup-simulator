"""
Script to run the Sh*tty Startup Simulator backend server.
"""

import os
import sys
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get debug mode from environment
debug_mode = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

if __name__ == "__main__":
    # Add the current directory to the Python path
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    print("🚀 Starting Sh*tty Startup Simulator backend server")
    print(f"🔧 Debug mode: {'enabled' if debug_mode else 'disabled'}")
    print(f"🔑 OpenAI API Key: {'configured' if os.getenv('OPENAI_API_KEY') else 'not configured'}")
    print(f"🔑 Galileo API Key: {'configured' if os.getenv('GALILEO_API_KEY') else 'not configured'}")
    print(f"🔧 Mock mode: {'enabled' if os.getenv('MOCK_MODE', 'True').lower() in ('true', '1', 't') else 'disabled'}")
    
    # Run the FastAPI application with uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=debug_mode,
        access_log=debug_mode
    ) 