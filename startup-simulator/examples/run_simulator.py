"""
Example of how to run the Sh*tty Startup Simulator directly using the agent framework.
This bypasses the API and runs the simulation directly.
"""

import os
import sys
import json
from dotenv import load_dotenv

# Add the parent directory to the path so we can import from the backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Import the agents
from backend.agents import (
    strategy_agent,
    stack_builder_agent,
    demo_output_agent,
    eval_agent,
    investor_agent
)
from backend.models.game_models import StartupInput
from backend.routes.simulate import assign_archetype

def run_simulation(name: str, mission: str, prompt: str):
    """
    Run the startup simulator with the provided inputs.
    
    Args:
        name: The startup name
        mission: The startup mission statement
        prompt: The user's prompt for the LLM
        
    Returns:
        The simulation result
    """
    # Create the input data
    input_data = StartupInput(
        name=name,
        mission=mission,
        prompt=prompt
    )
    
    print(f"\n🚀 Running Sh*tty Startup Simulator for {name}")
    print(f"📝 Mission: {mission}")
    print(f"💬 Prompt: {prompt}")
    print("\n" + "="*80 + "\n")
    
    # Step 1: Generate strategy using the StrategyAgent
    print("Step 1: Generating startup strategy...")
    strategy = strategy_agent.run(input_data)
    print(f"📊 Vision: {strategy.vision}")
    print(f"🎯 Target Market: {strategy.target_market}")
    print(f"💰 Funding Goal: {strategy.funding_goal}")
    print(f"✨ Buzzwords: {', '.join(strategy.buzzwords)}")
    print("\n" + "="*80 + "\n")
    
    # Step 2: Build the stack using the StackBuilderAgent
    print("Step 2: Building the tech stack...")
    stack = stack_builder_agent.run(strategy)
    print(f"🤖 Model: {stack.model_name}")
    print(f"🌡️ Temperature: {stack.temperature}")
    print(f"📏 Max Tokens: {stack.max_tokens}")
    print(f"🧰 Tools Selected: {', '.join(stack.tools_selected)}")
    print(f"🏗️ Architecture: {stack.architecture_description}")
    print("\n" + "="*80 + "\n")
    
    # Step 3: Generate demo output using the DemoOutputAgent
    print("Step 3: Generating demo output...")
    output = demo_output_agent.run(stack, input_data.prompt)
    print(f"💡 Output:\n{output}")
    print("\n" + "="*80 + "\n")
    
    # Step 4: Evaluate the output using the EvalAgent
    print("Step 4: Evaluating output...")
    evals = eval_agent.run(
        prompt=input_data.prompt,
        output=output,
        model_name=stack.model_name
    )
    print(f"⚠️ Hallucination Score: {evals.hallucination_score:.2f}")
    print(f"📝 Instruction Following: {evals.instruction_following:.2f}")
    print(f"🎯 Relevance: {evals.relevance:.2f}")
    if evals.tool_use_accuracy:
        print(f"🧰 Tool Use Accuracy: {evals.tool_use_accuracy:.2f}")
    print(f"💸 Investor Appeal: {evals.investor_appeal:.2f}")
    print(f"🔍 Critique: {evals.critique}")
    print("\n" + "="*80 + "\n")
    
    # Step 5: Get investor decision using the InvestorAgent
    print("Step 5: Getting investor decision...")
    decision = investor_agent.run(evals, strategy)
    if decision.funded:
        print(f"✅ FUNDED: {decision.amount} at {decision.valuation} valuation")
    else:
        print("❌ NOT FUNDED")
    print(f"💬 Feedback: {decision.feedback}")
    print("\n" + "="*80 + "\n")
    
    # Step 6: Assign an archetype
    archetype = assign_archetype(evals, decision)
    print(f"🏆 Final Archetype: {archetype}")
    
    return {
        "startup_name": name,
        "strategy": strategy.dict(),
        "stack": stack.dict(),
        "prompt": prompt,
        "output": output,
        "evals": evals.dict(),
        "decision": decision.dict(),
        "archetype": archetype
    }

if __name__ == "__main__":
    # Example startup
    name = "NeuralDreams.io"
    mission = "Revolutionizing sleep with AI-powered dream enhancement"
    prompt = "Generate a product description for our AI-powered dream enhancement app."
    
    # Run the simulation
    result = run_simulation(name, mission, prompt)
    
    # Save the result to a file
    with open("simulation_result.json", "w") as f:
        json.dump(result, f, indent=2)
    
    print("\n✅ Simulation complete! Results saved to simulation_result.json") 