#!/usr/bin/env python
import os
import shutil
import sys
import subprocess

def check_dependencies():
    """Check if the required dependencies are installed."""
    try:
        import fastapi
        import pydantic
        import dotenv
        print("✅ Python dependencies are installed.")
        return True
    except ImportError:
        print("❌ Python dependencies are missing. Installing...")
        return False

def install_python_dependencies():
    """Install Python dependencies from requirements.txt."""
    print("📦 Installing Python dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("✅ Python dependencies installed.")

def setup_env_file():
    """Set up the .env file if it doesn't exist."""
    if not os.path.exists(".env"):
        if os.path.exists(".env.example"):
            shutil.copy(".env.example", ".env")
            print("✅ Created .env file from .env.example")
            print("⚠️ Please edit the .env file to add your API keys.")
        else:
            print("❌ .env.example file not found.")
    else:
        print("✅ .env file already exists.")

def initialize_database():
    """Initialize the database."""
    print("🗄️ Initializing database...")
    try:
        from database.init_db import init_db
        init_db()
        print("✅ Database initialized.")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")

def setup():
    """Run the setup process."""
    print("🚀 Setting up Sh*tty Startup Simulator™...")
    
    # Check Python dependencies
    if not check_dependencies():
        install_python_dependencies()
    
    # Set up environment file
    setup_env_file()
    
    # Initialize database
    initialize_database()
    
    print("\n🎉 Setup complete! Here's how to run the application:")
    print("\n1. Make sure you've added your API keys to the .env file.")
    print("\n2. Install Node.js dependencies:")
    print("   npm install")
    print("\n3. Run the development server:")
    print("   npm run dev")
    print("\n4. Open your browser and navigate to:")
    print("   http://localhost:3000")

if __name__ == "__main__":
    setup() 