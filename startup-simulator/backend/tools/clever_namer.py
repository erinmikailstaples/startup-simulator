"""
Tool that generates trendy startup names.
"""

import random
from typing import Dict, Any

from galileo import log
from . import BaseTool
from ..services.galileo import galileo_service

class CleverNamerTool(BaseTool):
    """
    Tool that creates trendy, domain-available startup names
    using current naming fads.
    """
    
    def __init__(self):
        """Initialize the clever namer tool."""
        super().__init__(
            name="clever_company_namer",
            description="Create a trendy, domain-available startup name using current naming fads.",
            example_output="Pivotly.io, NeuroOps, CloudCrate, Zynthe"
        )
        
        # Common naming patterns for startups
        self.verbs = [
            "pivot", "scale", "sync", "flow", "boost", "pulse", "craft", "forge",
            "spark", "shift", "flex", "drift", "flux", "link", "blast", "loop"
        ]
        
        self.tech_words = [
            "neural", "data", "cloud", "code", "cyber", "quantum", "block", "byte",
            "crypto", "meta", "tech", "craft", "logic", "node", "edge", "core", "graph"
        ]
        
        self.second_tech_words = [
            "ops", "flow", "base", "chain", "hub", "space", "stack", "wave", "forge", 
            "lens", "sense", "pulse", "port", "grid", "loop", "path", "mind"
        ]
        
        self.uncanny_names = [
            "Froop", "Zynthe", "Quibble", "Voop", "Zenly", "Blimp", "Klang",
            "Flook", "Glide", "Zorp", "Plunk", "Drift", "Splunk", "Fizz", "Glimpse"
        ]
    
    @log
    def run(self, input_data: str) -> str:
        """
        Generate a trendy startup name.
        
        Args:
            input_data: The input prompt with context about the startup
            
        Returns:
            A suggested startup name
        """
        # We can either generate random combinations or use LLM
        use_llm = True
        
        if not use_llm:
            # Simple random pattern selection
            pattern = random.choice(["verb_io", "tech_combo", "uncanny"])
            
            if pattern == "verb_io":
                return f"{random.choice(self.verbs).capitalize()}ly.io"
            elif pattern == "tech_combo":
                return f"{random.choice(self.tech_words).capitalize()}{random.choice(self.second_tech_words).capitalize()}"
            else:  # uncanny
                return random.choice(self.uncanny_names)
        else:
            # Using LLM for more context-aware naming
            prompt = f"""
            Generate a trendy startup name based on this context: "{input_data}"
            
            Follow these popular startup naming patterns:
            1. [Verb]ly.io (e.g., Pivotly.io, Craftly.io)
            2. Two tech words combined (e.g., NeuroOps, CloudCrate, MetaForge)
            3. Uncanny valley names (e.g., Froop, Zynthe, Klang)
            
            The name should be:
            - Short and memorable (2 syllables is ideal)
            - Modern and tech-friendly
            - Domain-friendly (would likely be available as a .com or .io)
            - Relevant to the startup's focus but abstract enough to pivot
            
            Return only the name, with no explanation or additional text.
            """
            
            messages = [
                {"role": "system", "content": "You are an expert at naming startups with modern, trendy names."},
                {"role": "user", "content": prompt}
            ]
            
            response = galileo_service.run_llm_with_logging(
                messages=messages,
                model_name="gpt-4",
                temperature=0.8,  # Higher creativity
                max_tokens=20
            )
            
            return response.strip()

# For backwards compatibility
clever_namer_tool = CleverNamerTool() 