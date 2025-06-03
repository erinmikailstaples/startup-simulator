from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from typing import Dict, List, Any
from uuid import UUID, uuid4
import time
from datetime import datetime

from app.schemas.questions import StartupFormData, QuestionnaireRequest, QuestionnaireResponse, Question
from app.schemas.analysis import StartupAnalysis, AnalysisResponse, AnalysisStatus

# For demo purposes, we'll use an in-memory store for analysis results
# In a production app, you would use a proper database
analysis_store: Dict[UUID, AnalysisResponse] = {}

router = APIRouter()


@router.get("/questions", response_model=QuestionnaireResponse)
async def get_questionnaire(request: QuestionnaireRequest = QuestionnaireRequest()):
    """Retrieve the startup questionnaire."""
    
    # In a real application, questions might come from a database or be localized
    # For this example, we'll return a hardcoded set of questions
    questions = [
        Question(
            id="idea",
            question="What is your startup idea?",
            description="Briefly describe your startup concept in a sentence or two.",
            multiline=True,
        ),
        Question(
            id="industry",
            question="What industry does your startup operate in?",
            description="E.g., Fintech, Healthcare, E-commerce, SaaS, etc.",
        ),
        Question(
            id="targetAudience",
            question="Who is your target audience?",
            description="Describe your ideal customer or user.",
            multiline=True,
        ),
        Question(
            id="problemSolved",
            question="What problem does your startup solve?",
            description="Explain the pain point or challenge your customers face that your startup addresses.",
            multiline=True,
        ),
        Question(
            id="competitiveAdvantage",
            question="What is your competitive advantage?",
            description="What makes your solution unique compared to existing alternatives?",
            multiline=True,
        ),
        Question(
            id="businessModel",
            question="What is your business model?",
            description="How will your startup generate revenue? (e.g., subscription, freemium, one-time purchase)",
            multiline=True,
        ),
        Question(
            id="fundingNeeds",
            question="What are your funding needs?",
            description="How much capital do you need and what will you use it for?",
            multiline=True,
        ),
    ]
    
    return QuestionnaireResponse(questions=questions)


async def analyze_startup_async(data: StartupFormData, analysis_id: UUID):
    """Background task to analyze the startup idea using LangGraph agents."""
    # Update status to processing
    analysis_store[analysis_id] = AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.PROCESSING,
        message="Analysis in progress"
    )
    
    try:
        # Import here to avoid circular imports
        from app.agents.orchestrator import analyze_startup, create_startup_analysis
        
        # Run the analysis using our LangGraph agents
        analysis_result = await analyze_startup(data)
        
        if analysis_result.get("error"):
            analysis_store[analysis_id] = AnalysisResponse(
                id=analysis_id,
                status=AnalysisStatus.FAILED,
                message=f"Analysis failed: {analysis_result['error']}"
            )
            return
        
        # Create the analysis object
        analysis = create_startup_analysis(analysis_result, analysis_id)
        
        # Update the analysis store with the completed result
        analysis_store[analysis_id] = AnalysisResponse(
            id=analysis_id,
            status=AnalysisStatus.COMPLETED,
            result=analysis
        )
    except Exception as e:
        # Handle errors
        analysis_store[analysis_id] = AnalysisResponse(
            id=analysis_id,
            status=AnalysisStatus.FAILED,
            message=f"Analysis failed: {str(e)}"
        )


@router.post("/analyze-startup", response_model=AnalysisResponse)
async def analyze_startup(data: StartupFormData, background_tasks: BackgroundTasks):
    """Submit startup data for analysis."""
    
    # Create a unique ID for this analysis
    analysis_id = uuid4()
    
    # Store initial pending status
    analysis_store[analysis_id] = AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.PENDING,
        message="Analysis queued"
    )
    
    # Start background analysis task
    background_tasks.add_task(analyze_startup_async, data, analysis_id)
    
    return analysis_store[analysis_id]


@router.get("/analysis-status/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis_status(analysis_id: UUID):
    """Get the status of a startup analysis."""
    
    if analysis_id not in analysis_store:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis_store[analysis_id]

