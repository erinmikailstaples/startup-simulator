"""
Agent that evaluates the generated output using Galileo.
"""

from typing import Dict, Any

from . import BaseAgent
from ..models.game_models import EvaluationResult
from ..services.galileo import galileo_service
from ..services.prompt_templates import EVAL_AGENT_PROMPT

class EvalAgent(BaseAgent):
    """
    Agent that evaluates the generated output using Galileo metrics
    and provides evaluation results.
    """
    
    def __init__(self):
        """Initialize the evaluation agent."""
        super().__init__(name="eval_agent")
    
    def run(self, prompt: str, output: str, model_name: str = "gpt-4") -> EvaluationResult:
        """
        Evaluate the generated output using Galileo.
        
        Args:
            prompt: The original user prompt
            output: The generated output to evaluate
            model_name: The model name used to generate the output
        
        Returns:
            An EvaluationResult object with the evaluation scores
        """
        # First, get the Galileo evaluation metrics
        eval_results = galileo_service.evaluate_response(
            prompt=prompt,
            response=output,
            model_name=model_name
        )
        
        # Generate an additional critique using our prompt
        critique_prompt = EVAL_AGENT_PROMPT.format(
            original_prompt=prompt,
            generated_output=output,
            hallucination_score=eval_results["hallucination_score"],
            instruction_following=eval_results["instruction_following"],
            relevance=eval_results["relevance"],
            tool_use_accuracy=eval_results.get("tool_use_accuracy", 0.5),
            investor_appeal=eval_results["investor_appeal"]
        )
        
        # Generate the critique using our Galileo-wrapped LLM
        messages = [
            {"role": "system", "content": "You are a brutally honest but satirical VC evaluator."},
            {"role": "user", "content": critique_prompt}
        ]
        
        critique = galileo_service.run_llm_with_logging(
            messages=messages,
            model_name="gpt-4",
            temperature=0.7,
            max_tokens=200
        )
        
        # Return the evaluation results
        return EvaluationResult(
            hallucination_score=eval_results["hallucination_score"],
            instruction_following=eval_results["instruction_following"],
            relevance=eval_results["relevance"],
            tool_use_accuracy=eval_results.get("tool_use_accuracy"),
            critique=critique,
            investor_appeal=eval_results["investor_appeal"]
        )

# Create an instance for easy import
eval_agent = EvalAgent() 