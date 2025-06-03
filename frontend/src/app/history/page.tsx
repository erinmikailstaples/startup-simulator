import { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import HistoryPage from './HistoryPage';

export const metadata: Metadata = {
  title: 'Analysis History | Startup Simulator',
  description: 'View your past startup analyses and track your entrepreneurial journey.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  );
}
