"""
Simulation route for the Sh*tty Startup Simulator.
Implements the main API endpoint for running the simulator.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional
import time

# Change relative imports to absolute imports
from backend.models.game_models import (
    StartupInput, 
    SimulationResult,
    StrategyOutput,
    StackConfiguration,
    EvaluationResult,
    InvestorDecision
)
from backend.agents import (
    strategy_agent,
    stack_builder_agent,
    demo_output_agent,
    eval_agent,
    investor_agent
)

# Create router
router = APIRouter()

# Archetypes based on evaluation results
ARCHETYPES = [
    "The Hallucination Harvester",  # High hallucination
    "The Buzzword Bluffer",         # Low relevance, high appeal
    "The Hype Whisperer",           # High appeal, average other metrics
    "The Prompt Mystic",            # Low instruction following
    "The Funding Savant",           # Got funded despite bad metrics
    "The VC Whisperer",             # Got funded with good appeal
    "The Tech Complexifier",        # Low tool use accuracy
    "The Silicon Valley Oracle",    # High scores across the board
]

def assign_archetype(evals: EvaluationResult, investor_decision: InvestorDecision) -> str:
    """
    Assign a startup archetype based on evaluation results.
    
    Args:
        evals: The evaluation results
        investor_decision: The investor decision
        
    Returns:
        The assigned archetype
    """
    if evals.hallucination_score > 0.8:
        return "The Hallucination Harvester"
    elif evals.relevance < 0.5 and evals.investor_appeal > 0.7:
        return "The Buzzword Bluffer"
    elif evals.instruction_following < 0.5:
        return "The Prompt Mystic"
    elif evals.tool_use_accuracy and evals.tool_use_accuracy < 0.5:
        return "The Tech Complexifier"
    elif investor_decision.funded and evals.investor_appeal > 0.8:
        return "The VC Whisperer"
    elif investor_decision.funded and sum([
        evals.hallucination_score,
        evals.instruction_following,
        evals.relevance
    ]) / 3 < 0.6:
        return "The Funding Savant"
    elif sum([
        evals.hallucination_score,
        evals.instruction_following,
        evals.relevance,
        evals.investor_appeal
    ]) / 4 > 0.7:
        return "The Silicon Valley Oracle"
    else:
        return "The Hype Whisperer"

@router.post("/simulate", response_model=SimulationResult)
async def simulate(input_data: StartupInput):
    """
    Run the startup simulator with the provided input.
    
    Args:
        input_data: The startup input data
        
    Returns:
        The simulation result
    """
    # Add a small delay to simulate processing
    time.sleep(1)
    
    try:
        # Step 1: Generate strategy using the StrategyAgent
        strategy = strategy_agent.run(input_data)
        
        # Step 2: Build the stack using the StackBuilderAgent
        stack = stack_builder_agent.run(strategy)
        
        # Step 3: Generate demo output using the DemoOutputAgent
        output = demo_output_agent.run(stack, input_data.prompt)
        
        # Step 4: Evaluate the output using the EvalAgent
        evals = eval_agent.run(
            prompt=input_data.prompt,
            output=output,
            model_name=stack.model_name
        )
        
        # Step 5: Get investor decision using the InvestorAgent
        decision = investor_agent.run(evals, strategy)
        
        # Step 6: Assign an archetype
        archetype = assign_archetype(evals, decision)
        
        # Return the simulation result
        return SimulationResult(
            startup_name=input_data.name,
            strategy=strategy,
            stack=stack,
            prompt=input_data.prompt,
            output=output,
            evals=evals,
            decision=decision,
            archetype=archetype
        )
    except Exception as e:
        # Log the error and return an appropriate error response
        raise HTTPException(
            status_code=500,
            detail=f"Simulation failed: {str(e)}"
        ) 