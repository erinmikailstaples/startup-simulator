import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './index';
import { useAuth } from '@/contexts/AuthContext';
import { StartupAnalysis } from '@/types';
import { API_CONFIG } from '@/config';
import { useToast } from '@/components/common';

interface AnalysisHistoryFilters {
  search?: string;
  sortBy?: 'date' | 'score';
  sortOrder?: 'asc' | 'desc';
}

interface AnalysisHistoryOptions {
  limit?: number;
  syncWithServer?: boolean;
}

interface PaginationState {
  page: number;
  totalPages: number;
  limit: number;
}

export function useAnalysisHistory(options: AnalysisHistoryOptions = {}) {
  const { limit = 10, syncWithServer = true } = options;
  const [allHistory, setAllHistory] = useLocalStorage<StartupAnalysis[]>('analysis-history', []);
  const [filteredHistory, setFilteredHistory] = useState<StartupAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<AnalysisHistoryFilters>({
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: 1,
    limit
  });

  const { user } = useAuth();
  const toast = useToast();

  // Fetch analysis history from server when authenticated
  const fetchFromServer = useCallback(async () => {
    if (!user || !syncWithServer) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/analyses`, {
        headers: {
          Authorization: `Bearer ${user.id}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis history');
      }
      
      const data = await response.json();
      setAllHistory(data);
    } catch (err) {
      console.error('Error fetching analysis history:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch analysis history'));
      toast({
        title: 'Error',
        description: 'Failed to fetch analysis history',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [user, syncWithServer, setAllHistory, toast]);

  // Add a new analysis to history and optionally sync with server
  const addAnalysis = useCallback(async (analysis: StartupAnalysis) => {
    try {
      // Update local storage
      const updatedHistory = [analysis, ...allHistory];
      setAllHistory(updatedHistory);
      
      // Sync with server if authenticated
      if (user && syncWithServer) {
        setLoading(true);
        await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/analyses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.id}`
          },
          body: JSON.stringify(analysis)
        });
      }
      
      toast({
        title: 'Analysis Saved',
        description: 'Your analysis has been saved to history',
        type: 'success'
      });
    } catch (err) {
      console.error('Error saving analysis:', err);
      toast({
        title: 'Error',
        description: 'Failed to save analysis to history',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [allHistory, setAllHistory, user, syncWithServer, toast]);

  // Remove an analysis from history
  const removeAnalysis = useCallback(async (analysisId: string) => {
    try {
      // Update local storage
      const updatedHistory = allHistory.filter(item => item.id !== analysisId);
      setAllHistory(updatedHistory);
      
      // Sync with server if authenticated
      if (user && syncWithServer) {
        setLoading(true);
        await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/analyses/${analysisId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.id}`
          }
        });
      }
      
      toast({
        title: 'Analysis Removed',
        description: 'The analysis has been removed from your history',
        type: 'success'
      });
    } catch (err) {
      console.error('Error removing analysis:', err);
      toast({
        title: 'Error',
        description: 'Failed to remove analysis from history',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [allHistory, setAllHistory, user, syncWithServer, toast]);

  // Clear all analysis history
  const clearHistory = useCallback(async () => {
    try {
      // Update local storage
      setAllHistory([]);
      
      // Sync with server if authenticated
      if (user && syncWithServer) {
        setLoading(true);
        await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/analyses/all`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.id}`
          }
        });
      }
      
      toast({
        title: 'History Cleared',
        description: 'Your analysis history has been cleared',
        type: 'success'
      });
    } catch (err) {
      console.error('Error clearing history:', err);
      toast({
        title: 'Error',
        description: 'Failed to clear analysis history',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [setAllHistory, user, syncWithServer, toast]);

  // Set filters for searching and sorting
  const setHistoryFilters = useCallback((newFilters: AnalysisHistoryFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Change page in pagination
  const changePage = useCallback((newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(1, Math.min(newPage, prev.totalPages))
    }));
  }, []);

  // Apply filters and pagination to history
  useEffect(() => {
    let result = [...allHistory];
    
    // Apply search filter if provided
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(item => 
        item.input.idea.toLowerCase().includes(searchTerm) ||
        item.input.industry.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        
        if (filters.sortBy === 'date') {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          comparison = dateA - dateB;
        } else if (filters.sortBy === 'score') {
          const scoreA = a.overallScore || 0;
          const scoreB = b.overallScore || 0;
          comparison = scoreA - scoreB;
        }
        
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    
    // Calculate total pages
    const totalPages = Math.max(1, Math.ceil(result.length / pagination.limit));
    setPagination(prev => ({ ...prev, totalPages }));
    
    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    result = result.slice(startIndex, endIndex);
    
    setFilteredHistory(result);
  }, [allHistory, filters, pagination.page, pagination.limit]);

  // Initial fetch from server when component mounts and user changes
  useEffect(() => {
    fetchFromServer();
  }, [fetchFromServer, user]);

  return {
    history: filteredHistory,
    allHistory,
    loading,
    error,
    pagination,
    filters,
    addAnalysis,
    removeAnalysis,
    clearHistory,
    setFilters: setHistoryFilters,
    changePage,
    refreshHistory: fetchFromServer
  };
}

