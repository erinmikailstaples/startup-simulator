/**
 * API Types for Startup Simulator
 */
// Type definition for toast notifications
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
/**
 * API loading status
 */
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Analysis status
 */
export type AnalysisStatus = 'pending' | 'completed' | 'failed';

/**
 * Question structure from API
 */
export interface Question {
  id: string;
  question: string;
  description: string;
  required?: boolean;
  multiline?: boolean;
}

/**
 * Startup form data submitted to API
 */
export interface StartupFormData {
  idea: string;
  industry: string;
  targetAudience: string;
  problemSolved: string;
  competitiveAdvantage: string;
  businessModel: string;
  fundingNeeds: string;
}

/**
 * Analysis section with score and content
 */
export interface AnalysisSection {
  title: string;
  content: string;
  score?: number;
  confidence?: number;
}

/**
 * Complete startup analysis result
 */
export interface StartupAnalysis {
  pitch: string;
  overview: AnalysisSection;
  marketViability: AnalysisSection;
  financialViability: AnalysisSection;
  innovation: AnalysisSection;
  risks: AnalysisSection;
  overallScore: number;
  recommendation: string;
  sessionId?: string;
  timestamp?: string;
}

/**
 * API Error with extended properties
 */
export interface ApiError extends Error {
  status?: number;
  details?: any;
  retryable?: boolean;
}

/**
 * Response from analysis submission
 */
export interface AnalysisResponse {
  id: string;
  status: AnalysisStatus;
  result?: StartupAnalysis;
  message?: string;
}

/**
 * Questionnaire response
 */
export interface QuestionnaireResponse {
  questions: Question[];
}

/**
 * Request config for API calls
 */
export interface RequestConfig {
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}

/**
 * Polling configuration
 */
export interface PollingConfig {
  maxAttempts: number;
  interval: number;
}

