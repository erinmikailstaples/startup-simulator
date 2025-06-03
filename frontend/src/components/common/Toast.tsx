'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useEffect, 
  useRef, 
  ReactNode 
} from 'react';
import { createPortal } from 'react-dom';
import { ToastNotification } from '@/types';

// Default duration for toasts in milliseconds
const DEFAULT_DURATION = 5000;

// Generate unique ID for toasts
const generateId = (): string => `toast-${Math.random().toString(36).substring(2, 9)}`;

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Interface for adding a new toast
export interface AddToastOptions {
  type: ToastType;
  message: string;
  duration?: number; // Duration in milliseconds, default is 5000ms
  autoClose?: boolean; // Whether to auto-close the toast, default is true
}

// Interface for Toast context
interface ToastContextProps {
  toasts: ToastNotification[];
  addToast: (options: AddToastOptions) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextProps>({
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
  removeAllToasts: () => {},
});

// Hook to use the Toast context
export const useToast = () => useContext(ToastContext);

// Props for the ToastProvider component
interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

/**
 * Toast Provider Component
 * 
 * Provides context for managing toast notifications across the application.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const toastsRef = useRef<ToastNotification[]>([]);
  
  // Update ref when toasts state changes
  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  // Set mounted flag after initial render
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  /**
   * Add a new toast notification
   */
  const addToast = useCallback((options: AddToastOptions): string => {
    const { type, message, duration = DEFAULT_DURATION, autoClose = true } = options;
    const id = generateId();
    
    const newToast: ToastNotification = {
      id,
      type,
      message,
      duration: autoClose ? duration : undefined,
    };
    
    setToasts(prev => {
      // Ensure we don't exceed maxToasts by removing oldest if needed
      const updatedToasts = [...prev, newToast];
      return updatedToasts.slice(-maxToasts);
    });
    
    return id;
  }, [maxToasts]);
  
  /**
   * Remove a specific toast by ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  /**
   * Remove all toasts
   */
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  // Context value
  const contextValue: ToastContextProps = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  };
  
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {isMounted && createPortal(
        <ToastContainer toasts={toasts} position={position} removeToast={removeToast} />,
        document.body
      )}
    </ToastContext.Provider>
  );
};

// Props for the ToastContainer component
interface ToastContainerProps {
  toasts: ToastNotification[];
  position: string;
  removeToast: (id: string) => void;
}

/**
 * Toast Container Component
 * 
 * Renders the toast notifications in a fixed position container.
 */
const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, position, removeToast }) => {
  // Define position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }[position] || 'top-4 right-4';
  
  return (
    <div 
      className={`fixed z-50 flex flex-col gap-2 ${positionClasses} max-w-sm w-full`}
      aria-live="polite"
      aria-atomic="true"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

// Props for the ToastItem component
interface ToastItemProps {
  toast: ToastNotification;
  onClose: () => void;
}

/**
 * Toast Item Component
 * 
 * Renders an individual toast notification with auto-close functionality.
 */
const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const { id, type, message, duration } = toast;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Set auto-close timer if duration is specified
  useEffect(() => {
    if (duration) {
      timerRef.current = setTimeout(() => {
        setIsExiting(true);
        // Allow time for exit animation
        setTimeout(onClose, 300);
      }, duration);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, onClose]);
  
  // Handle close button click
  const handleClose = () => {
    setIsExiting(true);
    // Allow time for exit animation
    setTimeout(onClose, 300);
  };
  
  // Animation classes
  const animationClasses = isExiting
    ? 'animate-fade-out opacity-0'
    : 'animate-slide-in';
  
  // Get style classes based on toast type
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type] || 'bg-gray-50 border-gray-200 text-gray-800';
  
  // Get icon based on toast type
  const icon = {
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  }[type] || null;
  
  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      className={`flex items-start p-4 border rounded-lg shadow-md ${typeClasses} ${animationClasses} transition-opacity duration-300`}
      data-testid={`toast-${type}`}
    >
      {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
      
      <div className="flex-grow">
        <p className="text-sm font-medium">{message}</p>
      </div>
      
      <button 
        type="button" 
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

// Utility functions for common toast types
// Create a toast function for use within components
// This fixes the "hook called outside component" error
export function useToastFunctions() {
  const toast = useToast();
  
  return {
    success: (message: string, options?: Partial<AddToastOptions>) => {
      return toast.addToast({ type: 'success', message, ...options });
    },
    error: (message: string, options?: Partial<AddToastOptions>) => {
      return toast.addToast({ type: 'error', message, ...options });
    },
    warning: (message: string, options?: Partial<AddToastOptions>) => {
      return toast.addToast({ type: 'warning', message, ...options });
    },
    info: (message: string, options?: Partial<AddToastOptions>) => {
      return toast.addToast({ type: 'info', message, ...options });
    },
    // Additional utility to remove a specific toast
    remove: (id: string) => {
      toast.removeToast(id);
    },
    // Additional utility to remove all toasts
    removeAll: () => {
      toast.removeAllToasts();
    }
  };
}

// Add CSS keyframes for animations (to be added in global CSS)
// @keyframes slide-in {
//   from { transform: translateX(100%); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }
// @keyframes fade-out {
//   from { opacity: 1; }
//   to { opacity: 0; }
// }

export default ToastProvider;

