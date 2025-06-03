import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common';

export const metadata: Metadata = {
  title: {
    template: '%s | Startup Simulator',
    default: 'Analysis History | Startup Simulator',
  },
  description: 'View and analyze your startup simulation history.',
  openGraph: {
    title: 'Startup Analysis History',
    description: 'Track your entrepreneurial journey with detailed startup analysis history.',
    type: 'website',
    siteName: 'Startup Simulator',
    locale: 'en_US',
  },
};

interface HistoryLayoutProps {
  children: React.ReactNode;
}

export default function HistoryLayout({ children }: HistoryLayoutProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'History' },
  ];

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        
        {/* Main content */}
        <main className="py-6">
          {children}
        </main>
      </div>
    </section>
  );
}

