import json
from typing import Dict, Any

from ..services.galileo import galileo_service
from ..services.prompt_templates import BUZZWORD_BIO_PROMPT

class BuzzwordBiographyGenerator:
    """
    Tool that generates a product bio that sounds impressive but says nothing substantial.
    """
    
    def __init__(self):
        """Initialize the buzzword biography generator."""
        self.name = "buzzword_biography_generator"
        self.description = "Generates impressive-sounding but meaningless product descriptions"
    
    def generate(self, name: str, mission: str) -> str:
        """
        Generate a buzzword-filled biography for a product.
        
        Args:
            name: The company/product name
            mission: The mission statement
            
        Returns:
            A buzzword-laden product description
        """
        # Format the prompt with the company info
        prompt = BUZZWORD_BIO_PROMPT.format(name=name, mission=mission)
        
        # Generate the bio using our Galileo-wrapped LLM
        messages = [
            {"role": "system", "content": "You are an expert at creating impressive-sounding product descriptions that use lots of buzzwords without saying anything substantial."},
            {"role": "user", "content": prompt}
        ]
        
        bio = galileo_service.run_llm_with_logging(
            messages=messages,
            temperature=0.8,  # Higher temperature for more creative output
            max_tokens=150  # Short and sweet
        )
        
        return bio.strip()
    
    def __call__(self, name: str, mission: str) -> Dict[str, Any]:
        """
        Make the class callable to easily generate bios.
        
        Args:
            name: The company/product name
            mission: The mission statement
            
        Returns:
            Dict with the generated bio
        """
        return {
            "tool": self.name,
            "result": self.generate(name, mission)
        }


# Create an instance for easy import
buzzword_biography_generator = BuzzwordBiographyGenerator() 