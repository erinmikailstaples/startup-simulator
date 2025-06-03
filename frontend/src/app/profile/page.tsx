import { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfilePage from './ProfilePage';

export const metadata: Metadata = {
  title: 'Profile Settings | Startup Simulator',
  description: 'Manage your account settings and preferences.',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

