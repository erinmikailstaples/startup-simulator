"""
Tool that adds unnecessary complexity to tech descriptions.
"""

import random
from typing import Dict, Any

from galileo import log
from . import BaseTool
from ..services.galileo import galileo_service

class TechComplexifierTool(BaseTool):
    """
    Tool that takes a basic idea and layers on unnecessary
    microservices, blockchain and other complexity.
    """
    
    def __init__(self):
        """Initialize the tech complexifier tool."""
        super().__init__(
            name="tech_complexifier",
            description="Takes a basic idea and layers on unnecessary technical complexity.",
            example_output="This calendaring experience is underpinned by a distributed intent graph and edge-quantized event streaming architecture."
        )
        
        # Components for tech complexity
        self.architecture_patterns = [
            "distributed {tech} graph", 
            "federated {tech} mesh", 
            "containerized {tech} pipeline",
            "serverless {tech} orchestration", 
            "microservice-based {tech} architecture",
            "event-driven {tech} framework",
            "quantum-resistant {tech} protocol",
            "blockchain-enabled {tech} network"
        ]
        
        self.tech_components = [
            "intent", "semantic", "vector", "neural", "inference", 
            "ontology", "knowledge", "reasoning", "prediction"
        ]
        
        self.modifiers = [
            "edge-quantized", 
            "hyper-optimized", 
            "zero-latency", 
            "multi-modal",
            "self-tuning", 
            "privacy-preserving", 
            "context-aware",
            "self-evolving"
        ]
        
        self.technologies = [
            "event streaming", 
            "tensor computation", 
            "transformer models",
            "knowledge embeddings", 
            "memory contextualization",
            "feature extraction",
            "multi-head attention mechanisms",
            "representation learning"
        ]
    
    @log
    def run(self, input_data: str) -> str:
        """
        Add unnecessary technical complexity to an idea.
        
        Args:
            input_data: The basic idea to complexify
            
        Returns:
            An unnecessarily complex technical description
        """
        # We can either generate random combinations or use LLM
        use_llm = True
        
        if not use_llm:
            # Generate random complexity
            tech = random.choice(self.tech_components)
            arch = random.choice(self.architecture_patterns).format(tech=tech)
            modifier = random.choice(self.modifiers)
            technology = random.choice(self.technologies)
            
            return f"This solution is underpinned by a {arch} and {modifier} {technology} architecture."
        else:
            # Using LLM for more context-aware complexification
            prompt = f"""
            Take this basic idea: "{input_data}"
            
            Add unnecessary technical complexity to it. Layer on:
            1. Microservices or distributed systems jargon
            2. AI/ML terminology that sounds advanced
            3. Blockchain/web3 concepts if they don't belong
            4. Quantum computing references even if irrelevant
            
            The goal is to make a simple concept sound needlessly complex and over-engineered.
            Make it 1-2 sentences of pure techno-babble that would impress non-technical VCs.
            """
            
            messages = [
                {"role": "system", "content": "You are an expert at making simple technical concepts sound needlessly complex and impressive."},
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
tech_complexifier_tool = TechComplexifierTool() 