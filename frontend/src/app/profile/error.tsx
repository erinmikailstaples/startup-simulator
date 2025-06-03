'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfileError({
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
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Error Loading Profile
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An error occurred while loading your profile.'}
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

