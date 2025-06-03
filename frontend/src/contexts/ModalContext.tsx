'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
  useMemo
} from 'react';
import { ModalState } from '@/types';
import Modal from '@/components/common/Modal';

// Enhanced Modal context interface with support for multiple modals
interface ModalContextType {
  // Modal state management
  modals: ModalState[];
  
  // Open a new modal and add it to the stack
  openModal: (options: Omit<ModalState, 'isOpen'>) => string;
  
  // Close a specific modal by ID or the most recent one if no ID is provided
  closeModal: (id?: string) => void;
  
  // Update an existing modal by ID
  updateModal: (id: string, options: Partial<Omit<ModalState, 'isOpen'>>) => void;
  
  // Close all open modals
  closeAllModals: () => void;
}

// Create context with default values
const ModalContext = createContext<ModalContextType>({
  modals: [],
  openModal: () => '',
  closeModal: () => {},
  updateModal: () => {},
  closeAllModals: () => {},
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
 * Supports multiple modal instances with stacking.
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // State to track all open modals
  const [modals, setModals] = useState<(ModalState & { id: string })[]>([]);
  
  // Counter to generate unique IDs for modals
  const modalIdCounter = useRef(0);
  
  // Generate a unique ID for a new modal
  const generateModalId = useCallback(() => {
    modalIdCounter.current += 1;
    return `modal-${modalIdCounter.current}`;
  }, []);
  
  // Open a new modal with the provided options
  const openModal = useCallback((options: Omit<ModalState, 'isOpen'>) => {
    const id = generateModalId();
    
    setModals(prevModals => [
      ...prevModals,
      {
        id,
        ...options,
        isOpen: true,
      },
    ]);
    
    return id;
  }, [generateModalId]);
  
  // Close a specific modal by ID or the most recent one if no ID is provided
  const closeModal = useCallback((id?: string) => {
    if (id) {
      // Close the specific modal by ID
      setModals(prevModals => 
        prevModals.map(modal => 
          modal.id === id ? { ...modal, isOpen: false } : modal
        )
      );
      
      // Remove the closed modal after animation completes
      setTimeout(() => {
        setModals(prevModals => prevModals.filter(modal => modal.id !== id));
      }, 300);
    } else if (modals.length > 0) {
      // Close the most recent modal
      const lastModalId = modals[modals.length - 1].id;
      
      setModals(prevModals => 
        prevModals.map((modal, index) => 
          index === prevModals.length - 1 ? { ...modal, isOpen: false } : modal
        )
      );
      
      // Remove the closed modal after animation completes
      setTimeout(() => {
        setModals(prevModals => prevModals.filter(modal => modal.id !== lastModalId));
      }, 300);
    }
  }, [modals]);
  
  // Update an existing modal by ID
  const updateModal = useCallback((id: string, options: Partial<Omit<ModalState, 'isOpen'>>) => {
    setModals(prevModals => 
      prevModals.map(modal => 
        modal.id === id ? { ...modal, ...options } : modal
      )
    );
  }, []);
  
  // Close all open modals
  const closeAllModals = useCallback(() => {
    // Mark all modals as closed
    setModals(prevModals => 
      prevModals.map(modal => ({ ...modal, isOpen: false }))
    );
    
    // Remove all modals after animation completes
    setTimeout(() => {
      setModals([]);
    }, 300);
  }, []);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    modals,
    openModal,
    closeModal,
    updateModal,
    closeAllModals,
  }), [modals, openModal, closeModal, updateModal, closeAllModals]);
  
  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* Render all modals in the stack */}
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          isOpen={modal.isOpen}
          onClose={() => closeModal(modal.id)}
          title={modal.title}
          size={modal.size}
          primaryButtonText={modal.confirmText}
          onPrimaryAction={modal.onConfirm}
          secondaryButtonText={modal.cancelText}
          onSecondaryAction={modal.onCancel}
          zIndex={1050 + modals.indexOf(modal)} // Stack modals with increasing z-index
          testId={`modal-${modal.id}`}
        >
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};

export default ModalProvider;

