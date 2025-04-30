import React from 'react';
import { InvestorDecision } from '../../shared/types';

interface InvestorFeedbackProps {
  decision: InvestorDecision | null;
  isLoading: boolean;
}

export default function InvestorFeedback({ decision, isLoading }: InvestorFeedbackProps) {
  return (
    <div className="bg-indigo-900/40 rounded-xl p-6 shadow-xl mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
        Investor Decision
      </h2>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-indigo-300">VCs are deliberating...</p>
        </div>
      )}

      {decision && !isLoading && (
        <div className="bg-black/30 p-6 rounded-lg">
          {decision.funded ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-500 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-green-400 mb-2">Funded! 🎉</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-white mb-1">{decision.amount}</div>
                <div className="text-green-300">at {decision.valuation} valuation</div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-500 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-red-400 mb-4">Not Funded 😢</h3>
            </>
          )}
          
          <div className={`p-4 rounded-lg ${decision.funded ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
            <h4 className="font-medium mb-2">Investor Feedback:</h4>
            <p className="italic">"{decision.feedback}"</p>
          </div>
          
          {decision.funded && (
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-400 mb-2">Your next steps:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-black/40 p-2 rounded">Hire overpriced executives</div>
                <div className="bg-black/40 p-2 rounded">Burn through runway</div>
                <div className="bg-black/40 p-2 rounded">Pivot three times</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 