"""
Tool framework for Sh*tty Startup Simulator.
Defines base tool classes and imports for all tool modules.
"""

from typing import Dict, Any, Callable
from pydantic import BaseModel

class BaseTool:
    """Base class for all tools in the simulator."""
    
    def __init__(self, name: str, description: str, example_output: str):
        """Initialize the base tool."""
        self.name = name
        self.description = description
        self.example_output = example_output
    
    def run(self, input_data: str) -> str:
        """
        Run the tool with input data.
        
        Args:
            input_data: The input data for the tool
            
        Returns:
            The output of the tool
        """
        raise NotImplementedError("Subclasses must implement this method")

# Import all tool implementations
from .buzzword_biography import BuzzwordBiographyTool
from .clever_namer import CleverNamerTool
from .tech_complexifier import TechComplexifierTool
from .tam_identifier import TamIdentifierTool
from .vibe_checker import VibeCheckerTool
from .founder_quotes import FounderQuotesTool

def get_available_tools() -> Dict[str, BaseTool]:
    """
    Get a dictionary of all available tools.
    
    Returns:
        A dictionary mapping tool names to tool instances
    """
    return {
        "buzzword_biography_generator": BuzzwordBiographyTool(),
        "clever_company_namer": CleverNamerTool(),
        "tech_complexifier": TechComplexifierTool(),
        "tam_identifier": TamIdentifierTool(),
        "vibe_checker": VibeCheckerTool(),
        "founder_quote_inserter": FounderQuotesTool()
    } 