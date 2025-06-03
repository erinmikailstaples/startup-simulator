import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Startup Simulator',
    default: 'Profile | Startup Simulator',
  },
  description: 'Manage your account settings and preferences.',
  openGraph: {
    title: 'User Profile',
    description: 'Manage your Startup Simulator account settings and preferences.',
    type: 'website',
    siteName: 'Startup Simulator',
    locale: 'en_US',
  },
};

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </section>
  );
}

