'use client';

import React, { 
  useEffect, 
  useRef, 
  useState, 
  ReactNode, 
  KeyboardEvent, 
  MouseEvent 
} from 'react';
import { createPortal } from 'react-dom';
import { ModalState } from '@/types';

// Size variants for the modal
export type ModalSize = 'small' | 'medium' | 'large' | 'full';

// Modal props interface
export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Function to close the modal
   */
  onClose: () => void;
  
  /**
   * Title of the modal
   */
  title: string;
  
  /**
   * Content to be displayed in the modal body
   */
  children: ReactNode;
  
  /**
   * Size of the modal
   * @default 'medium'
   */
  size?: ModalSize;
  
  /**
   * Whether to close the modal when clicking outside
   * @default true
   */
  closeOnBackdropClick?: boolean;
  
  /**
   * Whether to close the modal when pressing the Escape key
   * @default true
   */
  closeOnEscape?: boolean;
  
  /**
   * Whether to show a close button in the header
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Optional footer content
   */
  footer?: ReactNode;
  
  /**
   * Optional primary action button text
   */
  primaryButtonText?: string;
  
  /**
   * Optional primary action button function
   */
  onPrimaryAction?: () => void;
  
  /**
   * Optional secondary action button text
   */
  secondaryButtonText?: string;
  
  /**
   * Optional secondary action button function
   */
  onSecondaryAction?: () => void;

  /**
   * Optional CSS class for the modal
   */
  className?: string;

  /**
   * Optional test ID for testing
   */
  testId?: string;
}

/**
 * Modal Component
 * 
 * An accessible modal dialog with multiple size options, backdrop click handling,
 * keyboard navigation, and animation effects.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  primaryButtonText,
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction,
  className = '',
  testId = 'modal',
}) => {
  // Portal mounting state
  const [mounted, setMounted] = useState(false);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for focus trap
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  // First and last focusable elements for focus trap
  const firstFocusableElementRef = useRef<HTMLElement | null>(null);
  const lastFocusableElementRef = useRef<HTMLElement | null>(null);
  
  // Handle mounting of the portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle animation and body scroll lock when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      
      // Store previously focused element to restore focus when modal closes
      previousActiveElement.current = document.activeElement;
    } else {
      document.body.style.overflow = '';
      
      // Restore focus when modal closes
      if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Set up focus trap when modal opens
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    // Focus the modal when it opens
    modalRef.current.focus();
    
    // Find all focusable elements in the modal
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      firstFocusableElementRef.current = focusableElements[0] as HTMLElement;
      lastFocusableElementRef.current = focusableElements[focusableElements.length - 1] as HTMLElement;
    }
  }, [isOpen]);
  
  // Handle Escape key press
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && closeOnEscape) {
      handleClose();
    } else if (event.key === 'Tab') {
      // Trap focus inside the modal
      if (!event.shiftKey && document.activeElement === lastFocusableElementRef.current) {
        event.preventDefault();
        firstFocusableElementRef.current?.focus();
      } else if (event.shiftKey && document.activeElement === firstFocusableElementRef.current) {
        event.preventDefault();
        lastFocusableElementRef.current?.focus();
      }
    }
  };
  
  // Handle backdrop click
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      handleClose();
    }
  };
  
  // Handle modal close with animation
  const handleClose = () => {
    setIsAnimating(false);
    // Add delay for exit animation
    setTimeout(() => {
      onClose();
    }, 200);
  };
  
  // Handle primary action click
  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
  };
  
  // Handle secondary action click
  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      handleClose();
    }
  };
  
  // Get size class based on size prop
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'large':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full mx-4';
      case 'medium':
      default:
        return 'max-w-2xl';
    }
  };
  
  // Animation classes
  const backdropAnimationClass = isAnimating 
    ? 'opacity-100' 
    : 'opacity-0';
  
  const modalAnimationClass = isAnimating 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-4';
  
  // Don't render if not mounted or not open
  if (!mounted || !isOpen) {
    return null;
  }
  
  // Create custom footer if primaryButtonText or secondaryButtonText are provided
  const customFooter = (primaryButtonText || secondaryButtonText) ? (
    <div className="flex justify-end space-x-3">
      {secondaryButtonText && (
        <button
          type="button"
          onClick={handleSecondaryAction}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          {secondaryButtonText}
        </button>
      )}
      {primaryButtonText && (
        <button
          type="button"
          onClick={handlePrimaryAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {primaryButtonText}
        </button>
      )}
    </div>
  ) : null;
  
  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto ${backdropAnimationClass} transition-opacity duration-300`}
      onClick={handleBackdropClick}
      role="presentation"
      aria-hidden={!isOpen}
      data-testid={`${testId}-backdrop`}
    >
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      {/* Modal dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${testId}-title`}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`relative z-10 ${getSizeClass()} w-full ${modalAnimationClass} transition-all duration-300 ${className}`}
        data-testid={testId}
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 
              id={`${testId}-title`} 
              className="text-xl font-semibold text-gray-900"
            >
              {title}
            </h2>
            
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full"
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
            {children}
          </div>
          
          {/* Footer */}
          {(footer || customFooter) && (
            <div className="px-6 py-4 border-t">
              {footer || customFooter}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * ModalProvider and hook for global modal state management
 */
import { createContext, useContext, useState, useCallback } from 'react';

// Modal context interface
interface ModalContextType {
  modalState: ModalState;
  openModal: (options: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

// Create context with default values
const ModalContext = createContext<ModalContextType>({
  modalState: {
    isOpen: false,
    title: '',
    content: null,
  },
  openModal: () => {},
  closeModal: () => {},
});

// Hook to use the modal context
export const useModal = () => useContext(ModalContext);

// Modal provider props
interface ModalProviderProps {
  children: ReactNode;
}

/**
 * Modal Provider Component
 * 
 * Provides global state management for modals throughout the application.
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    content: null,
  });
  
  // Open modal with provided options
  const openModal = useCallback((options: Omit<ModalState, 'isOpen'>) => {
    setModalState({
      ...options,
      isOpen: true,
    });
  }, []);
  
  // Close the modal
  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);
  
  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        size={modalState.size}
        primaryButtonText={modalState.confirmText}
        onPrimaryAction={modalState.onConfirm}
        secondaryButtonText={modalState.cancelText}
        onSecondaryAction={modalState.onCancel}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
};

// Export the Modal component as default
export default Modal;

