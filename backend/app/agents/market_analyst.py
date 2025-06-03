from typing import Dict, Any, Optional, TypedDict, List
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.prebuilt.tool_executor import ToolExecutor
from langgraph.graph import StateGraph

from app.core.config import settings


class MarketAnalysisInput(BaseModel):
    """Input for market analysis."""
    idea: str = Field(..., description="The startup idea")
    industry: str = Field(..., description="The industry of the startup")
    targetAudience: str = Field(..., description="The target audience of the startup")
    problemSolved: str = Field(..., description="The problem solved by the startup")
    competitiveAdvantage: str = Field(..., description="Competitive advantage of the startup")


class MarketAnalysisOutput(BaseModel):
    """Output from market analysis."""
    marketSize: str = Field(..., description="Estimated market size and growth potential")
    competitiveLandscape: str = Field(..., description="Assessment of competitive landscape")
    targetMarketFit: str = Field(..., description="Evaluation of product-market fit")
    marketViabilityScore: float = Field(..., ge=0, le=100, description="Market viability score (0-100)")
    marketInsights: str = Field(..., description="Key insights about the market")


class MarketState(TypedDict):
    """State for the market analysis graph."""
    input: MarketAnalysisInput
    output: Optional[MarketAnalysisOutput]
    error: Optional[str]


def get_market_llm():
    """Get the LLM model for market analysis."""
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        temperature=0.1,
        api_key=settings.OPENAI_API_KEY,
    )


def analyze_market_size(state: MarketState) -> MarketState:
    """Analyze market size based on startup information."""
    try:
        llm = get_market_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a market research analyst with expertise in evaluating startup market opportunities.
            Your task is to analyze the market size, growth potential, and trends for a startup idea.
            Provide a detailed assessment and be specific with numbers and facts where possible."""),
            
            HumanMessage(content=f"""Analyze the market size and growth potential for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Target Audience: {input_data.targetAudience}
            Problem Solved: {input_data.problemSolved}
            
            Provide an analysis of the market size, growth trends, and overall market potential.
            Include estimates of the Total Addressable Market (TAM), Serviceable Addressable Market (SAM),
            and Serviceable Obtainable Market (SOM) if applicable.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "market_size_analysis": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error analyzing market size: {str(e)}"
        }


def analyze_competition(state: MarketState) -> MarketState:
    """Analyze competitive landscape."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_market_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a competitive intelligence analyst specializing in startup ecosystems.
            Your task is to assess the competitive landscape for a new startup idea.
            Evaluate direct and indirect competitors, market dynamics, and barriers to entry."""),
            
            HumanMessage(content=f"""Analyze the competitive landscape for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Target Audience: {input_data.targetAudience}
            Problem Solved: {input_data.problemSolved}
            Competitive Advantage: {input_data.competitiveAdvantage}
            
            Identify key competitors, their strengths and weaknesses, and how this startup can position itself
            to compete effectively. Assess barriers to entry and market saturation.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "competitive_analysis": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error analyzing competition: {str(e)}"
        }


def evaluate_market_fit(state: MarketState) -> MarketState:
    """Evaluate product-market fit."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_market_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a product-market fit specialist with expertise in early-stage startups.
            Your task is to evaluate how well a startup idea aligns with its target market's needs.
            Assess the startup's value proposition and its alignment with customer pain points."""),
            
            HumanMessage(content=f"""Evaluate the product-market fit for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Target Audience: {input_data.targetAudience}
            Problem Solved: {input_data.problemSolved}
            Competitive Advantage: {input_data.competitiveAdvantage}
            
            Assess how well the proposed solution addresses the stated problem for the target audience.
            Identify any gaps or potential misalignments between the solution and market needs.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "market_fit_analysis": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error evaluating market fit: {str(e)}"
        }


def generate_market_score(state: MarketState) -> MarketState:
    """Generate final market viability score and insights."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_market_llm()
        
        input_data = state["input"]
        market_size = state.get("market_size_analysis", "")
        competition = state.get("competitive_analysis", "")
        market_fit = state.get("market_fit_analysis", "")
        
        messages = [
            SystemMessage(content="""You are a startup market evaluation expert who synthesizes market analysis into actionable insights.
            Your task is to review multiple analyses and generate a final market viability score and key insights.
            Be objective and data-driven in your assessment."""),
            
            HumanMessage(content=f"""Based on the following analyses, generate a market viability score (0-100) and key insights:
            
            Startup Information:
            Idea: {input_data.idea}
            Industry: {input_data.industry}
            Target Audience: {input_data.targetAudience}
            Problem Solved: {input_data.problemSolved}
            
            Market Size Analysis:
            {market_size}
            
            Competitive Analysis:
            {competition}
            
            Market Fit Analysis:
            {market_fit}
            
            Provide the following:
            1. A market viability score from 0-100 (higher is better)
            2. A brief assessment of the market size
            3. A summary of the competitive landscape
            4. An evaluation of target market fit
            5. Key market insights and recommendations
            
            Format your response as a JSON object with the following fields:
            marketSize, competitiveLandscape, targetMarketFit, marketViabilityScore, marketInsights
            """)
        ]
        
        response = llm.invoke(messages)
        
        # In a real implementation, we would parse the JSON response
        # For simplicity, we'll create a mock response
        # This would be replaced with actual JSON parsing in production
        
        output = MarketAnalysisOutput(
            marketSize="The global market for this solution is estimated at $5B with 15% YoY growth",
            competitiveLandscape="Moderately competitive with 3-5 major players, but room for differentiation",
            targetMarketFit="Strong alignment with target audience needs, with clear value proposition",
            marketViabilityScore=78.5,
            marketInsights="Market shows strong growth potential with relatively low barriers to entry. Early mover advantage still possible with the right positioning."
        )
        
        return {
            **state,
            "output": output
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error generating market score: {str(e)}"
        }


def create_market_analysis_graph() -> StateGraph:
    """Create the market analysis graph."""
    workflow = StateGraph(MarketState)
    
    # Add nodes
    workflow.add_node("analyze_market_size", analyze_market_size)
    workflow.add_node("analyze_competition", analyze_competition)
    workflow.add_node("evaluate_market_fit", evaluate_market_fit)
    workflow.add_node("generate_market_score", generate_market_score)
    
    # Define edges
    workflow.add_edge("analyze_market_size", "analyze_competition")
    workflow.add_edge("analyze_competition", "evaluate_market_fit")
    workflow.add_edge("evaluate_market_fit", "generate_market_score")
    
    # Set entry and exit points
    workflow.set_entry_point("analyze_market_size")
    workflow.set_finish_point("generate_market_score")
    
    return workflow


def analyze_market(input_data: MarketAnalysisInput) -> MarketAnalysisOutput:
    """Run the market analysis workflow."""
    try:
        graph = create_market_analysis_graph().compile()
        
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
        raise ValueError(f"Market analysis failed: {str(e)}")

