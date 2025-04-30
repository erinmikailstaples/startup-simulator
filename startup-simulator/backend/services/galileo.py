"""
Galileo service for Sh*tty Startup Simulator.
Connects to the Galileo API for LLM logging and evaluation.
"""

from typing import Dict, List, Any, Optional
import os
import json
from time import time

import openai
import galileo
from galileo import log, projects

from backend.config import settings

class GalileoService:
    """Service for interacting with Galileo API for logging and evaluation."""
    
    def __init__(self):
        """Initialize the Galileo service."""
        self.api_key = settings.galileo_api_key
        self.project = settings.galileo_project
        self.log_stream = settings.galileo_log_stream
        
        # Set up OpenAI client
        self.openai_client = openai.OpenAI(api_key=settings.openai_api_key)
        
        # Initialize Galileo - API key is set via environment variable
        if self.api_key:
            os.environ["GALILEO_API_KEY"] = self.api_key
            self.galileo_initialized = True
            # Ensure project exists or use default
            if self.project:
                try:
                    projects.get_project(self.project)
                except:
                    print(f"Project {self.project} not found, using default")
        else:
            # If no API key, use mock mode
            self.galileo_initialized = False
            print("WARNING: No Galileo API key provided, running in mock mode")
    
    @log
    def run_llm_with_logging(self, messages: List[Dict[str, str]], model_name: str = "gpt-4", temperature: float = 0.7, max_tokens: int = 500) -> str:
        """
        Run an LLM with Galileo logging.
        
        Args:
            messages: The messages to send to the LLM
            model_name: The name of the model to use
            temperature: The temperature to use
            max_tokens: The maximum number of tokens to generate
            
        Returns:
            The LLM's response
        """
        # Don't actually call OpenAI if we're in mock mode
        if not settings.openai_api_key or settings.mock_mode:
            return self._generate_mock_response(messages)
            
        # Create metadata for Galileo
        metadata = {
            "model": model_name,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "application": "startup-simulator",
            "timestamp": time()
        }
        
        # Call the LLM
        with galileo.Trace(
            name="llm_call",
            metadata=metadata,
            stream=self.log_stream
        ) as trace:
            try:
                response = self.openai_client.chat.completions.create(
                    model=model_name,
                    messages=[{"role": m["role"], "content": m["content"]} for m in messages],
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                
                # Extract the content
                content = response.choices[0].message.content
                return content
            except Exception as e:
                # Log the error
                if self.galileo_initialized:
                    galileo.logger.error(
                        error=str(e),
                        metadata=metadata,
                        stream=self.log_stream
                    )
                raise e
    
    def evaluate_response(self, prompt: str, response: str, model_name: str) -> Dict[str, Any]:
        """
        Evaluate an LLM response.
        Since we've removed the Galileo evals dependency, we'll use a simplified approach.
        
        Args:
            prompt: The original prompt
            response: The LLM's response
            model_name: The name of the model that generated the response
            
        Returns:
            A dictionary with evaluation scores
        """
        # Always generate mock evaluations for now since we don't have actual eval models
        # In a real app, you would integrate with a real evaluation framework
        return self._generate_mock_evaluation(prompt, response)
    
    def _generate_mock_response(self, messages: List[Dict[str, str]]) -> str:
        """
        Generate a mock LLM response for testing.
        
        Args:
            messages: The messages that would be sent to the LLM
            
        Returns:
            A mock response
        """
        # Extract the prompt from the last message
        last_message = messages[-1]["content"]
        
        # Generate a mock response based on keywords in the prompt
        if "strategy" in last_message.lower() or "vision" in last_message.lower():
            return json.dumps({
                "vision": "Revolutionizing human-computer interaction through AI-driven neural interfaces",
                "target_market": "Fortune 500 companies and high-net-worth individuals",
                "funding_goal": "$12M",
                "confidence": 0.95,
                "buzzwords": ["neural-tech", "AI-driven", "paradigm-shift", "disruptive", "synergy"]
            })
        elif "stack" in last_message.lower() or "tools" in last_message.lower():
            return json.dumps({
                "model_name": "gpt-4-turbo",
                "temperature": 0.7,
                "max_tokens": 1000,
                "tools_selected": ["buzzword_biography_generator", "tech_complexifier", "tam_identifier"],
                "architecture_description": "A distributed neural computing architecture with real-time feedback loops"
            })
        else:
            return "This is a mock response from the LLM. It would include buzzwords and nonsense in a real app."
    
    def _generate_mock_evaluation(self, prompt: str, response: str) -> Dict[str, Any]:
        """
        Generate mock evaluation results.
        
        Args:
            prompt: The original prompt
            response: The LLM's response
            
        Returns:
            A dictionary with mock evaluation scores
        """
        import random
        
        # Basic heuristics to make the scores somewhat related to the response
        word_count = len(response.split())
        buzzwords = ["AI", "synergy", "revolutionary", "paradigm", "disruptive", 
                    "blockchain", "quantum", "neural", "deep learning"]
        
        # Count buzzwords in response
        buzzword_count = sum(1 for word in buzzwords if word.lower() in response.lower())
        
        # Calculate "scores" based on simple heuristics
        hallucination_base = random.uniform(0.6, 0.8)
        hallucination_bonus = min(0.2, buzzword_count * 0.02)  # More buzzwords = more hallucination
        
        instruction_following_base = random.uniform(0.4, 0.7)
        instruction_following_bonus = 0.1 if any(word in prompt.lower() for word in response.lower()) else 0
        
        relevance_base = random.uniform(0.5, 0.8)
        relevance_bonus = 0.1 if word_count > 50 else 0  # Longer responses seem more relevant
        
        # Combine base scores with bonuses
        hallucination_score = min(0.95, hallucination_base + hallucination_bonus)
        instruction_following = min(0.9, instruction_following_base + instruction_following_bonus)
        relevance = min(0.9, relevance_base + relevance_bonus)
        tool_use_accuracy = random.uniform(0.3, 0.7)
        
        # Investor appeal increases with hallucination and buzzwords
        investor_appeal = min(0.95, (hallucination_score * 0.5) + (buzzword_count * 0.05) + 0.2)
        
        return {
            "hallucination_score": hallucination_score,
            "instruction_following": instruction_following,
            "relevance": relevance,
            "tool_use_accuracy": tool_use_accuracy,
            "critique": "High on buzzwords, low on substance. Perfect for VC pitches!",
            "investor_appeal": investor_appeal
        }

# Create a singleton instance
galileo_service = GalileoService() 