from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field


class StartupInput(BaseModel):
    """User input for startup simulation."""
    name: str = Field(..., description="The name of your startup")
    mission: str = Field(..., description="Your startup's mission statement")
    prompt: str = Field(..., description="The prompt to send to the LLM")
    
    class Config:
        schema_extra = {
            "example": {
                "name": "NeuralDreams.io",
                "mission": "Revolutionizing sleep with AI",
                "prompt": "Generate a product description for our AI-powered dream enhancement app."
            }
        }


class StrategyOutput(BaseModel):
    """Output from the strategy agent."""
    vision: str = Field(..., description="The strategic vision")
    target_market: str = Field(..., description="Description of target market")
    funding_goal: str = Field(..., description="Amount of funding seeking")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    buzzwords: List[str] = Field(..., description="List of buzzwords to use")


class StackConfiguration(BaseModel):
    """Configuration for the LLM stack."""
    model_name: str = Field(..., description="Name of the LLM model")
    temperature: float = Field(..., ge=0, le=2, description="Temperature setting")
    max_tokens: int = Field(..., description="Maximum tokens to generate")
    tools_selected: List[str] = Field(..., description="Tools selected for the stack")
    architecture_description: str = Field(..., description="Description of the architecture")


class EvaluationResult(BaseModel):
    """Evaluation results from Galileo."""
    hallucination_score: float = Field(..., ge=0, le=1, description="Hallucination score (0-1)")
    instruction_following: float = Field(..., ge=0, le=1, description="Instruction following score (0-1)")
    relevance: float = Field(..., ge=0, le=1, description="Relevance score (0-1)")
    tool_use_accuracy: Optional[float] = Field(None, ge=0, le=1, description="Tool use accuracy (0-1)")
    critique: str = Field(..., description="Critical feedback on output")
    investor_appeal: float = Field(..., ge=0, le=1, description="Investor appeal score (0-1)")


class InvestorDecision(BaseModel):
    """Investor decision on funding."""
    funded: bool = Field(..., description="Whether the startup received funding")
    amount: Optional[str] = Field(None, description="Amount of funding provided")
    feedback: str = Field(..., description="Investor feedback")
    valuation: Optional[str] = Field(None, description="Company valuation")


class SimulationResult(BaseModel):
    """Complete simulation result."""
    startup_name: str = Field(..., description="Name of the startup")
    strategy: StrategyOutput = Field(..., description="Strategic details")
    stack: StackConfiguration = Field(..., description="LLM stack configuration")
    prompt: str = Field(..., description="Original prompt")
    output: str = Field(..., description="LLM generated output")
    evals: EvaluationResult = Field(..., description="Evaluation results")
    decision: InvestorDecision = Field(..., description="Investor decision")
    archetype: str = Field(..., description="Startup archetype")
    
    class Config:
        schema_extra = {
            "example": {
                "startup_name": "NeuralDreams.io",
                "strategy": {
                    "vision": "To disrupt the sleep industry with AI-powered dream enhancement",
                    "target_market": "Overworked professionals with sleep anxiety",
                    "funding_goal": "$8M",
                    "confidence": 0.92,
                    "buzzwords": ["neural-sleep", "dream-tech", "consciousness-as-a-service"]
                },
                "stack": {
                    "model_name": "gpt-4-turbo",
                    "temperature": 0.7,
                    "max_tokens": 1000,
                    "tools_selected": ["buzzword_biography_generator", "tech_complexifier"],
                    "architecture_description": "A three-tier distributed dream-state architecture"
                },
                "prompt": "Generate a product description for our AI-powered dream enhancement app.",
                "output": "Introducing DreamCanvas™, the revolutionary AI-powered dream enhancement app...",
                "evals": {
                    "hallucination_score": 0.78,
                    "instruction_following": 0.65,
                    "relevance": 0.82,
                    "tool_use_accuracy": 0.45,
                    "critique": "High on fluff, low on substance. Perfect for VC pitch.",
                    "investor_appeal": 0.88
                },
                "decision": {
                    "funded": True,
                    "amount": "$5.5M",
                    "feedback": "Love the vision. No idea how it works. Take my money.",
                    "valuation": "$45M"
                },
                "archetype": "The Hype Whisperer"
            }
        } 