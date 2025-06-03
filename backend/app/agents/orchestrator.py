from typing import Dict, Any, Optional, TypedDict
from uuid import UUID
import asyncio
from pydantic import BaseModel, Field

from app.schemas.questions import StartupFormData
from app.schemas.analysis import StartupAnalysis
from app.agents.market_analyst import MarketAnalysisInput, analyze_market
from app.agents.financial_analyst import FinancialAnalysisInput, analyze_financials
from app.agents.innovation_analyst import InnovationAnalysisInput, analyze_innovation
from app.agents.risk_analyst import RiskAnalysisInput, analyze_risks


class AnalysisResult(TypedDict):
    """The result of a startup analysis."""
    pitch: str
    marketViability: float
    financialViability: float
    innovationScore: float
    riskAssessment: float
    overallScore: float
    feedback: str
    error: Optional[str]


async def generate_startup_pitch(data: StartupFormData) -> str:
    """Generate a startup pitch based on the input data."""
    pitch = f"""Introducing {data.idea} - a revolutionary solution for the {data.industry} industry.

Our mission is to help {data.targetAudience} by {data.problemSolved.lower()}.

What sets us apart is our {data.competitiveAdvantage.lower()}, which gives us a significant edge over competitors.

We generate revenue through our {data.businessModel.lower()} and are seeking {data.fundingNeeds.lower()} to accelerate our growth and market penetration.
    """
    return pitch


async def analyze_startup(data: StartupFormData) -> AnalysisResult:
    """Orchestrate the analysis of a startup idea using multiple agents."""
    try:
        # Create tasks for parallel execution
        market_task = asyncio.create_task(
            analyze_market_async(
                MarketAnalysisInput(
                    idea=data.idea,
                    industry=data.industry,
                    targetAudience=data.targetAudience,
                    problemSolved=data.problemSolved,
                    competitiveAdvantage=data.competitiveAdvantage,
                )
            )
        )
        
        financial_task = asyncio.create_task(
            analyze_financials_async(
                FinancialAnalysisInput(
                    idea=data.idea,
                    industry=data.industry,
                    businessModel=data.businessModel,
                    fundingNeeds=data.fundingNeeds,
                )
            )
        )
        
        innovation_task = asyncio.create_task(
            analyze_innovation_async(
                InnovationAnalysisInput(
                    idea=data.idea,
                    industry=data.industry,
                    problemSolved=data.problemSolved,
                    competitiveAdvantage=data.competitiveAdvantage,
                )
            )
        )
        
        risk_task = asyncio.create_task(
            analyze_risks_async(
                RiskAnalysisInput(
                    idea=data.idea,
                    industry=data.industry,
                    targetAudience=data.targetAudience,
                    businessModel=data.businessModel,
                    competitiveAdvantage=data.competitiveAdvantage,
                )
            )
        )
        
        pitch_task = asyncio.create_task(generate_startup_pitch(data))
        
        # Wait for all tasks to complete
        market_result, financial_result, innovation_result, risk_result, pitch = await asyncio.gather(
            market_task, financial_task, innovation_task, risk_task, pitch_task
        )
        
        # Calculate overall score (weighted average)
        market_weight = 0.3
        financial_weight = 0.3
        innovation_weight = 0.2
        risk_weight = 0.2
        
        overall_score = (
            market_result["marketViabilityScore"] * market_weight +
            financial_result["financialViabilityScore"] * financial_weight +
            innovation_result["innovationScore"] * innovation_weight +
            risk_result["riskAssessmentScore"] * risk_weight
        )
        
        # Generate comprehensive feedback
        feedback = f"""
Market Analysis: {market_result.get("marketInsights", "No market insights available.")}

Financial Assessment: {financial_result.get("financialInsights", "No financial insights available.")}

Innovation Evaluation: {innovation_result.get("innovationInsights", "No innovation insights available.")}

Risk Assessment: {risk_result.get("riskInsights", "No risk insights available.")}

Overall Recommendation:
Based on our analysis, your startup idea shows {'strong' if overall_score > 75 else 'moderate' if overall_score > 50 else 'limited'} potential. 
{'We recommend proceeding with confidence while addressing the identified risks.' if overall_score > 75 
 else 'Consider refining your approach based on our feedback before proceeding.' if overall_score > 50
 else 'We recommend significant refinement of your concept before proceeding further.'}
        """
        
        return {
            "pitch": pitch,
            "marketViability": market_result["marketViabilityScore"],
            "financialViability": financial_result["financialViabilityScore"],
            "innovationScore": innovation_result["innovationScore"],
            "riskAssessment": risk_result["riskAssessmentScore"],
            "overallScore": overall_score,
            "feedback": feedback,
            "error": None
        }
    except Exception as e:
        return {
            "pitch": "",
            "marketViability": 0.0,
            "financialViability": 0.0,
            "innovationScore": 0.0,
            "riskAssessment": 0.0,
            "overallScore": 0.0,
            "feedback": "",
            "error": f"Analysis failed: {str(e)}"
        }


