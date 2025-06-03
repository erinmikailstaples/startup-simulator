# Startup Simulator

An AI-powered startup idea analysis tool that helps entrepreneurs evaluate their business ideas.

## 🚀 Getting Started

Startup Simulator is a web application that uses AI agents to analyze startup ideas across multiple dimensions, helping entrepreneurs assess the viability of their business concepts.

### Quick Start

1. **Setup your environment**
   ```bash
   git clone https://github.com/yourusername/startup-simulator.git
   cd startup-simulator
   npm run setup
   ```

2. **Configure environment variables**
   ```bash
   # Configure backend API keys
   cp backend/.env.example backend/.env
   # Edit backend/.env with your OpenAI API key

   # Create frontend .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
   ```

3. **Run the application**
   ```bash
   npm run dev
   ```
   
4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🧠 How It Works

The Startup Simulator evaluates business ideas through a comprehensive analysis process:

### User Flow

1. **Input Your Idea**
   - Start by entering basic information about your startup concept
   - Navigate through a wizard-style form with questions about:
     - Your product or service description
     - Target market and industry
     - Business model and revenue strategy
     - Competitive landscape
     - Team composition and expertise
     - Initial funding requirements

2. **AI Analysis Process**
   - Your responses are sent to the backend API
   - LangGraph agents analyze your idea across four key dimensions:
     - **Market Viability**: Assesses market size, growth potential, and fit
     - **Financial Viability**: Evaluates revenue model, cost structure, and ROI potential
     - **Innovation Score**: Measures uniqueness and technological advantage
     - **Risk Assessment**: Identifies potential challenges and obstacles

3. **Results Interpretation**
   - **Overall Feasibility Score**: A comprehensive rating of your startup idea
   - **Dimension-Specific Scores**: Detailed ratings for each analyzed aspect
   - **Detailed Feedback**: Actionable insights and improvement suggestions
   - **Strength/Weakness Analysis**: Identification of strong points and areas needing work

4. **Next Steps After Analysis**
   - Review detailed recommendations for improving your concept
   - Identify which aspects of your idea need refinement
   - Consider pivoting strategy based on AI feedback
   - Use the analysis as supporting material for potential investors

## 🛠️ Architecture

- **Frontend**: Next.js 14+ with React 18+, Tailwind CSS for styling
- **Backend**: FastAPI with LangGraph for agent orchestration
- **AI Framework**: LangGraph agents powered by OpenAI models

## 📋 Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn
- OpenAI API key (required for AI analysis functionality)

## 📁 Project Structure

```
startup-simulator/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   ├── contexts/       # React context providers
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

## 🧪 Development

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
   - Add your OpenAI API key to the backend `.env` file
   - Create a `.env.local` file in the `frontend` directory with:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

4. Install all dependencies:
   ```bash
   npm run setup
   ```

### Running the Application

To run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Frontend only (http://localhost:3000)
npm run frontend

# Backend only (http://localhost:8000)
npm run backend
```

### Authentication for Local Development

For local development, authentication is bypassed by default. All features are accessible without login.

To enable the mock authentication flow:
1. Set `ENABLE_AUTH=true` in the frontend `.env.local` file
2. The application will use mock user data for the authentication flow

### Building for Production

```bash
npm run build
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
