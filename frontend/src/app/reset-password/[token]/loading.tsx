import { LoadingSpinner } from '@/components/common';

export default function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner 
          size="large" 
          color="primary" 
          text="Loading password reset page..." 
        />
      </div>
    </div>
  );
}

