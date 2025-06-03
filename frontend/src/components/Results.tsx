import React, { useState, useEffect } from 'react';
import { StartupAnalysis } from '@/types';

interface ResultsProps {
  analysis: StartupAnalysis;
  onReset: () => void;
}

// Score descriptions for different ranges
const SCORE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  marketViability: {
    high: "Strong market opportunity with clear demand and growth potential.",
    medium: "Viable market with moderate growth potential.",
    low: "Limited market opportunity or highly competitive landscape."
  },
  financialViability: {
    high: "Strong revenue model with clear path to profitability.",
    medium: "Reasonable financial model that needs refinement.",
    low: "Weak financial model with significant challenges."
  },
  innovationScore: {
    high: "Highly innovative concept with strong differentiation.",
    medium: "Moderately innovative with some unique aspects.",
    low: "Limited innovation or too similar to existing solutions."
  },
  riskAssessment: {
    high: "Lower risk profile with manageable challenges.",
    medium: "Moderate risks that require careful planning.",
    low: "High risk profile with significant challenges to overcome."
  }
};

const Results: React.FC<ResultsProps> = ({ analysis, onReset }) => {
  // Animation states
  const [animate, setAnimate] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  
  const { 
    pitch, 
    marketViability, 
    financialViability, 
    innovationScore, 
    riskAssessment, 
    overallScore, 
    feedback,
    created_at
  } = analysis;

  // Format the creation date
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Start animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Determine color based on score
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-600';
  };

  // Determine background color based on score
  const scoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-blue-600'; 
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-600';
  };

  // Get appropriate label based on score
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  // Get description for a score
  const getScoreDescription = (type: string, score: number) => {
    const category = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return SCORE_DESCRIPTIONS[type]?.[category] || '';
  };

  // Format score to round number
  const formatScore = (score: number) => {
    return Math.round(score);
  };

  // Handle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Share results
  const shareResults = async () => {
    const shareText = `My startup idea received an overall score of ${formatScore(overallScore)}% on the Startup Simulator! Check it out: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Startup Analysis',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 3000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  // Render score bar with animation
  const renderScoreBar = (score: number, label: string, type: keyof typeof SCORE_DESCRIPTIONS) => {
    return (
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{label}</span>
            <button 
              onClick={() => toggleSection(type)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={`${expandedSection === type ? 'Hide' : 'Show'} more information about ${label}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <div className={`text-xs font-medium px-2 py-0.5 rounded ${scoreBgColor(score)} text-white mr-2`}>
              {getScoreLabel(score)}
            </div>
            <span className={`text-sm font-medium ${scoreColor(score)}`}>
              {formatScore(score)}%
            </span>
          </div>
        </div>
        
        {/* Score bar with animation */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${scoreBgColor(score)}`}
            style={{ width: animate ? `${score}%` : '0%' }}
            role="progressbar"
            aria-valuenow={formatScore(score)}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        
        {/* Expanded section with description */}
        {expandedSection === type && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded-md animate-fadeIn">
            {getScoreDescription(type, score)}
          </div>
        )}
      </div>
    );
  };

  // Generate overall assessment message
  const getOverallAssessment = () => {
    if (overallScore >= 80) {
      return "Your startup idea shows excellent potential! With strong scores across key dimensions, you have a solid foundation for success. Consider moving forward with confidence while addressing any specific areas for improvement.";
    } else if (overallScore >= 60) {
      return "Your startup idea shows good potential. There are strong aspects to your concept, but also areas that could benefit from refinement. Focus on addressing the weaker aspects highlighted in the feedback.";
    } else if (overallScore >= 40) {
      return "Your startup idea has some promise but faces significant challenges. Consider revisiting core aspects of your concept and addressing the issues highlighted in the feedback before proceeding.";
    } else {
      return "Your startup idea faces substantial challenges in its current form. We recommend a thorough reassessment of the core concept, addressing the critical issues identified in the feedback.";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md opacity-0 animate-fadeIn">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">Startup Analysis Results</h2>
        <p className="text-center text-gray-500 mt-1">Generated on {formattedDate}</p>
      </div>
      
      {/* Pitch section */}
      <div className="mb-8 transition-transform duration-300 ease-in-out transform hover:scale-[1.01]">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Your Pitch</h3>
        </div>
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 shadow-sm">
          <p className="whitespace-pre-line text-gray-700 leading-relaxed">{pitch}</p>
        </div>
      </div>

      {/* Overall assessment */}
      <div className="mb-8 bg-gradient-to-r from-gray-50 to-white p-4 sm:p-5 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 flex items-center justify-center rounded-full mr-3 ${scoreBgColor(overallScore)}`}>
            <span className="text-white font-bold text-lg">{formatScore(overallScore)}%</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Assessment</h3>
            <p className={`text-sm ${scoreColor(overallScore)}`}>{getScoreLabel(overallScore)}</p>
          </div>
        </div>
        <p className="text-gray-700">{getOverallAssessment()}</p>
      </div>

      {/* Scores section */}
      <div className="mb-8 transition-transform duration-300 ease-in-out transform hover:scale-[1.01]">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Viability Scores</h3>
        </div>
        <div className="p-4 sm:p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
          {renderScoreBar(marketViability, 'Market Viability', 'marketViability')}
          {renderScoreBar(financialViability, 'Financial Viability', 'financialViability')}
          {renderScoreBar(innovationScore, 'Innovation', 'innovationScore')}
          {renderScoreBar(riskAssessment, 'Risk Assessment', 'riskAssessment')}
          
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <span className="text-lg font-bold text-gray-900">Overall Score</span>
              <div className="flex items-center mt-1 sm:mt-0">
                <div className={`text-sm font-medium px-2.5 py-0.5 rounded ${scoreBgColor(overallScore)} text-white mr-2`}>
                  {getScoreLabel(overallScore)}
                </div>
                <span className={`text-lg font-bold ${scoreColor(overallScore)}`}>
                  {formatScore(overallScore)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-1500 ease-out ${scoreBgColor(overallScore)}`}
                style={{ width: animate ? `${overallScore}%` : '0%' }}
                role="progressbar"
                aria-valuenow={formatScore(overallScore)}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback section */}
      <div className="mb-8 transition-transform duration-300 ease-in-out transform hover:scale-[1.01]">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Expert Feedback</h3>
        </div>
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-100 shadow-sm">
          <p className="whitespace-pre-line text-gray-700 leading-relaxed">{feedback}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        <button
          onClick={onReset}
          className="order-2 sm:order-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-label="Start a new simulation"
        >
          Start Over
        </button>
        
        <button
          onClick={shareResults}
          className="order-1 sm:order-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
          aria-label="Share your results"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share Results
        </button>
        
        {/* Copied to clipboard message */}
        {showCopiedMessage && (
          <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg animate-fadeIn">
            Results copied to clipboard!
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Powered by LangGraph and AI analysis</p>
      </div>
    </div>
  );
};

export default Results;
