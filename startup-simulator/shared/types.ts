/**
 * Shared TypeScript types for Sh*tty Startup Simulator™
 * These types mirror the Pydantic models in the backend.
 */

/**
 * User input for startup simulation
 */
export interface StartupInput {
  name: string;
  mission: string;
  prompt: string;
}

/**
 * Output from the strategy agent
 */
export interface StrategyOutput {
  vision: string;
  target_market: string;
  funding_goal: string;
  confidence: number;
  buzzwords: string[];
}

/**
 * Configuration for the LLM stack
 */
export interface StackConfiguration {
  model_name: string;
  temperature: number;
  max_tokens: number;
  tools_selected: string[];
  architecture_description: string;
}

/**
 * Evaluation results from Galileo
 */
export interface EvaluationResults {
  hallucination_score: number;
  instruction_following: number;
  relevance: number;
  tool_use_accuracy: number;
  confidence: number;
  overall_rating: string;
  custom_evaluator_comment: string;
}

/**
 * Investor decision on funding
 */
export interface InvestorDecision {
  funded: boolean;
  amount?: string;
  valuation?: string;
  feedback: string;
}

/**
 * Complete simulation result
 */
export interface SimulationResult {
  output: string;
  evals: EvaluationResults;
  decision: InvestorDecision;
  archetype: string;
}

/**
 * Startup Archetype definitions with descriptions
 */
export interface ArchetypeDefinition {
  name: string;
  description: string;
  traits: string[];
}

/**
 * Available tool definitions
 */
export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  example?: string;
}

/**
 * LLM model options
 */
export interface ModelOption {
  id: string;
  name: string;
  description: string;
  costTier: string;
  maxTokens: number;
}

/**
 * Available tool definitions array
 */
export const AVAILABLE_TOOLS: ToolDefinition[] = [
  {
    id: 'buzzword_generator',
    name: 'Buzzword Biography Generator',
    description: 'Create impressive-sounding product descriptions that say nothing',
    example: 'An autonomous, privacy-first synergy layer enabling frictionless, AI-driven personalization at scale.'
  },
  {
    id: 'clever_namer',
    name: 'Clever Company Namer',
    description: 'Generate trendy startup names with guaranteed domain availability',
    example: 'Neurocrate.io, MindSync, Zynthe'
  },
  {
    id: 'tech_complexifier',
    name: 'Tech Complexifier',
    description: 'Add unnecessary architecture to simple problems',
    example: 'This calendaring experience is underpinned by a distributed intent graph and edge-quantized event streaming architecture.'
  },
  {
    id: 'tam_identifier',
    name: 'TAM Identifier',
    description: 'Wildly overestimate your total addressable market',
    example: 'Every person with access to a phone and unresolved childhood trauma is a potential user: estimated TAM = $2.4T.'
  },
  {
    id: 'vibe_checker',
    name: 'Vibe Checker',
    description: 'Evaluate if your output has sufficient founder energy',
    example: 'Serving Unicorn Realness'
  },
  {
    id: 'founder_quotes',
    name: 'Founder Quote Inserter',
    description: 'Auto-generate inspirational quotes for your pitch deck',
    example: "We're not just building tools. We're architecting the next human paradigm."
  }
];

/**
 * LLM model options array
 */
export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'basic',
    name: 'BasicLLM 7B',
    description: 'Lightweight, low accuracy, but cheap to run',
    costTier: 'low',
    maxTokens: 2000
  },
  {
    id: 'standard',
    name: 'GenerativeGPT 13B',
    description: 'Balanced performance for most applications',
    costTier: 'medium',
    maxTokens: 4000
  },
  {
    id: 'enterprise',
    name: 'HallucinateGPT 70B',
    description: 'Maximum confidence, variable accuracy',
    costTier: 'high',
    maxTokens: 8000
  }
]; 