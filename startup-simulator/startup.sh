#!/bin/bash

# Terminal colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
echo "  _____ _      _   _                      _____  _                 _       _             "
echo " / ____| |    (_) | |                    / ____|(_)               | |     | |            "
echo "| (___  | |__  _| |_ | |_ _   _         | (___   _  _ __ ___   ___ | | __ _| |_ ___  _ __ "
echo " \___ \ | '_ \| | __|| __| | | |         \___ \ | || '_ \` _ \ / _ \| |/ _\` | __/ _ \| '__|"
echo " ____) || | | | | |_ | |_| |_| |         ____) || || | | | | | (_) | | (_| | || (_) | |   "
echo "|_____/ |_| |_|_|\__| \__|\__, |        |_____/ |_||_| |_| |_|\___/|_|\__,_|\__\___/|_|   "
echo "                           __/ |                                                           "
echo "                          |___/                                                            "
echo -e "${NC}"
echo -e "${YELLOW}Raise $10M. Build on vibes. Deploy on Friday.${NC}"
echo ""

# Check if Python and Node.js are installed
if ! command -v python &> /dev/null; then
    echo -e "${RED}Python is not installed. Please install Python 3.10 or higher.${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}Please edit the .env file to add your API keys.${NC}"
    else
        echo -e "${RED}.env.example file not found. Please create a .env file manually.${NC}"
        exit 1
    fi
fi

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    npm install
fi

# Check if Python dependencies are installed
if ! python -c "import fastapi" &> /dev/null; then
    echo -e "${YELLOW}Installing Python dependencies...${NC}"
    pip install -r requirements.txt
fi

# Check if the database is initialized
if [ ! -f "startup-simulator/database/simulator.db" ]; then
    echo -e "${YELLOW}Initializing database...${NC}"
    python -m database.init_db
fi

# Start the application
echo -e "${GREEN}Starting Startup Simulator™...${NC}"
npm run dev 