async def analyze_market_async(input_data: MarketAnalysisInput) -> Dict[str, Any]:
    """Asynchronous wrapper for market analysis."""
    try:
        # This is a synchronous function, so run it in an executor
        result = analyze_market(input_data)
        return {
            "marketViabilityScore": result.marketViabilityScore,
            "marketInsights": result.marketInsights,
        }
    except Exception as e:
        return {
            "marketViabilityScore": 50.0,  # Default value
            "marketInsights": f"Market analysis encountered an error: {str(e)}"
        }


async def analyze_financials_async(input_data: FinancialAnalysisInput) -> Dict[str, Any]:
    """Asynchronous wrapper for financial analysis."""
    try:
        # This is a synchronous function, so run it in an executor
        result = analyze_financials(input_data)
        return {
            "financialViabilityScore": result.financialViabilityScore,
            "financialInsights": result.financialInsights,
        }
    except Exception as e:
        return {
            "financialViabilityScore": 50.0,  # Default value
            "financialInsights": f"Financial analysis encountered an error: {str(e)}"
        }


async def analyze_innovation_async(input_data: InnovationAnalysisInput) -> Dict[str, Any]:
    """Asynchronous wrapper for innovation analysis."""
    try:
        # This is a synchronous function, so run it in an executor
        result = analyze_innovation(input_data)
        return {
            "innovationScore": result.innovationScore,
            "innovationInsights": result.innovationInsights,
        }
    except Exception as e:
        return {
            "innovationScore": 50.0,  # Default value
            "innovationInsights": f"Innovation analysis encountered an error: {str(e)}"
        }


async def analyze_risks_async(input_data: RiskAnalysisInput) -> Dict[str, Any]:
    """Asynchronous wrapper for risk analysis."""
    try:
        # This is a synchronous function, so run it in an executor
        result = analyze_risks(input_data)
        return {
            "riskAssessmentScore": result.riskAssessmentScore,
            "riskInsights": result.riskInsights,
        }
    except Exception as e:
        return {
            "riskAssessmentScore": 50.0,  # Default value
            "riskInsights": f"Risk analysis encountered an error: {str(e)}"
        }


def create_startup_analysis(analysis_result: AnalysisResult, analysis_id: UUID) -> StartupAnalysis:
    """Create a StartupAnalysis object from the analysis result."""
    return StartupAnalysis(
        id=analysis_id,
        pitch=analysis_result["pitch"],
        marketViability=analysis_result["marketViability"],
        financialViability=analysis_result["financialViability"],
        innovationScore=analysis_result["innovationScore"],
        riskAssessment=analysis_result["riskAssessment"],
        overallScore=analysis_result["overallScore"],
        feedback=analysis_result["feedback"]
    )

