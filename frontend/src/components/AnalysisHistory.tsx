'use client';

import React, { useState } from 'react';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { LoadingSpinner, toast, Modal, useModal } from '@/components/common';
import { StartupAnalysis } from '@/types';
import { ANALYSIS_CONFIG } from '@/config';

// Types for component props
interface AnalysisHistoryProps {
  limit?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
}

// Individual analysis card component
interface AnalysisCardProps {
  analysis: StartupAnalysis;
  onDelete: (id: string) => void;
  onView: (analysis: StartupAnalysis) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onDelete, onView }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreClass = (score: number) => {
    if (score >= ANALYSIS_CONFIG.SCORE_THRESHOLDS.EXCELLENT) return 'text-green-600';
    if (score >= ANALYSIS_CONFIG.SCORE_THRESHOLDS.GOOD) return 'text-blue-600';
    if (score >= ANALYSIS_CONFIG.SCORE_THRESHOLDS.FAIR) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Startup Analysis: ${analysis.input.idea}`,
        text: `Check out my startup idea analysis for ${analysis.input.idea}`,
        url: `${window.location.origin}/analysis/${analysis.id}`
      }).catch(err => {
        console.error('Error sharing: ', err);
      });
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(`${window.location.origin}/analysis/${analysis.id}`)
        .then(() => {
          toast({
            title: 'Link Copied',
            description: 'Share link copied to clipboard',
            type: 'success',
          });
        })
        .catch(err => {
          console.error('Error copying to clipboard: ', err);
        });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold truncate flex-1">{analysis.input.idea}</h3>
        <span className={`font-bold ${getScoreClass(analysis.overallScore || 0)}`}>
          {analysis.overallScore || 0}/100
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        <p>Industry: {analysis.input.industry}</p>
        <p>Created: {formatDate(analysis.createdAt)}</p>
      </div>
      
      <div className="mt-3 flex justify-between">
        <div>
          <button
            onClick={() => onView(analysis)}
            className="mr-2 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-sm"
          >
            View Details
          </button>
        </div>
        <div>
          <button
            onClick={handleShare}
            className="mr-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
            aria-label="Share analysis"
          >
            Share
          </button>
          <button
            onClick={() => onDelete(analysis.id || '')}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
            aria-label="Delete analysis"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === i 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };
  
  return (
    <div className="flex justify-center items-center mt-5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        Previous
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`mx-1 px-3 py-1 rounded ${
          currentPage === totalPages 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        Next
      </button>
    </div>
  );
};

// Detail view modal component
interface AnalysisDetailProps {
  analysis: StartupAnalysis | null;
}

const AnalysisDetail: React.FC<AnalysisDetailProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-1">
      <h2 className="text-xl font-bold">{analysis.input.idea}</h2>
      
      <div className="bg-gray-50 p-3 rounded-md">
        <h3 className="font-semibold mb-2">Input Details</h3>
        <p><span className="font-medium">Industry:</span> {analysis.input.industry}</p>
        <p><span className="font-medium">Target Audience:</span> {analysis.input.targetAudience}</p>
        <p><span className="font-medium">Problem Solved:</span> {analysis.input.problemSolved}</p>
        <p><span className="font-medium">Competitive Advantage:</span> {analysis.input.competitiveAdvantage}</p>
      </div>
      
      <div className="bg-indigo-50 p-3 rounded-md">
        <h3 className="font-semibold mb-2">Analysis Results</h3>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Overall Score:</span> 
          <span className="font-bold text-indigo-600">{analysis.overallScore}/100</span>
        </div>
        
        {analysis.categoryScores && (
          <div className="space-y-2">
            {Object.entries(analysis.categoryScores).map(([category, score]) => (
              <div key={category} className="flex justify-between">
                <span>{category}:</span>
                <span>{score}/100</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {analysis.feedback && (
        <div className="bg-blue-50 p-3 rounded-md">
          <h3 className="font-semibold mb-2">Feedback</h3>
          <p>{analysis.feedback}</p>
        </div>
      )}
      
      {analysis.recommendations && (
        <div className="bg-green-50 p-3 rounded-md">
          <h3 className="font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1">
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Main component
const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  limit = 10,
  showSearch = true,
  showFilters = true,
  className = '',
}) => {
  const {
    history,
    loading,
    error,
    pagination,
    filters,
    removeAnalysis,
    clearHistory,
    setFilters,
    changePage,
    refreshHistory,
  } = useAnalysisHistory({ limit });

  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedAnalysis, setSelectedAnalysis] = useState<StartupAnalysis | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      await removeAnalysis(id);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all your analysis history?')) {
      await clearHistory();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  const handleViewAnalysis = (analysis: StartupAnalysis) => {
    setSelectedAnalysis(analysis);
    openModal();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilters({ 
      sortBy: sortBy as 'date' | 'score', 
      sortOrder: sortOrder as 'asc' | 'desc' 
    });
  };

  if (error) {
    return (
      <div className={`text-center py-10 ${className}`}>
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          <p>Error loading analysis history: {error.message}</p>
        </div>
        <button 
          onClick={refreshHistory}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Analysis History</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={refreshHistory}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
            disabled={loading}
          >
            Refresh
          </button>
          
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
              disabled={loading}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {showSearch && (
        <div className="mb-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by idea or industry..."
              className="border rounded-l py-2 px-3 flex-1"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-r"
            >
              Search
            </button>
          </form>
        </div>
      )}
      
      {showFilters && (
        <div className="mb-4 flex justify-end">
          <select
            onChange={handleSortChange}
            value={`${filters.sortBy}-${filters.sortOrder}`}
            className="border rounded py-2 px-3"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
          </select>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" color="primary" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No analysis history found.</p>
          {filters.search && (
            <button
              onClick={() => {
                setFilters({ search: '' });
                setSearchTerm('');
              }}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="grid gap-4 md:grid-cols-2">
            {history.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                onDelete={handleDelete}
                onView={handleViewAnalysis}
              />
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={changePage}
            />
          )}
        </div>
      )}
      
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Analysis Details"
        size="large"
      >
        <AnalysisDetail analysis={selectedAnalysis} />
      </Modal>
    </div>
  );
};

export default AnalysisHistory;

