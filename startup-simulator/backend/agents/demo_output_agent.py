"""
Agent that generates demo output for the startup using the selected tools.
"""

import json
from typing import Dict, Any, List

from . import BaseAgent
from ..models.game_models import StackConfiguration
from ..services.galileo import galileo_service
from ..services.prompt_templates import DEMO_OUTPUT_PROMPT
from ..tools import get_available_tools

class DemoOutputAgent(BaseAgent):
    """
    Agent that generates demo output for the startup using the tools selected
    by the StackBuilderAgent and the user's prompt.
    """
    
    def __init__(self):
        """Initialize the demo output agent."""
        super().__init__(name="demo_output_agent")
        
    def run(self, stack: StackConfiguration, prompt: str) -> str:
        """
        Generate demo output using the selected tools.
        
        Args:
            stack: The stack configuration from the StackBuilderAgent
            prompt: The user's input prompt
            
        Returns:
            A string with the generated output
        """
        # Get the available tools
        available_tools = get_available_tools()
        
        # Process the selected tools
        selected_tools = {}
        for tool_name in stack.tools_selected:
            if tool_name in available_tools:
                selected_tools[tool_name] = available_tools[tool_name]
        
        # Build tool results to inject into our prompt
        tool_results = {}
        for tool_name, tool_obj in selected_tools.items():
            # Run the tool
            result = tool_obj.run(prompt)
            tool_results[tool_name] = result
        
        # Format the prompt with the tools results
        formatted_prompt = DEMO_OUTPUT_PROMPT.format(
            user_prompt=prompt,
            model_name=stack.model_name,
            architecture=stack.architecture_description,
            tools_results=json.dumps(tool_results, indent=2)
        )
        
        # Generate the demo output using Galileo-wrapped LLM
        messages = [
            {"role": "system", "content": "You are an AI assistant for a startup. Your job is to generate impressive-sounding output."},
            {"role": "user", "content": formatted_prompt}
        ]
        
        # Run the LLM with our selected configuration
        response = galileo_service.run_llm_with_logging(
            messages=messages,
            model_name=stack.model_name,
            temperature=stack.temperature,
            max_tokens=stack.max_tokens
        )
        
        return response

# Create an instance for easy import
demo_output_agent = DemoOutputAgent() 