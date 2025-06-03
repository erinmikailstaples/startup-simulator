# Startup Simulator

An AI-powered startup idea analysis tool that helps entrepreneurs evaluate their business ideas.

## Project Structure

```
startup-simulator/
├── frontend/          # Next.js frontend application
│   ├── src/           # Source code
│   │   ├── app/       # Next.js app router
│   │   ├── components/# Reusable React components
│   │   ├── contexts/  # React context providers
│   │   └── lib/       # Utility functions and helpers
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
│
├── backend/           # FastAPI backend application
│   ├── app/           # Source code
│   │   ├── api/       # API routes
│   │   ├── core/      # Core configuration
│   │   ├── models/    # Data models
│   │   └── services/  # Business logic and services
│   ├── requirements.txt # Backend dependencies
│   └── .env           # Environment variables
│
└── package.json       # Root package.json for development scripts
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- (Optional) OpenAI API key for AI functionality

### Initial Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/startup-simulator.git
   cd startup-simulator
   ```

2. Run the setup script:
   ```
   npm run setup
   ```

3. Create a `.env` file in the backend directory with your API keys:
   ```
   cp backend/.env.example backend/.env
   # Edit backend/.env with your OpenAI API key
   ```

### Running the Application

To run both frontend and backend concurrently:

```
npm run dev
```

Or run them separately:

```
# Frontend only (http://localhost:3000)
npm run frontend

# Backend only (http://localhost:8000)
npm run backend
```

## Local Development

- Frontend: The Next.js application runs on http://localhost:3000
- Backend: The FastAPI server runs on http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Application Flow

```
[User] → [Frontend Input Form] → [Backend API] → [AI Analysis] → [Results Display]
```

1. User inputs startup idea details
2. Frontend sends data to backend API
3. Backend processes data with AI services
4. Results are returned to frontend for display

## Bypassing Authentication for Local Development

For local development, authentication is bypassed by default. All features are accessible without login.

To enable the mock authentication flow:
1. Set `ENABLE_AUTH=true` in the frontend `.env` file
2. The application will use mock user data for the authentication flow

# Startup Simulator

A Next.js/React frontend with a FastAPI backend that uses the LangGraph agent framework to simulate startup feasibility analysis.

## Overview

The Startup Simulator is a web application that helps entrepreneurs evaluate their startup ideas. Users answer a series of questions about their startup concept, and the application uses AI agents built with LangGraph to analyze the viability of the idea across multiple dimensions:

- Market Viability
- Financial Viability
- Innovation Score
- Risk Assessment

The application provides a comprehensive analysis with an overall score and detailed feedback.

## Architecture

- **Frontend**: Next.js 14+ with React 18+, Tailwind CSS for styling
- **Backend**: FastAPI with LangGraph for agent orchestration
- **AI Framework**: LangGraph agents powered by OpenAI models

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/startup-simulator.git
cd startup-simulator
```

2. Install root dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory based on `.env.example`
   - Create a `.env.local` file in the `frontend` directory with:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

4. Install all dependencies:
```bash
npm run setup
```

### Development

To run both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:8000

### Building for Production

```bash
npm run build
```

## Project Structure

```
startup-simulator/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   ├── lib/            # Utility functions and API client
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── backend/                # FastAPI backend application
│   ├── app/
│   │   ├── agents/         # LangGraph agents
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Data models
│   │   └── schemas/        # Pydantic schemas
│   └── tests/              # Backend tests
└── package.json            # Root package.json for running both services
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


# startup-simulator