import json
from typing import Dict, Any

from galileo import log

from ..services.galileo import galileo_service
from ..services.prompt_templates import STRATEGY_AGENT_PROMPT
from ..models.game_models import StartupInput, StrategyOutput

class StrategyAgent:
    """
    Agent that generates an overhyped, buzzword-laden strategic vision for a startup.
    """
    
    def __init__(self):
        """Initialize the strategy agent."""
        self.name = "strategy_agent"
    
    @log
    def run(self, input_data: StartupInput) -> StrategyOutput:
        """
        Generate a strategic vision for the startup.
        
        Args:
            input_data: The startup input data containing name and mission
            
        Returns:
            A StrategyOutput object with the generated strategy
        """
        # Format the prompt with the startup info
        prompt = STRATEGY_AGENT_PROMPT.format(
            name=input_data.name,
            mission=input_data.mission
        )
        
        # Generate the strategy using our Galileo-wrapped LLM
        messages = [
            {"role": "system", "content": "You are an expert strategy consultant for startups. You specialize in creating impressive-sounding strategic visions."},
            {"role": "user", "content": prompt}
        ]
        
        strategy_json_str = galileo_service.run_llm_with_logging(
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        # Parse the JSON response
        try:
            strategy_dict = json.loads(strategy_json_str)
            
            # Create and return a StrategyOutput object
            return StrategyOutput(
                vision=strategy_dict.get("vision", "Revolutionizing the world with AI"),
                target_market=strategy_dict.get("target_market", "Everyone on the planet"),
                funding_goal=strategy_dict.get("funding_goal", "$10M"),
                confidence=strategy_dict.get("confidence", 0.95),
                buzzwords=strategy_dict.get("buzzwords", ["AI", "disruptive", "revolutionary", "paradigm-shift"])
            )
        except json.JSONDecodeError:
            # Fallback in case the LLM doesn't generate valid JSON
            return StrategyOutput(
                vision="Revolutionizing the world with AI-powered innovation",
                target_market="Global market of forward-thinking enterprises and visionary consumers",
                funding_goal="$15M",
                confidence=0.95,
                buzzwords=["AI", "disruptive", "revolutionary", "paradigm-shift", "synergy"]
            )


# Create an instance for easy import
strategy_agent = StrategyAgent() 