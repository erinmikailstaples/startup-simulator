/**
 * Application Configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  VERSION: '/api/v1',
  TIMEOUT: 30000, // 30 seconds
};

// UI Configuration
export const UI_CONFIG = {
  TOAST: {
    DEFAULT_DURATION: 5000,
    MAX_TOASTS: 5,
    POSITION: 'top-right' as const,
  },
  MODAL: {
    DEFAULT_SIZE: 'medium' as const,
    ANIMATION_DURATION: 300,
  },
  THEME: {
    colors: {
      primary: '#4F46E5',
      secondary: '#6B7280',
      success: '#059669',
      danger: '#DC2626',
      warning: '#D97706',
      info: '#3B82F6',
    },
  },
  LOADING: {
    DEFAULT_SIZE: 'medium' as const,
    DEFAULT_COLOR: 'primary' as const,
  },
};

// Analysis Configuration
export const ANALYSIS_CONFIG = {
  POLL_INTERVAL: 2000, // 2 seconds
  MAX_POLL_ATTEMPTS: 30,
  SCORE_THRESHOLDS: {
    EXCELLENT: 80,
    GOOD: 60,
    FAIR: 40,
  },
};

// Form Configuration
export const FORM_CONFIG = {
  MAX_LENGTHS: {
    idea: 200,
    industry: 100,
    targetAudience: 200,
    problemSolved: 300,
    competitiveAdvantage: 300,
    businessModel: 300,
    fundingNeeds: 200,
  },
  VALIDATION: {
    MIN_LENGTH: 10,
    REQUIRED_MESSAGE: 'This field is required',
    MIN_LENGTH_MESSAGE: (min: number) => `Must be at least ${min} characters`,
    MAX_LENGTH_MESSAGE: (max: number) => `Cannot exceed ${max} characters`,
  },
};

