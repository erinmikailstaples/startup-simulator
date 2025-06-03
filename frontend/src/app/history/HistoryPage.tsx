'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AnalysisHistory from '@/components/AnalysisHistory';
import { LoadingSpinner } from '@/components/common';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="large" text="Loading history..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Analysis History</h1>
          <p className="text-gray-600 mb-6">Please log in to view your analysis history.</p>
          <Link
            href="/login"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Analysis History</h1>
      <AnalysisHistory 
        showSearch={true}
        showFilters={true}
        limit={10}
      />
    </div>
  );
}
