'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks';
import { API_CONFIG } from '@/config';
import { useToast } from '@/components/common';

// Load environment variables
const ENABLE_AUTH = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';

// Define types for user and context
interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string }) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>;
}

// Mock user for development
const MOCK_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  emailVerified: true,
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: ENABLE_AUTH ? null : MOCK_USER, // Auto-authenticate if auth is disabled
  loading: false,
  isAuthenticated: !ENABLE_AUTH, // Auto-authenticate if auth is disabled
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  sendVerificationEmail: async () => {},
  deleteAccount: async () => {},
  resetPassword: async () => {},
  confirmPasswordReset: async () => {},
});

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Comprehensive Auth provider with local storage and toast notifications
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('auth-user', ENABLE_AUTH ? null : MOCK_USER);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  
  // Authentication is bypassed in local development unless explicitly enabled
  const isAuthenticated = !ENABLE_AUTH || (user !== null);

  // Check if token is valid on initial load
  useEffect(() => {
    const validateSession = async () => {
      if (!user || !ENABLE_AUTH) return;
      
      try {
        setLoading(true);
        // This would be an actual API call to validate the token
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/auth/validate`, {
          headers: {
            Authorization: `Bearer ${user.id}` // Using id as a token for simplicity
          }
        });
        
        if (!response.ok) {
          // Token is invalid, log the user out
          setUser(null);
          toast({
            title: 'Session Expired',
            description: 'Your session has expired. Please log in again.',
            type: 'warning',
          });
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to validate session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    validateSession();
  }, [setUser, toast, user, router]);

  // Login function with toast notifications
  const login = async (email: string, password: string) => {
    if (!ENABLE_AUTH) return; // Skip if auth is disabled
    
    setLoading(true);
    try {
      // This would be an actual API call
      // For demo purposes, we're simulating a successful login
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Simulate a successful login with a mock user
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        emailVerified: true
      };
      
      setUser(mockUser);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${mockUser.name || email}!`,
        type: 'success',
      });
      
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An error occurred during login',
        type: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function with toast notifications
  const register = async (name: string, email: string, password: string) => {
    if (!ENABLE_AUTH) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        emailVerified: false
      };
      
      setUser(mockUser);
      
      toast({
        title: 'Registration Successful',
        description: `Welcome, ${name || email}!`,
        type: 'success',
      });
      
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        type: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function with toast notifications
  const logout = async () => {
    if (!ENABLE_AUTH) return;
    
    setLoading(true);
    try {
      // This would be an actual API call to invalidate the session
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      setUser(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
        type: 'success',
      });
      
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the user data even if the API call fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Profile update function with toast notifications
  const updateProfile = async (data: { name?: string }) => {
    if (!ENABLE_AUTH || !user) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated',
        type: 'success',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'An error occurred while updating your profile',
        type: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send verification email function with toast notifications
  const sendVerificationEmail = async () => {
    if (!ENABLE_AUTH || !user) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email to verify your account',
        type: 'success',
      });
    } catch (error) {
      console.error('Send verification email error:', error);
      toast({
        title: 'Failed to Send Verification Email',
        description: error instanceof Error ? error.message : 'An error occurred while sending the verification email',
        type: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Account deletion function with toast notifications
  const deleteAccount = async () => {
    if (!ENABLE_AUTH || !user) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      setUser(null);
      
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted',
        type: 'success',
      });
      
      router.push('/login');
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'An error occurred while deleting your account',
        type: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Password reset request function with toast notifications
  const resetPassword = async (email: string) => {
    if (!ENABLE_AUTH) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for instructions to reset your password',
        type: 'success',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Password Reset Failed',
        description: error instanceof Error ? error.message : 'An error occurred while requesting a password reset',
        type: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Password reset confirmation function with toast notifications
  const confirmPasswordReset = async (token: string, newPassword: string) => {
    if (!ENABLE_AUTH) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been successfully reset',
        type: 'success',
      });
      
      router.push('/login');
    } catch (error) {
      console.error('Confirm password reset error:', error);
      toast({
        title: 'Password Reset Failed',
        description: error instanceof Error ? error.message : 'An error occurred while resetting your password',
        type: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    sendVerificationEmail,
    deleteAccount,
    resetPassword,
    confirmPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
