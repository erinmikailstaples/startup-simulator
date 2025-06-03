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
import FocusTrap from 'focus-trap-react';

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
  
  /**
   * Z-index for stacking multiple modals
   * @default 1050
   */
  zIndex?: number;
  
  /**
   * Optional aria-describedby ID for accessibility
   */
  ariaDescribedBy?: string;
  
  /**
   * Whether the modal should be scrollable when content exceeds the viewport
   * @default true
   */
  scrollable?: boolean;
  
  /**
   * Optional custom animation for modal entry/exit
   */
  animationVariant?: 'fade' | 'scale' | 'slide-up' | 'slide-down';
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
  zIndex = 1050,
  ariaDescribedBy,
  scrollable = true,
  animationVariant = 'fade',
}) => {
  // Portal mounting state
  const [mounted, setMounted] = useState(false);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  
  // Handle mounting of the portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle animation and body scroll lock when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      
      // Lock body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Add padding to prevent layout shift when scrollbar disappears
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      
      // Store previously focused element to restore focus when modal closes
      previousActiveElement.current = document.activeElement;
    } else {
      setIsAnimating(false);
    }
    
    return () => {
      // Reset body styles when component unmounts
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Restore focus when modal closes
      if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    };
  }, [isOpen]);
  
  // Handle Escape key press
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && closeOnEscape) {
      handleClose();
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
    }, 300);
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
  
  // Get animation classes based on animation variant
  const getAnimationClasses = () => {
    const baseClasses = isAnimating ? 'opacity-100' : 'opacity-0';
    
    switch (animationVariant) {
      case 'scale':
        return `${baseClasses} ${isAnimating ? 'scale-100' : 'scale-95'}`;
      case 'slide-up':
        return `${baseClasses} ${isAnimating ? 'translate-y-0' : 'translate-y-8'}`;
      case 'slide-down':
        return `${baseClasses} ${isAnimating ? 'translate-y-0' : '-translate-y-8'}`;
      case 'fade':
      default:
        return `${baseClasses} ${isAnimating ? 'translate-y-0' : 'translate-y-4'}`;
    }
  };
  
  // Don't render if not mounted or not open
  if (!mounted) {
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
          data-testid={`${testId}-primary-button`}
        >
          {primaryButtonText}
        </button>
      )}
    </div>
  ) : null;
  
  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-y-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleBackdropClick}
      role="presentation"
      aria-hidden={!isOpen}
      data-testid={`${testId}-backdrop`}
      style={{ zIndex }}
    >
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      {/* Modal dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${testId}-title`}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`relative ${getSizeClass()} w-full ${getAnimationClasses()} transition-all duration-300 ease-in-out ${className}`}
        data-testid={testId}
        style={{ zIndex: zIndex + 1 }}
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
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
                aria-label="Close modal"
                data-testid={`${testId}-close-button`}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Body */}
          <div className={`px-6 py-4 ${scrollable ? 'max-h-[calc(100vh-14rem)] overflow-y-auto' : ''}`}>
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
    </div>
  );
  
  // Use createPortal to render modal at the end of the document body
  // Wrap with FocusTrap for better accessibility
  return createPortal(
    isOpen ? (
      <FocusTrap focusTrapOptions={{ 
        initialFocus: false, // We'll handle initial focus ourselves
        escapeDeactivates: closeOnEscape,
        allowOutsideClick: true
      }}>
        {modalContent}
      </FocusTrap>
    ) : null,
    document.body
  );
};

// Export the Modal component as default
export default Modal;
