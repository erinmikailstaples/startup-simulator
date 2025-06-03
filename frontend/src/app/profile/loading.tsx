import { LoadingSpinner } from '@/components/common';

export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Skeleton loading state */}
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            
            <div className="mb-6">
              <div className="h-5 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
            
            <div className="mb-6">
              <div className="h-5 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-40 bg-gray-200 rounded mt-1"></div>
            </div>
            
            <div className="flex justify-end">
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-7 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

