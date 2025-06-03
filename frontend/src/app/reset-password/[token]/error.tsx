'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ResetPasswordError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Password Reset Error
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An error occurred while processing your password reset request.'}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/forgot-password"
            className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Request new reset link
          </Link>
        </div>
      </div>
    </div>
  );
}

