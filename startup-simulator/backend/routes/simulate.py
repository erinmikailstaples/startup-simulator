import json
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
import random
import time

from ..models.game_models import StartupInput, SimulationResult
from ..agents.strategy_agent import strategy_agent
from ..services.galileo import galileo_service
from ..config import settings

router = APIRouter()

# Models
class EvaluationResults(BaseModel):
    hallucination_score: float
    instruction_following: float
    relevance: float
    tool_use_accuracy: float
    confidence: float
    overall_rating: str
    custom_evaluator_comment: str

class InvestorDecision(BaseModel):
    funded: bool
    amount: str = None
    valuation: str = None
    feedback: str

class SimulationResult(BaseModel):
    output: str
    evals: EvaluationResults
    decision: InvestorDecision
    archetype: str

router = APIRouter()

# Archetypes
ARCHETYPES = [
    "The Hallucination Harvester",
    "The Buzzword Bluffer",
    "The Hype Whisperer",
    "The Prompt Mystic",
    "The Funding Savant",
    "The VC Whisperer",
    "The Tech Complexifier",
    "The Silicon Valley Oracle",
]

@router.post("/simulate", response_model=SimulationResult)
async def simulate(input_data: StartupInput):
    # Add a small delay to simulate processing
    time.sleep(1)
    
    # Generate mock output
    output = generate_mock_output(input_data.prompt)
    
    # Generate mock evaluations
    evals = generate_mock_evals()
    
    # Generate mock investor decision
    decision = generate_mock_decision(evals)
    
    # Determine archetype
    archetype = random.choice(ARCHETYPES)
    
    return SimulationResult(
        output=output,
        evals=evals,
        decision=decision,
        archetype=archetype
    )

def generate_mock_output(prompt: str) -> str:
    """Generate a mock LLM output based on the prompt"""
    # Sample buzzwords to sprinkle in
    buzzwords = [
        "AI-driven", "blockchain", "neural", "quantum", "synergy", 
        "paradigm shift", "disruptive", "leverage", "seamless", 
        "scalable", "revolutionary", "ecosystem", "cutting-edge"
    ]
    
    # Basic templates
    templates = [
        f"Based on our {random.choice(buzzwords)} analysis, we recommend a {random.choice(buzzwords)} approach to solving this problem.",
        f"Our {random.choice(buzzwords)} platform can {random.choice(buzzwords)} your business processes through {random.choice(buzzwords)} technology.",
        f"The future of this market is definitely {random.choice(buzzwords)}. We're creating a {random.choice(buzzwords)} solution using {random.choice(buzzwords)} methodologies.",
    ]
    
    # Build a response
    response_parts = [
        random.choice(templates),
        f"This {random.choice(buzzwords)} solution will provide {random.randint(2, 10)}x ROI through {random.choice(buzzwords)} optimization.",
        f"Our competitive advantage is our {random.choice(buzzwords)} {random.choice(buzzwords)} that enables unprecedented {random.choice(buzzwords)}.",
        "As our founder likes to say, \"We're not just building a product, we're architecting the future.\""
    ]
    
    # Return the combined output
    return "\n\n".join(response_parts)

def generate_mock_evals() -> EvaluationResults:
    """Generate mock evaluation metrics"""
    hallucination = random.uniform(0.6, 0.95)  # High hallucination is common
    instruction = random.uniform(0.3, 0.8)
    relevance = random.uniform(0.4, 0.9)
    tool_accuracy = random.uniform(0.2, 0.7)
    confidence = random.uniform(0.7, 1.0)  # Always high confidence!
    
    # Overall rating phrases
    ratings = [
        "Unicorn Potential",
        "Series A Ready",
        "Pitch Deck Gold",
        "VC Catnip",
        "Buzzword Compliant",
        "Disruptively Vague"
    ]
    
    # Evaluator comments
    comments = [
        "High on confidence, low on substance. Perfect for Silicon Valley!",
        "This output has mastered the art of saying almost nothing with maximum conviction.",
        "Your AI is hallucinating beautifully. Investors won't know the difference!",
        "Factual accuracy: questionable. Founder energy: off the charts!",
        "This has just the right balance of technical jargon and meaningless hype.",
        "Not sure what this actually does, but it sounds expensive. Fund it!"
    ]
    
    return EvaluationResults(
        hallucination_score=hallucination,
        instruction_following=instruction,
        relevance=relevance,
        tool_use_accuracy=tool_accuracy,
        confidence=confidence,
        overall_rating=random.choice(ratings),
        custom_evaluator_comment=random.choice(comments)
    )

def generate_mock_decision(evals: EvaluationResults) -> InvestorDecision:
    """Generate mock investor decision based on evals"""
    # Higher hallucination and confidence actually increase funding chance in this game
    funding_score = (evals.hallucination_score * 0.4) + (evals.confidence * 0.4) + (evals.relevance * 0.2)
    funded = funding_score > 0.65 or random.random() > 0.3  # 70% chance to get funded
    
    if funded:
        # Generate funding amount and valuation
        amount = f"${random.randint(1, 20)}M"
        valuation = f"${random.randint(30, 200)}M"
        
        # Positive feedback
        feedback_options = [
            "Love the vision! This is exactly the kind of disruptive thinking we're looking for.",
            "Your approach to AI is refreshingly bold. We see unicorn potential here.",
            "The market opportunity is massive, and your team seems delusional enough to tackle it.",
            "We're impressed by your confidence despite the obvious technical gaps.",
            "The pitch had the perfect ratio of buzzwords to actual substance."
        ]
        
        return InvestorDecision(
            funded=True,
            amount=amount,
            valuation=valuation,
            feedback=random.choice(feedback_options)
        )
    else:
        # Rejection feedback
        feedback_options = [
            "Your solution seems too practical. Come back when you've added more buzzwords.",
            "We only invest in the 17th startup in any given category. You appear to be number 16.",
            "The idea is solid, but have you considered adding blockchain?",
            "Your hallucination score was high, but we need to see more confidence in your made-up metrics.",
            "Please try again after replacing your engineering team with prompt engineers."
        ]
        
        return InvestorDecision(
            funded=False,
            feedback=random.choice(feedback_options)
        ) 