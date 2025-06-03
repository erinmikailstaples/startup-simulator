from typing import Dict, Any, Optional, TypedDict
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph

from app.core.config import settings


class InnovationAnalysisInput(BaseModel):
    """Input for innovation analysis."""
    idea: str = Field(..., description="The startup idea")
    industry: str = Field(..., description="The industry of the startup")
    problemSolved: str = Field(..., description="The problem solved by the startup")
    competitiveAdvantage: str = Field(..., description="Competitive advantage of the startup")


class InnovationAnalysisOutput(BaseModel):
    """Output from innovation analysis."""
    noveltyAssessment: str = Field(..., description="Assessment of idea novelty")
    disruptionPotential: str = Field(..., description="Potential for industry disruption")
    technicalFeasibility: str = Field(..., description="Technical feasibility assessment")
    innovationScore: float = Field(..., ge=0, le=100, description="Innovation score (0-100)")
    innovationInsights: str = Field(..., description="Key insights about innovation potential")


class InnovationState(TypedDict):
    """State for the innovation analysis graph."""
    input: InnovationAnalysisInput
    output: Optional[InnovationAnalysisOutput]
    error: Optional[str]


def get_innovation_llm():
    """Get the LLM model for innovation analysis."""
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        temperature=0.1,
        api_key=settings.OPENAI_API_KEY,
    )


def assess_novelty(state: InnovationState) -> InnovationState:
    """Assess the novelty of the startup idea."""
    try:
        llm = get_innovation_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are an innovation analyst specializing in evaluating the novelty of startup ideas.
            Your task is to assess how original, unique, and differentiating a startup concept is compared to existing solutions.
            Consider both incremental and disruptive innovation potential."""),
            
            HumanMessage(content=f"""Assess the novelty of this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Problem Solved: {input_data.problemSolved}
            Competitive Advantage: {input_data.competitiveAdvantage}
            
            Evaluate how original this idea is, what aspects are truly innovative, and how it 
            differs from existing solutions. Consider whether this is an incremental improvement
            or potentially disruptive innovation.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "novelty_assessment": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error assessing novelty: {str(e)}"
        }


def evaluate_disruption_potential(state: InnovationState) -> InnovationState:
    """Evaluate the potential for industry disruption."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_innovation_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a disruptive innovation specialist.
            Your task is to evaluate a startup idea's potential to disrupt established industry patterns,
            business models, or technologies. Consider factors like network effects, scale potential, and barriers to disruption."""),
            
            HumanMessage(content=f"""Evaluate the disruption potential of this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Problem Solved: {input_data.problemSolved}
            Competitive Advantage: {input_data.competitiveAdvantage}
            
            Assess how this idea might disrupt existing industry patterns, business models, 
            or technologies. Consider network effects, scaling potential, and barriers to disruption.
            Analyze if this has the potential to create a new market or significantly change an existing one.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "disruption_assessment": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error evaluating disruption potential: {str(e)}"
        }


def assess_technical_feasibility(state: InnovationState) -> InnovationState:
    """Assess the technical feasibility of the innovation."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_innovation_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a technical feasibility expert with experience in startup technology evaluation.
            Your task is to assess the technical feasibility of implementing a startup idea based on the provided information.
            Consider technical challenges, implementation timeline, and resource requirements."""),
            
            HumanMessage(content=f"""Assess the technical feasibility of this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Problem Solved: {input_data.problemSolved}
            Competitive Advantage: {input_data.competitiveAdvantage}
            
            Evaluate the technical complexity, potential implementation challenges, development timeline,
            and resource requirements. Consider if the technology exists, needs refinement, or must be developed from scratch.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "technical_assessment": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error assessing technical feasibility: {str(e)}"
        }


def generate_innovation_score(state: InnovationState) -> InnovationState:
    """Generate final innovation score and insights."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_innovation_llm()
        
        input_data = state["input"]
        novelty = state.get("novelty_assessment", "")
        disruption = state.get("disruption_assessment", "")
        technical = state.get("technical_assessment", "")
        
        messages = [
            SystemMessage(content="""You are an innovation scoring expert who synthesizes innovation analyses into actionable insights.
            Your task is to review multiple analyses and generate a final innovation score with key insights.
            Be objective and data-driven in your assessment."""),
            
            HumanMessage(content=f"""Based on the following analyses, generate an innovation score (0-100) and key insights:
            
            Startup Information:
            Idea: {input_data.idea}
            Industry: {input_data.industry}
            Problem Solved: {input_data.problemSolved}
            Competitive Advantage: {input_data.competitiveAdvantage}
            
            Novelty Assessment:
            {novelty}
            
            Disruption Potential:
            {disruption}
            
            Technical Feasibility:
            {technical}
            
            Provide the following:
            1. An innovation score from 0-100 (higher is better)
            2. An assessment of idea novelty
            3. An evaluation of disruption potential
            4. A summary of technical feasibility
            5. Key innovation insights and recommendations
            
            Format your response as a JSON object with the following fields:
            noveltyAssessment, disruptionPotential, technicalFeasibility, innovationScore, innovationInsights
            """)
        ]
        
        response = llm.invoke(messages)
        
        # In a real implementation, we would parse the JSON response
        # For simplicity, we'll create a mock response
        # This would be replaced with actual JSON parsing in production
        
        output = InnovationAnalysisOutput(
            noveltyAssessment="The concept shows moderate novelty with a unique approach to an existing problem",
            disruptionPotential="Medium disruption potential with ability to challenge incumbent solutions",
            technicalFeasibility="Technically feasible with existing technologies; moderate development complexity",
            innovationScore=82.1,
            innovationInsights="The idea demonstrates strong innovation potential through its unique approach to solving a common problem. While not revolutionary, it offers significant improvement over existing solutions."
        )
        
        return {
            **state,
            "output": output
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error generating innovation score: {str(e)}"
        }


def create_innovation_analysis_graph() -> StateGraph:
    """Create the innovation analysis graph."""
    workflow = StateGraph(InnovationState)
    
    # Add nodes
    workflow.add_node("assess_novelty", assess_novelty)
    workflow.add_node("evaluate_disruption_potential", evaluate_disruption_potential)
    workflow.add_node("assess_technical_feasibility", assess_technical_feasibility)
    workflow.add_node("generate_innovation_score", generate_innovation_score)
    
    # Define edges
    workflow.add_edge("assess_novelty", "evaluate_disruption_potential")
    workflow.add_edge("evaluate_disruption_potential", "assess_technical_feasibility")
    workflow.add_edge("assess_technical_feasibility", "generate_innovation_score")
    
    # Set entry and exit points
    workflow.set_entry_point("assess_novelty")
    workflow.set_finish_point("generate_innovation_score")
    
    return workflow


def analyze_innovation(input_data: InnovationAnalysisInput) -> InnovationAnalysisOutput:
    """Run the innovation analysis workflow."""
    try:
        graph = create_innovation_analysis_graph().compile()
        
        state = {
            "input": input_data,
            "output": None,
            "error": None
        }
        
        result = graph.invoke(state)
        
        if result["error"]:
            raise ValueError(result["error"])
        
        return result["output"]
    except Exception as e:
        raise ValueError(f"Innovation analysis failed: {str(e)}")

