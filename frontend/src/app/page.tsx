import { Suspense } from 'react';
import { Metadata } from 'next';
import Layout from '@/components/Layout';
import StartupSimulator from './StartupSimulator';

// Loading component for suspense fallback
function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-lg text-gray-600">Loading the startup simulator...</p>
    </div>
  );
}

// Export metadata for this page
export const metadata: Metadata = {
  title: 'Startup Simulator - Build and Validate Your Startup Idea',
  description: 'Get AI-powered feedback on your startup idea and learn how to improve its viability.',
};

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Build Your Startup Concept
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Answer a few questions about your startup idea and get instant AI-powered feedback on its viability
          </p>
        </div>
        
        {/* Wrap the client component in Suspense for loading states */}
        <Suspense fallback={<Loading />}>
          <StartupSimulator />
        </Suspense>
        
        {/* How it works section */}
        <div className="mt-16 mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Answer Questions</h3>
              <p className="text-gray-600">Provide information about your startup idea, target market, and business model</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our AI agents analyze your idea across multiple dimensions using LangGraph</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Get Results</h3>
              <p className="text-gray-600">Receive a detailed analysis with scores and actionable feedback</p>
            </div>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg text-gray-900">How accurate is the analysis?</h3>
              <p className="mt-2 text-gray-600">Our analysis leverages AI and industry data to provide insights, but it's meant to be a starting point. Always validate findings with market research and expert feedback.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg text-gray-900">Is my data secure?</h3>
              <p className="mt-2 text-gray-600">We take data privacy seriously. Your startup information is processed securely and not stored permanently after analysis.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg text-gray-900">Can I save my results?</h3>
              <p className="mt-2 text-gray-600">Yes, you can download your analysis as a PDF report or share it via a unique link that will be valid for 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
