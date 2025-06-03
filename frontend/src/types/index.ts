/**
 * Centralized type definitions for Startup Simulator
 */

import { ReactNode, FormEvent } from 'react';

/**
 * ========================
 * API Types
 * ========================
 */

// Re-export all API-specific types
export * from './api';

/**
 * ========================
 * Component Prop Types
 * ========================
 */

/**
 * Props for the Question component
 */
export interface QuestionProps {
  id: string;
  question: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
  maxLength?: number;
  className?: string;
}

/**
 * Props for the Results component
 */
export interface ResultsProps {
  analysis: StartupAnalysis;
  onReset: () => void;
}

/**
 * Props for the Layout component
 */
export interface LayoutProps {
  children: ReactNode;
}

/**
 * Props for the ErrorFallback component
 */
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * ========================
 * Form State Types
 * ========================
 */

/**
 * Form validation errors
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Wizard step state
 */
export interface WizardState {
  step: number;
  formData: StartupFormData;
  validationErrors: ValidationErrors;
  touchedFields: Set<string>;
  loadingStatus: LoadingStatus;
  analysis: StartupAnalysis | null;
  error: string | null;
  showConfirmation: boolean;
}

/**
 * Simplified form state
 */
export interface FormState {
  formData: StartupFormData;
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  analysis: StartupAnalysis | null;
}

/**
 * Field configuration for form fields
 */
export interface FieldConfig {
  maxLength: number;
  required: boolean;
  multiline: boolean;
}

/**
 * Configuration for all form fields
 */
export type FieldsConfig = Record<keyof StartupFormData, FieldConfig>;

/**
 * Questionnaire request parameters
 */
export interface QuestionnaireRequest {
  locale?: string;
}

/**
 * Analysis request parameters
 */
export interface AnalysisRequest {
  analysis_id: string;
}

/**
 * ========================
 * UI State Types
 * ========================
 */

/**
 * Toast notification type
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

/**
 * Modal dialog state
 */
export interface ModalState {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Loading state with error information
 */
export interface LoadingState {
  status: LoadingStatus;
  error: ApiError | null;
}

/**
 * ========================
 * Utility Types
 * ========================
 */

/**
 * Timeout handler type
 */
export type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Debounced function type
 */
export type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Form submit handler
 */
export type FormSubmitHandler = (e: FormEvent<HTMLFormElement>) => void;

/**
 * Score rating type
 */
export type ScoreRating = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Handler function for async operations with error handling
 */
export type AsyncHandler<T, R> = (input: T) => Promise<R>;
