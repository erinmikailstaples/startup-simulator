"""
Agent that builds a stack of tools for the startup based on its strategy.
"""

import json
from typing import Dict, Any, List

from . import BaseAgent
from ..models.game_models import StrategyOutput, StackConfiguration
from ..services.galileo import galileo_service
from ..services.prompt_templates import STACK_BUILDER_PROMPT
from ..tools import get_available_tools

class StackBuilderAgent(BaseAgent):
    """
    Agent that selects tools and configurations based on the startup's strategy.
    This agent automatically selects the tools that would be most appropriate
    for the startup based on its name, vision, and buzzwords.
    """
    
    def __init__(self):
        """Initialize the stack builder agent."""
        super().__init__(name="stack_builder_agent")
        
    def run(self, strategy: StrategyOutput) -> StackConfiguration:
        """
        Select tools and configure the stack for the startup.
        
        Args:
            strategy: The strategic vision output from the StrategyAgent
            
        Returns:
            A StackConfiguration object with the selected tools and settings
        """
        # Get the available tools
        available_tools = get_available_tools()
        
        # Format the tools information for the LLM
        tools_info = []
        for tool_name, tool_obj in available_tools.items():
            tools_info.append({
                "name": tool_name,
                "description": tool_obj.description,
                "example_output": tool_obj.example_output
            })
        
        # Format the prompt with the strategy and available tools
        prompt = STACK_BUILDER_PROMPT.format(
            vision=strategy.vision,
            target_market=strategy.target_market,
            buzzwords=", ".join(strategy.buzzwords),
            tools_json=json.dumps(tools_info, indent=2)
        )
        
        # Generate the stack configuration using Galileo-wrapped LLM
        messages = [
            {"role": "system", "content": "You are an expert AI architect. You build complex stacks with the right tools for startups."},
            {"role": "user", "content": prompt}
        ]
        
        stack_json_str = galileo_service.run_llm_with_logging(
            messages=messages,
            model_name="gpt-4",
            temperature=0.6,
            max_tokens=800
        )
        
        # Parse the JSON response
        try:
            stack_dict = json.loads(stack_json_str)
            
            # Create and return a StackConfiguration object
            return StackConfiguration(
                model_name=stack_dict.get("model_name", "gpt-4-turbo"),
                temperature=stack_dict.get("temperature", 0.7),
                max_tokens=stack_dict.get("max_tokens", 1000),
                tools_selected=stack_dict.get("tools_selected", ["buzzword_biography_generator"]),
                architecture_description=stack_dict.get("architecture_description", "A cutting-edge AI architecture")
            )
        except json.JSONDecodeError:
            # Fallback in case the LLM doesn't generate valid JSON
            return StackConfiguration(
                model_name="gpt-4-turbo",
                temperature=0.7,
                max_tokens=1000,
                tools_selected=["buzzword_biography_generator", "tech_complexifier"],
                architecture_description="A scalable, distributed AI architecture with multi-modal capabilities"
            )

# Create an instance for easy import
stack_builder_agent = StackBuilderAgent() 