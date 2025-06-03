'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { ErrorFallbackProps } from '@/types';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<unknown>;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Default fallback component displayed when an error occurs
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div 
      role="alert" 
      className="p-6 mx-auto my-8 bg-red-50 border border-red-200 rounded-lg max-w-2xl text-center"
      aria-labelledby="error-title"
    >
      <div className="w-16 h-16 mx-auto mb-4 text-red-500">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      
      <h2 id="error-title" className="text-xl font-bold text-red-700 mb-2">
        Something went wrong
      </h2>
      
      <p className="text-red-600 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

/**
 * Error Boundary component to catch JavaScript errors in child components
 * and display a fallback UI instead of the component tree that crashed
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset the error boundary when reset keys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, idx) => key !== prevProps.resetKeys?.[idx])
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ 
      hasError: false, 
      error: null 
    });
  };

  render(): ReactNode {
    const { children, fallback: FallbackComponent = DefaultErrorFallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError && error) {
      return (
        <FallbackComponent
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;

