'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Modal, useModal, toast } from '@/components/common';

export default function AccountManagement() {
  const { user, deleteAccount, sendVerificationEmail } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const { openModal } = useModal();

  const handleVerificationEmail = async () => {
    try {
      setIsSendingVerification(true);
      await sendVerificationEmail();
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setIsSendingVerification(false);
    }
  };

  const confirmAccountDeletion = () => {
    openModal({
      title: 'Delete Account',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <p className="text-red-600 font-medium">
            All your data will be permanently deleted.
          </p>
        </div>
      ),
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      onConfirm: handleAccountDeletion,
    });
  };

  const handleAccountDeletion = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      toast.success('Account successfully deleted.');
      // Redirect will be handled by auth state change
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Account Management</h2>
      
      {/* Email Verification */}
      {!user?.emailVerified && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Email Verification</h3>
          <p className="text-gray-600 mb-4">
            Please verify your email address to access all features.
          </p>
          <button
            onClick={handleVerificationEmail}
            disabled={isSendingVerification}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isSendingVerification ? 'Sending...' : 'Send Verification Email'}
          </button>
        </div>
      )}
      
      {/* Account Deletion */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-red-600 mb-2">Delete Account</h3>
        <p className="text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={confirmAccountDeletion}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400"
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}

