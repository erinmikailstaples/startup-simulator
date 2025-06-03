import { LoadingSpinner } from '@/components/common';

export default function HistoryLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Skeleton loading state */}
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm mb-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

