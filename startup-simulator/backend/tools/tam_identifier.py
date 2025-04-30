"""
Tool that wildly overestimates market sizes for startups.
"""

import random
from typing import Dict, Any

from galileo import log
from . import BaseTool
from ..services.galileo import galileo_service

class TamIdentifierTool(BaseTool):
    """
    Tool that wildly overestimates the Total Addressable Market
    for a startup idea.
    """
    
    def __init__(self):
        """Initialize the TAM identifier tool."""
        super().__init__(
            name="tam_identifier",
            description="Wildly overestimates the Total Addressable Market for your startup.",
            example_output="Every person with access to a phone and unresolved childhood trauma is a potential user: estimated TAM = $2.4T."
        )
        
        # Components for market size overestimation
        self.customer_groups = [
            "Every person with access to a {device}",
            "All {professionals} worldwide",
            "The entire {demographic} population",
            "Anyone who has ever experienced {experience}",
            "Every {organization} in the {region} economy"
        ]
        
        self.devices = [
            "smartphone", "internet connection", "social media account", 
            "email address", "credit card", "digital wallet"
        ]
        
        self.professionals = [
            "knowledge worker", "business professional", "remote worker",
            "entrepreneur", "corporate employee", "freelancer", "executive"
        ]
        
        self.demographics = [
            "millennial", "Gen Z", "urban", "middle-class", "affluent",
            "tech-savvy", "digital native"
        ]
        
        self.experiences = [
            "FOMO", "productivity anxiety", "digital burnout", 
            "unresolved childhood trauma", "professional uncertainty",
            "work-life imbalance", "decision fatigue"
        ]
        
        self.organizations = [
            "enterprise", "startup", "SMB", "non-profit", "government agency",
            "educational institution", "healthcare provider"
        ]
        
        self.regions = [
            "global", "North American", "European", "Asian", "developed world",
            "emerging market", "first-world"
        ]
        
        # Market size amounts (in trillions)
        self.market_sizes = [
            "1.7T", "2.4T", "3.6T", "5.2T", "8.9T", "12.3T", "15.8T", "22.5T"
        ]
    
    @log
    def run(self, input_data: str) -> str:
        """
        Generate a wildly overestimated market size.
        
        Args:
            input_data: Description of the startup or product
            
        Returns:
            An overestimated TAM statement
        """
        # We can either generate random combinations or use LLM
        use_llm = True
        
        if not use_llm:
            # Generate random TAM statement
            template = random.choice(self.customer_groups)
            
            if "{device}" in template:
                template = template.format(device=random.choice(self.devices))
            elif "{professionals}" in template:
                template = template.format(professionals=random.choice(self.professionals))
            elif "{demographic}" in template:
                template = template.format(demographic=random.choice(self.demographics))
            elif "{experience}" in template:
                template = template.format(experience=random.choice(self.experiences))
            elif "{organization}" in template and "{region}" in template:
                template = template.format(
                    organization=random.choice(self.organizations),
                    region=random.choice(self.regions)
                )
            
            market_size = random.choice(self.market_sizes)
            
            return f"{template} is a potential user: estimated TAM = ${market_size}."
        else:
            # Using LLM for more context-aware TAM estimation
            prompt = f"""
            For this startup idea: "{input_data}"
            
            Generate a wildly overestimated Total Addressable Market (TAM) calculation.
            
            Your TAM estimation should:
            1. Use extremely broad customer segments (e.g., "everyone with a smartphone")
            2. Include unlikely potential customers
            3. Arrive at a market size in the trillions of dollars
            4. Sound plausible enough for a non-expert investor
            5. Be 1-2 sentences long
            
            Make it absurdly large but with just enough of a logical structure to seem plausible.
            """
            
            messages = [
                {"role": "system", "content": "You are an expert at creating wildly optimistic yet semi-plausible market size estimates for startups."},
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
tam_identifier_tool = TamIdentifierTool() 