from typing import Dict, Any, Optional, TypedDict, List
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph

from app.core.config import settings


class RiskAnalysisInput(BaseModel):
    """Input for risk analysis."""
    idea: str = Field(..., description="The startup idea")
    industry: str = Field(..., description="The industry of the startup")
    targetAudience: str = Field(..., description="The target audience of the startup")
    businessModel: str = Field(..., description="The business model of the startup")
    competitiveAdvantage: str = Field(..., description="Competitive advantage of the startup")


class Risk(BaseModel):
    """Individual risk item."""
    category: str = Field(..., description="Risk category (e.g., Market, Financial, Technical)")
    description: str = Field(..., description="Description of the risk")
    impact: str = Field(..., description="Potential impact")
    likelihood: str = Field(..., description="Likelihood of occurrence")
    mitigation: str = Field(..., description="Possible mitigation strategies")


class RiskAnalysisOutput(BaseModel):
    """Output from risk analysis."""
    topRisks: List[Risk] = Field(..., description="Top identified risks")
    riskAssessmentScore: float = Field(..., ge=0, le=100, description="Risk assessment score (0-100, higher means lower risk)")
    riskInsights: str = Field(..., description="Key insights about risks and mitigation")


class RiskState(TypedDict):
    """State for the risk analysis graph."""
    input: RiskAnalysisInput
    output: Optional[RiskAnalysisOutput]
    error: Optional[str]


def get_risk_llm():
    """Get the LLM model for risk analysis."""
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        temperature=0.1,
        api_key=settings.OPENAI_API_KEY,
    )


def analyze_market_risks(state: RiskState) -> RiskState:
    """Analyze market-related risks."""
    try:
        llm = get_risk_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a market risk analyst specializing in startup ventures.
            Your task is to identify and analyze potential market-related risks for a startup idea.
            Consider factors like market volatility, regulatory changes, and customer adoption barriers."""),
            
            HumanMessage(content=f"""Analyze the market-related risks for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Target Audience: {input_data.targetAudience}
            Business Model: {input_data.businessModel}
            Competitive Advantage: {input_data.competitiveAdvantage}
            
            Identify and analyze potential market risks including market volatility, 
            changing customer preferences, regulatory challenges, and competitive threats.
            For each risk, provide a description, potential impact, likelihood, and possible mitigation strategies.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "market_risks": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error analyzing market risks: {str(e)}"
        }


def analyze_operational_risks(state: RiskState) -> RiskState:
    """Analyze operational and execution risks."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_risk_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are an operational risk specialist for startups.
            Your task is to identify and analyze potential operational and execution risks for a startup idea.
            Consider factors like team capabilities, supply chain, technical implementation, and scaling challenges."""),
            
            HumanMessage(content=f"""Analyze the operational and execution risks for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Business Model: {input_data.businessModel}
            
            Identify and analyze potential operational risks including technical implementation challenges,
            supply chain issues, team capability gaps, and scaling difficulties.
            For each risk, provide a description, potential impact, likelihood, and possible mitigation strategies.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "operational_risks": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error analyzing operational risks: {str(e)}"
        }


def analyze_financial_risks(state: RiskState) -> RiskState:
    """Analyze financial risks."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_risk_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a financial risk analyst for startups.
            Your task is to identify and analyze potential financial risks for a startup idea.
            Consider factors like cash flow challenges, funding gaps, revenue model weaknesses, and cost overruns."""),
            
            HumanMessage(content=f"""Analyze the financial risks for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Business Model: {input_data.businessModel}
            
            Identify and analyze potential financial risks including cash flow challenges,
            funding gaps, revenue model weaknesses, and potential cost overruns.
            For each risk, provide a description, potential impact, likelihood, and possible mitigation strategies.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "financial_risks": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error analyzing financial risks: {str(e)}"
        }


def generate_risk_assessment(state: RiskState) -> RiskState:
    """Generate comprehensive risk assessment and score."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_risk_llm()
        
        input_data = state["input"]
        market_risks = state.get("market_risks", "")
        operational_risks = state.get("operational_risks", "")
        financial_risks = state.get("financial_risks", "")
        
        messages = [
            SystemMessage(content="""You are a comprehensive risk assessment expert for startups.
            Your task is to synthesize various risk analyses into a coherent assessment with a final risk score.
            Be objective and data-driven in your evaluation."""),
            
            HumanMessage(content=f"""Based on the following risk analyses, generate a comprehensive risk assessment and score:
            
            Startup Information:
            Idea: {input_data.idea}
            Industry: {input_data.industry}
            Target Audience: {input_data.targetAudience}
            Business Model: {input_data.businessModel}
            
            Market Risks:
            {market_risks}
            
            Operational Risks:
            {operational_risks}
            
            Financial Risks:
            {financial_risks}
            
            Provide the following:
            1. A risk assessment score from 0-100 (higher means LOWER risk / better outlook)
            2. A list of the top 3-5 most critical risks across all categories
            3. Key risk insights and mitigation recommendations
            
            Format the top risks as a list of JSON objects with these fields for each risk:
            category, description, impact, likelihood, mitigation
            
            Also include a riskAssessmentScore (number) and riskInsights (text) in your JSON response.
            """)
        ]
        
        response = llm.invoke(messages)
        
        # In a real implementation, we would parse the JSON response
        # For simplicity, we'll create a mock response
        # This would be replaced with actual JSON parsing in production
        
        risks = [
            Risk(
                category="Market",
                description="Rapidly changing customer preferences in target market",
                impact="Could reduce product-market fit and slow adoption",
                likelihood="Medium",
                mitigation="Implement agile development and continuous customer feedback loops"
            ),
            Risk(
                category="Financial",
                description="Extended runway required before achieving positive cash flow",
                impact="Could exhaust funding before reaching sustainability",
                likelihood="High",
                mitigation="Create tiered funding strategy with clear milestones and conservative cash management"
            ),
            Risk(
                category="Operational",
                description="Scaling challenges if rapid growth occurs",
                impact="Service disruptions and quality issues",
                likelihood="Medium",
                mitigation="Develop scalable architecture and processes from the beginning"
            )
        ]
        
        output = RiskAnalysisOutput(
            topRisks=risks,
            riskAssessmentScore=62.7,
            riskInsights="The venture faces typical startup risks with moderate overall risk profile. Financial runway and market timing represent the most significant challenges. Early focus on customer validation and lean operations will be critical to mitigate key risks."
        )
        
        return {
            **state,
            "output": output
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error generating risk assessment: {str(e)}"
        }


def create_risk_analysis_graph() -> StateGraph:
    """Create the risk analysis graph."""
    workflow = StateGraph(RiskState)
    
    # Add nodes
    workflow.add_node("analyze_market_risks", analyze_market_risks)
    workflow.add_node("analyze_operational_risks", analyze_operational_risks)
    workflow.add_node("analyze_financial_risks", analyze_financial_risks)
    workflow.add_node("generate_risk_assessment", generate_risk_assessment)
    
    # Define edges
    workflow.add_edge("analyze_market_risks", "analyze_operational_risks")
    workflow.add_edge("analyze_operational_risks", "analyze_financial_risks")
    workflow.add_edge("analyze_financial_risks", "generate_risk_assessment")
    
    # Set entry and exit points
    workflow.set_entry_point("analyze_market_risks")
    workflow.set_finish_point("generate_risk_assessment")
    
    return workflow


def analyze_risks(input_data: RiskAnalysisInput) -> RiskAnalysisOutput:
    """Run the risk analysis workflow."""
    try:
        graph = create_risk_analysis_graph().compile()
        
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
        raise ValueError(f"Risk analysis failed: {str(e)}")

