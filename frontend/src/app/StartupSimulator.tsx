'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// Dynamically import the QuestionWizard component to reduce initial load time
const QuestionWizard = dynamic(() => import('@/components/QuestionWizard'), {
  loading: () => <LoadingState />,
  ssr: false // Disable server-side rendering for this component
});

// Loading component
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full animate-pulse">
      <div className="w-full max-w-xl bg-gray-200 h-16 rounded-t-xl"></div>
      <div className="w-full max-w-xl space-y-3 p-6 bg-white rounded-b-xl shadow-sm">
        <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
        <div className="h-32 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-10 bg-gray-200 rounded-full w-1/2 mt-4"></div>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h3>
      <p className="text-red-600 mb-4">{error.message || 'An unexpected error occurred'}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export default function StartupSimulator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
    
    // Simulate initial loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    // Reset any state if needed
    window.location.reload();
  };

  // Show loading state during initial client-side rendering
  if (!isClient) return <LoadingState />;

  return (
    <div className="animate-fadeIn">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={handleReset}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="animate-slideIn">
            <QuestionWizard />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}
