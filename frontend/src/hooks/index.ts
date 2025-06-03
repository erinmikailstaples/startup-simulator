import { useState, useEffect, useCallback, useRef } from 'react';
import { ANALYSIS_CONFIG, FORM_CONFIG } from '@/config';
import { StartupFormData, StartupAnalysis, ValidationErrors } from '@/types';
import { useToast } from '@/components/common';

/**
 * Custom hooks for the Startup Simulator application
 */

// Form validation hook
export function useFormValidation(initialData: StartupFormData) {
  const [formData, setFormData] = useState<StartupFormData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Form validation logic
  const validateField = useCallback((field: keyof StartupFormData, value: string) => {
    const maxLength = FORM_CONFIG.MAX_LENGTHS[field];
    
    if (!value.trim()) {
      return FORM_CONFIG.VALIDATION.REQUIRED_MESSAGE;
    }
    
    if (value.length < FORM_CONFIG.VALIDATION.MIN_LENGTH) {
      return FORM_CONFIG.VALIDATION.MIN_LENGTH_MESSAGE(FORM_CONFIG.VALIDATION.MIN_LENGTH);
    }
    
    if (value.length > maxLength) {
      return FORM_CONFIG.VALIDATION.MAX_LENGTH_MESSAGE(maxLength);
    }
    
    return '';
  }, []);

  // Validate all form fields and return validation status
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    let formIsValid = true;

    Object.entries(formData).forEach(([field, value]) => {
      const errorMessage = validateField(field as keyof StartupFormData, value as string);
      if (errorMessage) {
        formIsValid = false;
        newErrors[field] = errorMessage;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [formData, validateField]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it has been touched
    if (touchedFields.has(name)) {
      const errorMessage = validateField(name as keyof StartupFormData, value);
      setErrors(prev => ({ ...prev, [name]: errorMessage }));
    }
  }, [touchedFields, validateField]);

  // Handle input blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, name]));
    
    // Validate field
    const errorMessage = validateField(name as keyof StartupFormData, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  }, [validateField]);

  // Set a specific field value programmatically
  const setFieldValue = useCallback((field: keyof StartupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touchedFields.has(field as string)) {
      const errorMessage = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
  }, [touchedFields, validateField]);

  // Reset form to initial state or provided values
  const resetForm = useCallback((newData?: StartupFormData) => {
    setFormData(newData || initialData);
    setErrors({});
    setTouchedFields(new Set());
    setIsSubmitting(false);
    setIsValid(false);
  }, [initialData]);

  // Update validation status when formData changes
  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      validateForm();
    }
  }, [formData, validateForm, touchedFields]);
  
  return {
    formData,
    errors,
    touchedFields,
    isSubmitting,
    setIsSubmitting,
    isValid,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm
  };
}

// API request hook with loading state
export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const execute = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      if (mounted.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (mounted.current) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      }
      throw err;
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  return { data, loading, error, execute };
}

// Analysis polling hook
export function useAnalysisPolling(analysisId: string | null) {
  const [analysis, setAnalysis] = useState<StartupAnalysis | null>(null);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const pollAttempts = useRef(0);

  // Mock fetch analysis function (to be replaced with actual API call)
  const fetchAnalysis = useCallback(async (id: string): Promise<StartupAnalysis> => {
    try {
      // This would be replaced with an actual API call
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/analysis/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch analysis: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch analysis');
    }
  }, []);

  // Start polling for analysis results
  const startPolling = useCallback(() => {
    if (!analysisId) {
      setError(new Error('No analysis ID provided'));
      return;
    }

    setPolling(true);
    pollAttempts.current = 0;

    const poll = async () => {
      try {
        if (pollAttempts.current >= ANALYSIS_CONFIG.MAX_POLL_ATTEMPTS) {
          stopPolling();
          setError(new Error('Analysis is taking longer than expected. Please check back later.'));
          toast({
            title: 'Analysis Timeout',
            description: 'Analysis is taking longer than expected. Please check back later.',
            type: 'warning',
            duration: 7000,
          });
          return;
        }

        pollAttempts.current += 1;
        const result = await fetchAnalysis(analysisId);

        setAnalysis(result);

        // Check if analysis is complete
        if (result.status === 'completed' || result.status === 'failed') {
          stopPolling();
          
          if (result.status === 'failed') {
            setError(new Error('Analysis failed'));
            toast({
              title: 'Analysis Failed',
              description: 'There was an error processing your startup idea. Please try again.',
              type: 'error',
            });
          } else {
            toast({
              title: 'Analysis Complete',
              description: 'Your startup idea has been analyzed!',
              type: 'success',
            });
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
        setError(new Error(errorMessage));
        toast({
          title: 'Error',
          description: errorMessage,
          type: 'error',
        });
        stopPolling();
      }
    };

    // Initial poll
    poll();

    // Set up interval for subsequent polls
    pollInterval.current = setInterval(poll, ANALYSIS_CONFIG.POLL_INTERVAL);
  }, [analysisId, fetchAnalysis, toast]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
    setPolling(false);
  }, []);

  // Clean up on unmount or when analysisId changes
  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [analysisId]);

  return { 
    analysis, 
    polling, 
    error, 
    startPolling, 
    stopPolling 
  };
}

// Window size hook
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

