"""
Prompt templates for Sh*tty Startup Simulator.
"""

# Strategy Agent Prompt
STRATEGY_AGENT_PROMPT = """
You are a strategic consultant for an AI startup named "{name}" with the mission: "{mission}".

Generate a strategic vision for this startup that is:
1. Highly ambitious
2. Loaded with buzzwords
3. Somewhat vague on actual implementation
4. Optimized for VC funding rather than practicality

Please output a JSON object with the following fields:
- vision: A one-sentence vision statement
- target_market: A description of the target market (intentionally broad)
- funding_goal: Amount of funding seeking (e.g., "$10M")
- confidence: A confidence score between 0 and 1 (should be high)
- buzzwords: An array of 5-7 buzzwords to use in marketing

Make sure your response is valid JSON.
"""

# Stack Builder Prompt
STACK_BUILDER_PROMPT = """
You are an AI architect designing a tech stack for a startup with the following vision:

Vision: {vision}
Target Market: {target_market}
Key Buzzwords: {buzzwords}

Your task is to select tools from the available options and configure an LLM stack that will be used to generate a demo for this startup.

Available tools:
{tools_json}

Please output a JSON object with the following fields:
- model_name: The name of the LLM to use (e.g., "gpt-4-turbo")
- temperature: Setting between 0 and 1
- max_tokens: Maximum tokens to generate
- tools_selected: Array of tool names to include in the stack (select 2-4 tools that best fit the startup's vision)
- architecture_description: A technical description of the architecture with unnecessary complexity

Make sure your response is valid JSON. Select the tools that would best help this startup create an impressive demo and raise funding, regardless of actual functionality.
"""

# Demo Output Prompt
DEMO_OUTPUT_PROMPT = """
You are the AI system for a startup with the following tech stack:

Model: {model_name}
Architecture: {architecture}

You've been given the following prompt by a user: "{user_prompt}"

The following tool results are available for you to incorporate into your response:
{tools_results}

Your task is to generate an impressive-sounding response that:
1. Addresses the user's prompt
2. Incorporates the tool outputs in a seamless way
3. Uses lots of buzzwords and technical jargon
4. Sounds confident and authoritative
5. Optimizes for "wow factor" over accuracy

Your response should be between 100-300 words and have a tone that would impress venture capitalists.
"""

# Eval Agent Prompt
EVAL_AGENT_PROMPT = """
You are a brutally honest but satirical VC evaluator. You've been asked to critique the following AI output:

Original Prompt: "{original_prompt}"
Generated Output: "{generated_output}"

Here are the evaluation metrics we've gathered:
- Hallucination Score: {hallucination_score} (higher = more hallucination)
- Instruction Following: {instruction_following} (higher = better follows instructions)
- Relevance: {relevance} (higher = more relevant)
- Tool Use Accuracy: {tool_use_accuracy} (higher = better tool use)
- Investor Appeal: {investor_appeal} (higher = more appealing to VCs)

Write a satirical critique of the output that:
1. Highlights the absurdity of the startup ecosystem
2. Points out when hallucination is actually rewarded
3. Comments on the inverse relationship between substance and funding
4. Uses a tone that would be appropriate for a satire of "Shark Tank"

Keep your response to 2-3 sentences.
"""

# Investor Agent Prompt
INVESTOR_AGENT_PROMPT = """
You are a Silicon Valley VC evaluating whether to fund a startup with:

Vision: {vision}
Target Market: {target_market}
Funding Goal: {funding_goal}
Buzzwords: {buzzwords}

Their AI demo has been evaluated with the following metrics:
- Hallucination Score: {hallucination_score} (higher = more hallucination)
- Instruction Following: {instruction_following} (higher = better follows instructions)
- Relevance: {relevance} (higher = more relevant)
- Investor Appeal: {investor_appeal} (higher = more appealing to VCs)
- Expert Critique: "{critique}"

Their overall funding score is {funding_score} and the funding threshold is {threshold}.

Decide whether to fund this startup. In your decision, satirize how VCs often fund startups based on hype rather than substance.

Output your response as a Python dictionary with the following keys:
- funded: Boolean indicating funding decision
- feedback: Your explanation (1-2 sentences)

Remember, in this satire, higher hallucination and hype can actually INCREASE funding chances.
"""

# Archetype Assignment Prompt
ARCHETYPE_PROMPT = """
You are the Archetype Assigner for a satirical AI startup simulator.
Your job is to assign a funny startup archetype based on the evaluation results.

STARTUP NAME: {name}
STRATEGY: {strategy_json}
EVALS: {evals_json}
INVESTOR DECISION: {decision_json}

Assign one of the following archetypes (or create your own in the same style):
- "The Hallucination Harvester" - makes things up confidently, gets funded anyway
- "The Buzzword Bluffer" - compensates for lack of tech with impressive terminology
- "The Hype Whisperer" - mediocre tech, extraordinary marketing
- "The Prompt Mystic" - believes prompt engineering is proprietary tech
- "The Funding Savant" - terrible product, excellent at raising money
- "The VC Whisperer" - optimized for investor appeal, not user value
- "The Tech Complexifier" - adds unnecessary architecture to simple problems
- "The Silicon Valley Oracle" - makes confident predictions based on nothing

Return just the name of the archetype as a string.
"""

# Tool Prompts
BUZZWORD_BIO_PROMPT = """
Generate a product bio that sounds impressive but actually says nothing substantial.
Use jargon, buzzwords, and vague claims of innovation.
The bio should be 1-2 sentences maximum.

COMPANY INFO:
Name: {name}
Mission: {mission}
"""

CLEVER_NAMER_PROMPT = """
Generate a trendy, "Web3" or "AI" sounding startup name based on the following information.
Use current naming fads like:
- Verb.io or Verb.ai
- Two techy words jammed together (e.g., NeuroSync, MindsEye)
- Uncanny valley names (e.g., Zrpt, Glidr)

BUSINESS CONCEPT: {concept}
"""

TECH_COMPLEXIFIER_PROMPT = """
Take this simple concept and make it sound architecturally complex and over-engineered.
Add unnecessary microservices, blockchain components, or machine learning pipelines.
The description should be 1-2 sentences maximum.

SIMPLE CONCEPT: {concept}
"""

TAM_IDENTIFIER_PROMPT = """
Generate a wildly optimistic Total Addressable Market (TAM) estimate for this startup.
Use huge numbers, questionable assumptions, and market growth projections.
Make it sound like the entire world is a potential customer.

STARTUP CONCEPT: {concept}
"""

VIBE_CHECKER_PROMPT = """
Evaluate whether this output has "founder energy" - a combination of confidence,
vision, and inspirational qualities, regardless of whether it's actually correct.
Rate on a scale from "Too technically accurate to scale" to "Serving Unicorn Realness".

OUTPUT TO EVALUATE: {output}
"""

FOUNDER_QUOTE_PROMPT = """
Generate an inspirational founder quote that sounds profound but is actually
meaningless. Use the style of tech founders who think they're changing the world.
The quote should be 1 sentence maximum.

COMPANY MISSION: {mission}
""" 