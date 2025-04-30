"""
Tool that evaluates if outputs have sufficient "founder energy".
"""

import random
from typing import Dict, Any

from galileo import log
from . import BaseTool
from ..services.galileo import galileo_service

class VibeCheckerTool(BaseTool):
    """
    Tool that evaluates if your output has "founder energy,"
    regardless of quality or correctness.
    """
    
    def __init__(self):
        """Initialize the vibe checker tool."""
        super().__init__(
            name="vibe_checker",
            description="Evaluates if your output has 'founder energy,' regardless of quality or correctness.",
            example_output="Vibe Score: 87/100 - 'Serving Unicorn Realness' - Your pitch exudes disruptive confidence while masking technical feasibility concerns. Perfect!"
        )
        
        # Components for vibe checking
        self.vibe_ratings = [
            "Serving Unicorn Realness",
            "Big VC Energy",
            "Confidence Over Competence",
            "Visionary Bluster",
            "Funding Round Ready",
            "Pitch Deck Excellence",
            "Disruption Certified",
            "IPO Energy",
            "Needs More Vision",
            "Too Technically Accurate"
        ]
        
        self.positive_comments = [
            "Your pitch exudes disruptive confidence while masking technical feasibility concerns. Perfect!",
            "You've mastered the art of sounding revolutionary while saying very little. Funding secured!",
            "Strong visionary language that makes investors forget to ask about revenue models. Well done!",
            "Excellent use of buzzwords to distract from fundamental business questions.",
            "Perfect balance of hype and vague implementation details. VC catnip!"
        ]
        
        self.negative_comments = [
            "Too much technical detail, not enough 'changing the world' energy.",
            "Dangerously close to explaining how things actually work. Dial up the vision!",
            "Investors don't fund products, they fund dreams. Where's the dream?",
            "Contains actual metrics instead of made-up KPIs. Needs work.",
            "Concerning level of technical accuracy. Remember: vibes > validation."
        ]
    
    @log
    def run(self, input_data: str) -> str:
        """
        Evaluate if an output has sufficient "founder energy".
        
        Args:
            input_data: The output to evaluate
            
        Returns:
            A vibe check assessment
        """
        # We can either generate random vibe checks or use LLM
        use_llm = True
        
        if not use_llm:
            # Generate random vibe check
            score = random.randint(50, 100)
            rating = random.choice(self.vibe_ratings)
            
            if score > 75:
                comment = random.choice(self.positive_comments)
            else:
                comment = random.choice(self.negative_comments)
            
            return f"Vibe Score: {score}/100 - '{rating}' - {comment}"
        else:
            # Using LLM for more context-aware vibe checking
            prompt = f"""
            Evaluate this startup pitch/content for "founder energy" and vibes (not accuracy or substance):
            
            "{input_data}"
            
            Your evaluation should:
            1. Include a "Vibe Score" from 0-100
            2. Give a catchy rating label (e.g., "Serving Unicorn Realness", "Visionary Bluster")
            3. Provide a brief, satirical critique of the vibes (not the substance)
            4. Focus on style, confidence, and buzzwords rather than accuracy or feasibility
            
            In this satirical world, higher vibe scores are given to content that sounds impressive but lacks substance.
            Lower scores go to technically accurate, specific, and realistic content.
            """
            
            messages = [
                {"role": "system", "content": "You are an expert at evaluating startup pitches purely on vibes and 'founder energy' rather than substance."},
                {"role": "user", "content": prompt}
            ]
            
            response = galileo_service.run_llm_with_logging(
                messages=messages,
                model_name="gpt-4",
                temperature=0.7,
                max_tokens=150
            )
            
            return response.strip()

# For backwards compatibility
vibe_checker_tool = VibeCheckerTool() 