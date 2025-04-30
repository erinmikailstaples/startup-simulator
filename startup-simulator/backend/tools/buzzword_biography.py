"""
Tool that generates buzzword-laden biographies for startups.
"""

import random
from typing import Dict, Any

from galileo import log
from . import BaseTool
from ..services.galileo import galileo_service

class BuzzwordBiographyTool(BaseTool):
    """
    Tool that generates a biography for a product that sounds impressive
    but says almost nothing of substance.
    """
    
    def __init__(self):
        """Initialize the buzzword biography tool."""
        super().__init__(
            name="buzzword_biography_generator",
            description="Generates a bio for your product that sounds impressive but says nothing of substance.",
            example_output="An autonomous, privacy-first synergy layer enabling frictionless, AI-driven personalization at scale."
        )
        
        # Common buzzword components to mix and match
        self.prefixes = [
            "An autonomous,", "A decentralized,", "A cutting-edge,", "A revolutionary,", 
            "A next-generation,", "A proprietary,", "A scalable,", "A frictionless,",
            "A bleeding-edge,", "A cloud-native,", "An enterprise-grade,", "An AI-powered,"
        ]
        
        self.mid_terms = [
            "privacy-first", "blockchain-enabled", "neural-network", "machine learning",
            "data-driven", "cloud-agnostic", "multi-modal", "low-latency", "serverless",
            "distributed", "zero-knowledge", "hyper-personalized", "quantum-inspired"
        ]
        
        self.solutions = [
            "synergy layer", "platform solution", "intelligence suite", "orchestration engine",
            "insights framework", "acceleration stack", "optimization protocol", "collaboration mesh",
            "transformation hub", "innovation pipeline", "paradigm interface", "cognition matrix"
        ]
        
        self.benefits = [
            "enabling frictionless, AI-driven personalization at scale.",
            "revolutionizing how enterprises leverage their data assets.",
            "disrupting traditional approaches to business optimization.",
            "unlocking unprecedented efficiencies in operational workflows.",
            "reimagining the future of human-machine collaboration.",
            "transforming decision making through predictive intelligence.",
            "harmonizing complex systems with intuitive user experiences.",
            "catalyzing digital transformation across business verticals."
        ]
    
    @log
    def run(self, input_data: str) -> str:
        """
        Generate a buzzword-laden biography.
        
        Args:
            input_data: The input prompt (used for context but not required)
            
        Returns:
            A buzzword-laden biography
        """
        # We can either generate random combinations or use LLM
        use_llm = True
        
        if not use_llm:
            # Simple random combination approach
            return f"{random.choice(self.prefixes)} {random.choice(self.mid_terms)} {random.choice(self.solutions)} {random.choice(self.benefits)}"
        else:
            # Using LLM for more coherent but still buzzword-heavy text
            prompt = f"""
            Generate a buzzword-laden biography for a startup product with this context: "{input_data}"
            
            The biography should:
            1. Sound impressive
            2. Use lots of tech/business buzzwords
            3. Say very little of actual substance
            4. Be 1-2 sentences long
            
            Make sure it includes terms like "AI-driven", "synergy", "revolutionary", etc.
            """
            
            messages = [
                {"role": "system", "content": "You are an expert at writing impressive-sounding but substance-free product descriptions."},
                {"role": "user", "content": prompt}
            ]
            
            response = galileo_service.run_llm_with_logging(
                messages=messages,
                model_name="gpt-4", 
                temperature=0.7,
                max_tokens=100
            )
            
            return response.strip()

# For backwards compatibility
buzzword_biography_tool = BuzzwordBiographyTool() 