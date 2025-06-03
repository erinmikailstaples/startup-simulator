'use client';

import React from 'react';
import { ErrorBoundary, ToastProvider, ModalProvider } from '@/components/common';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ToastProvider position="top-right" maxToasts={5}>
        <AuthProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

