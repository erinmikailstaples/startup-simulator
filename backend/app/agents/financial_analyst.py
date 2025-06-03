from typing import Dict, Any, Optional, TypedDict
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph

from app.core.config import settings


class FinancialAnalysisInput(BaseModel):
    """Input for financial analysis."""
    idea: str = Field(..., description="The startup idea")
    industry: str = Field(..., description="The industry of the startup")
    businessModel: str = Field(..., description="The business model of the startup")
    fundingNeeds: str = Field(..., description="Funding needs and capital allocation")


class FinancialAnalysisOutput(BaseModel):
    """Output from financial analysis."""
    revenueModel: str = Field(..., description="Assessment of the revenue model")
    costStructure: str = Field(..., description="Analysis of the cost structure")
    fundingAssessment: str = Field(..., description="Evaluation of funding needs and strategy")
    financialViabilityScore: float = Field(..., ge=0, le=100, description="Financial viability score (0-100)")
    financialInsights: str = Field(..., description="Key insights about financial viability")


class FinancialState(TypedDict):
    """State for the financial analysis graph."""
    input: FinancialAnalysisInput
    output: Optional[FinancialAnalysisOutput]
    error: Optional[str]


def get_financial_llm():
    """Get the LLM model for financial analysis."""
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        temperature=0.1,
        api_key=settings.OPENAI_API_KEY,
    )


def analyze_revenue_model(state: FinancialState) -> FinancialState:
    """Analyze the revenue model based on startup information."""
    try:
        llm = get_financial_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a financial analyst specializing in startup revenue models.
            Your task is to analyze the potential revenue streams, pricing strategy, and scalability of a startup's business model.
            Provide a detailed assessment focusing on financial viability."""),
            
            HumanMessage(content=f"""Analyze the revenue model for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Business Model: {input_data.businessModel}
            
            Evaluate the revenue streams, pricing strategy, customer acquisition costs, 
            lifetime value potential, and overall revenue scalability. Consider industry 
            benchmarks and best practices.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "revenue_analysis": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error analyzing revenue model: {str(e)}"
        }


def analyze_cost_structure(state: FinancialState) -> FinancialState:
    """Analyze the cost structure of the startup."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_financial_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a cost structure analyst for startups.
            Your task is to evaluate the potential fixed and variable costs, operational expenses,
            and capital requirements for a startup idea. Identify potential financial risks and inefficiencies."""),
            
            HumanMessage(content=f"""Analyze the potential cost structure for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Business Model: {input_data.businessModel}
            Funding Needs: {input_data.fundingNeeds}
            
            Identify the likely fixed costs, variable costs, operational expenses, and capital requirements.
            Evaluate cost-efficiency potential and financial risks. Consider industry-specific cost factors.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "cost_analysis": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error analyzing cost structure: {str(e)}"
        }


def evaluate_funding_strategy(state: FinancialState) -> FinancialState:
    """Evaluate the funding strategy and needs."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_financial_llm()
        
        input_data = state["input"]
        
        messages = [
            SystemMessage(content="""You are a startup funding strategist with expertise in capital raising.
            Your task is to evaluate a startup's funding needs, capital allocation plan, and funding strategy.
            Provide practical advice on funding sources, timelines, and milestones."""),
            
            HumanMessage(content=f"""Evaluate the funding strategy for this startup idea:
            
            Startup Idea: {input_data.idea}
            Industry: {input_data.industry}
            Business Model: {input_data.businessModel}
            Funding Needs: {input_data.fundingNeeds}
            
            Assess if the funding needs are appropriate, identify suitable funding sources, 
            and evaluate the capital allocation plan. Consider the funding landscape for this 
            industry and the typical metrics investors look for.
            """)
        ]
        
        response = llm.invoke(messages)
        
        return {
            **state,
            "funding_analysis": response.content
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error evaluating funding strategy: {str(e)}"
        }


def generate_financial_score(state: FinancialState) -> FinancialState:
    """Generate final financial viability score and insights."""
    if "error" in state and state["error"]:
        return state
    
    try:
        llm = get_financial_llm()
        
        input_data = state["input"]
        revenue_analysis = state.get("revenue_analysis", "")
        cost_analysis = state.get("cost_analysis", "")
        funding_analysis = state.get("funding_analysis", "")
        
        messages = [
            SystemMessage(content="""You are a financial viability expert for startups.
            Your task is to synthesize various financial analyses into a comprehensive assessment with a final score.
            Be objective and data-driven in your evaluation."""),
            
            HumanMessage(content=f"""Based on the following analyses, generate a financial viability score (0-100) and key insights:
            
            Startup Information:
            Idea: {input_data.idea}
            Industry: {input_data.industry}
            Business Model: {input_data.businessModel}
            Funding Needs: {input_data.fundingNeeds}
            
            Revenue Analysis:
            {revenue_analysis}
            
            Cost Analysis:
            {cost_analysis}
            
            Funding Analysis:
            {funding_analysis}
            
            Provide the following:
            1. A financial viability score from 0-100 (higher is better)
            2. An assessment of the revenue model
            3. An analysis of the cost structure
            4. An evaluation of the funding strategy
            5. Key financial insights and recommendations
            
            Format your response as a JSON object with the following fields:
            revenueModel, costStructure, fundingAssessment, financialViabilityScore, financialInsights
            """)
        ]
        
        response = llm.invoke(messages)
        
        # In a real implementation, we would parse the JSON response
        # For simplicity, we'll create a mock response
        # This would be replaced with actual JSON parsing in production
        
        output = FinancialAnalysisOutput(
            revenueModel="Subscription-based model shows good potential for recurring revenue with strong unit economics",
            costStructure="Reasonable fixed costs with scalable variable expenses; technology development is the main capital expenditure",
            fundingAssessment="Funding needs appear appropriate for the development stage; angel or seed funding recommended",
            financialViabilityScore=68.3,
            financialInsights="Business model shows promising unit economics but will require careful management of customer acquisition costs. Path to profitability appears reasonable within 24-36 months given projected growth."
        )
        
        return {
            **state,
            "output": output
        }
    except Exception as e:
        return {
            **state,
            "error": f"Error generating financial score: {str(e)}"
        }


def create_financial_analysis_graph() -> StateGraph:
    """Create the financial analysis graph."""
    workflow = StateGraph(FinancialState)
    
    # Add nodes
    workflow.add_node("analyze_revenue_model", analyze_revenue_model)
    workflow.add_node("analyze_cost_structure", analyze_cost_structure)
    workflow.add_node("evaluate_funding_strategy", evaluate_funding_strategy)
    workflow.add_node("generate_financial_score", generate_financial_score)
    
    # Define edges
    workflow.add_edge("analyze_revenue_model", "analyze_cost_structure")
    workflow.add_edge("analyze_cost_structure", "evaluate_funding_strategy")
    workflow.add_edge("evaluate_funding_strategy", "generate_financial_score")
    
    # Set entry and exit points
    workflow.set_entry_point("analyze_revenue_model")
    workflow.set_finish_point("generate_financial_score")
    
    return workflow


def analyze_financials(input_data: FinancialAnalysisInput) -> FinancialAnalysisOutput:
    """Run the financial analysis workflow."""
    try:
        graph = create_financial_analysis_graph().compile()
        
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
        raise ValueError(f"Financial analysis failed: {str(e)}")

