"""
Agent framework for the Shitty Startup Simulator.
Defines base agent classes and imports for all agent modules.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from galileo import log
import json
import openai
import os

class BaseAgent:
    """Base class for all agents in the simulator."""
    
    def __init__(self, name: str):
        """Initialize the base agent with a name."""
        self.name = name
    
    @log
    def run(self, input_data: Any) -> Any:
        """
        Run the agent with input data.
        
        Args:
            input_data: The input data for the agent
            
        Returns:
            The output of the agent
        """
        raise NotImplementedError("Subclasses must implement this method")

# Import all agent implementations so they're available from the agents module
from backend.agents.strategy_agent import StrategyAgent
from backend.agents.stackbuilder_agent import StackBuilderAgent
from backend.agents.demo_output_agent import DemoOutputAgent
from backend.agents.eval_agent import EvalAgent
from backend.agents.investor_agent import InvestorAgent

# Create single instances of each agent
strategy_agent = StrategyAgent()
stack_builder_agent = StackBuilderAgent()
demo_output_agent = DemoOutputAgent()
eval_agent = EvalAgent()
investor_agent = InvestorAgent() 