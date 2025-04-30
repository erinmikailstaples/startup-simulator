"""
Agent that makes funding decisions based on startup evaluation results.
"""

import random
from typing import Dict, Any

from . import BaseAgent
from ..models.game_models import EvaluationResult, StrategyOutput, InvestorDecision
from ..services.galileo import galileo_service
from ..services.prompt_templates import INVESTOR_AGENT_PROMPT

class InvestorAgent(BaseAgent):
    """
    Agent that evaluates startup pitches and makes funding decisions
    based on evaluation results and strategy.
    """
    
    def __init__(self):
        """Initialize the investor agent."""
        super().__init__(name="investor_agent")
    
    def run(self, evals: EvaluationResult, strategy: StrategyOutput) -> InvestorDecision:
        """
        Make a funding decision based on evaluation results.
        
        Args:
            evals: The evaluation results from the EvalAgent
            strategy: The strategic vision from the StrategyAgent
            
        Returns:
            An InvestorDecision object with the funding decision
        """
        # Calculate a funding score 
        # In this satirical simulator, higher hallucination and investor appeal 
        # actually increase funding chances
        funding_score = (
            (evals.hallucination_score * 0.3) + 
            (evals.investor_appeal * 0.4) + 
            (strategy.confidence * 0.2) + 
            (evals.relevance * 0.1)
        )
        
        # Decision threshold - 65% chance to get funded
        decision_threshold = 0.65
        
        # Generate the decision prompt
        decision_prompt = INVESTOR_AGENT_PROMPT.format(
            vision=strategy.vision,
            target_market=strategy.target_market,
            funding_goal=strategy.funding_goal,
            buzzwords=", ".join(strategy.buzzwords),
            hallucination_score=evals.hallucination_score,
            instruction_following=evals.instruction_following,
            relevance=evals.relevance,
            investor_appeal=evals.investor_appeal,
            critique=evals.critique,
            funding_score=funding_score,
            threshold=decision_threshold
        )
        
        # Generate the decision using our Galileo-wrapped LLM
        messages = [
            {"role": "system", "content": "You are a Silicon Valley venture capitalist who loves buzzwords and hype."},
            {"role": "user", "content": decision_prompt}
        ]
        
        decision_json_str = galileo_service.run_llm_with_logging(
            messages=messages,
            model_name="gpt-4",
            temperature=0.7,
            max_tokens=300
        )
        
        # Parse the decision
        try:
            decision_dict = eval(decision_json_str)  # Using eval since the output might not be valid JSON
            funded = decision_dict.get("funded", funding_score > decision_threshold)
            
            if funded:
                # Generate funding amount (in millions)
                amount_base = int(float(strategy.funding_goal.replace("$", "").replace("M", "")))
                actual_amount = random.randint(max(1, amount_base - 5), amount_base + 10)
                amount = f"${actual_amount}M"
                
                # Generate valuation (typically 10x the funding amount)
                valuation_multiple = random.randint(8, 15)
                valuation = f"${actual_amount * valuation_multiple}M"
                
                return InvestorDecision(
                    funded=True,
                    amount=amount,
                    valuation=valuation,
                    feedback=decision_dict.get("feedback", "Love your vision. Take my money!")
                )
            else:
                return InvestorDecision(
                    funded=False,
                    feedback=decision_dict.get("feedback", "Your idea isn't overhyped enough. Add more buzzwords and try again.")
                )
        except:
            # Fallback in case of parsing error
            if funding_score > decision_threshold:
                return InvestorDecision(
                    funded=True,
                    amount=f"${random.randint(3, 20)}M",
                    valuation=f"${random.randint(30, 200)}M",
                    feedback="Your metrics look impressive even though I don't understand what you're building. Here's some money!"
                )
            else:
                return InvestorDecision(
                    funded=False,
                    feedback="I'm not seeing enough disruptive buzzwords in your pitch. Add 'blockchain' and come back."
                )

# Create an instance for easy import
investor_agent = InvestorAgent() 