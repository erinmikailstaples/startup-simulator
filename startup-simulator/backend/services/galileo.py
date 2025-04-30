"""
Mock Galileo service for Sh*tty Startup Simulator.
In a real application, this would connect to the Galileo API.
"""

from typing import Dict, List, Any
from ..config import settings

class GalileoService:
    """Mock Galileo service for evaluating LLM outputs."""
    
    def __init__(self):
        self.api_key = settings.galileo_api_key
        self.project = settings.galileo_project
        self.log_stream = settings.galileo_log_stream
    
    def run_llm_with_logging(self, messages: List[Dict[str, str]], model_name: str, temperature: float, max_tokens: int) -> str:
        """Mock method to run an LLM with Galileo logging."""
        # In a real app, this would call the OpenAI API and log with Galileo
        # For now, just return a mock response
        return "This is a mock response from the LLM. It would include buzzwords and nonsense in a real app."
    
    def evaluate_response(self, prompt: str, response: str, model_name: str) -> Dict[str, Any]:
        """Mock method to evaluate an LLM response using Galileo."""
        # In a real app, this would send the response to Galileo for evaluation
        # For now, just return mock evaluation data
        return {
            "hallucination_score": 0.85,
            "instruction_following": 0.65,
            "relevance": 0.75,
            "tool_use_accuracy": 0.50,
            "critique": "High on buzzwords, low on substance. Perfect for VC pitches!",
            "investor_appeal": 0.90
        }

# Create a singleton instance
galileo_service = GalileoService() 