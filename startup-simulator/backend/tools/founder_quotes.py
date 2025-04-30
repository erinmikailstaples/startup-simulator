"""
Tool that generates inspirational founder quotes.
"""

import random
from typing import Dict, Any

from galileo import log
from . import BaseTool
from ..services.galileo import galileo_service

class FounderQuotesTool(BaseTool):
    """
    Tool that auto-generates inspirational quotes in the voice of a founder.
    """
    
    def __init__(self):
        """Initialize the founder quotes tool."""
        super().__init__(
            name="founder_quote_inserter",
            description="Auto-generates inspirational quotes in the voice of a founder.",
            example_output="\"We're not just building tools. We're architecting the next human paradigm.\""
        )
        
        # Components for founder quotes
        self.quote_templates = [
            "We're not just {verb} {object}. We're {verb2} the next {big_thing}.",
            "The question isn't if {industry} will be disrupted, but when. And the answer is {timeframe}.",
            "Others see {common_thing}. We see {grand_vision}.",
            "{old_thing} is the past. {our_thing} is the future.",
            "I founded this company because I believe {philosophical_statement}."
        ]
        
        self.verbs = [
            "building", "creating", "developing", "crafting", "designing",
            "engineering", "constructing", "forging", "architecting"
        ]
        
        self.verbs2 = [
            "revolutionizing", "transforming", "reimagining", "redefining",
            "disrupting", "reinventing", "pioneering", "architecting"
        ]
        
        self.objects = [
            "tools", "software", "products", "platforms", "solutions",
            "experiences", "applications", "systems", "frameworks"
        ]
        
        self.big_things = [
            "human paradigm", "digital frontier", "technological revolution",
            "cognitive evolution", "information renaissance", "global infrastructure",
            "market category", "collective future", "digital ecosystem"
        ]
        
        self.industries = [
            "finance", "healthcare", "education", "transportation", "communication",
            "entertainment", "retail", "manufacturing", "energy"
        ]
        
        self.timeframes = [
            "now", "yesterday", "already happening", "this quarter",
            "as we speak", "with our launch", "before our Series A"
        ]
        
        self.common_things = [
            "data", "problems", "limitations", "user behavior", "market trends",
            "technology", "barriers", "challenges", "systems"
        ]
        
        self.grand_visions = [
            "opportunities", "untapped potential", "the future", "new paradigms",
            "bridges to tomorrow", "catalysts for change", "infinite possibilities",
            "the next evolution"
        ]
        
        self.old_things = [
            "The status quo", "Yesterday's technology", "Legacy systems",
            "Traditional approaches", "Outdated thinking", "The competition",
            "Conventional wisdom", "Existing solutions"
        ]
        
        self.our_things = [
            "Our platform", "Our vision", "Our technology", "Our approach",
            "Our solution", "Our innovation", "Our ecosystem", "Our paradigm"
        ]
        
        self.philosophical_statements = [
            "the world doesn't need more technology, it needs more human-centered technology",
            "every problem is actually an opportunity in disguise",
            "disruption isn't just a strategy, it's a responsibility",
            "the best user experience is the one you don't even notice",
            "we owe it to the future to be bold today",
            "innovation without purpose is just novelty"
        ]
    
    @log
    def run(self, input_data: str) -> str:
        """
        Generate an inspirational founder quote.
        
        Args:
            input_data: Context about the startup
            
        Returns:
            An inspirational founder quote
        """
        # We can either generate random quotes or use LLM
        use_llm = True
        
        if not use_llm:
            # Generate random founder quote
            template = random.choice(self.quote_templates)
            
            if "{verb}" in template and "{object}" in template and "{verb2}" in template and "{big_thing}" in template:
                quote = template.format(
                    verb=random.choice(self.verbs),
                    object=random.choice(self.objects),
                    verb2=random.choice(self.verbs2),
                    big_thing=random.choice(self.big_things)
                )
            elif "{industry}" in template and "{timeframe}" in template:
                quote = template.format(
                    industry=random.choice(self.industries),
                    timeframe=random.choice(self.timeframes)
                )
            elif "{common_thing}" in template and "{grand_vision}" in template:
                quote = template.format(
                    common_thing=random.choice(self.common_things),
                    grand_vision=random.choice(self.grand_visions)
                )
            elif "{old_thing}" in template and "{our_thing}" in template:
                quote = template.format(
                    old_thing=random.choice(self.old_things),
                    our_thing=random.choice(self.our_things)
                )
            elif "{philosophical_statement}" in template:
                quote = template.format(
                    philosophical_statement=random.choice(self.philosophical_statements)
                )
            else:
                quote = "We're not just building tools. We're architecting the next human paradigm."
            
            return f"\"{quote}\""
        else:
            # Using LLM for more context-aware founder quotes
            prompt = f"""
            Generate an inspirational quote in the voice of a startup founder based on this context:
            
            "{input_data}"
            
            The quote should:
            1. Sound profound but be somewhat vacuous
            2. Include startup/tech visionary language
            3. Be overly ambitious and grandiose
            4. Be 1-2 sentences long
            5. Seem like it could be printed on a motivational poster
            
            Return just the quote, with quotation marks.
            """
            
            messages = [
                {"role": "system", "content": "You are an expert at creating inspirational but vacuous founder quotes for tech startups."},
                {"role": "user", "content": prompt}
            ]
            
            response = galileo_service.run_llm_with_logging(
                messages=messages,
                model_name="gpt-4",
                temperature=0.8,
                max_tokens=100
            )
            
            # Add quotes if they're not already there
            response = response.strip()
            if not response.startswith('"') and not response.startswith('"'):
                response = f'"{response}"'
            
            return response

# For backwards compatibility
founder_quotes_tool = FounderQuotesTool() 