'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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
export const useAuth = () => useContext(AuthContext);

// Simplified Auth provider for development
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(ENABLE_AUTH ? null : MOCK_USER);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Authentication is bypassed in local development unless explicitly enabled
  const isAuthenticated = !ENABLE_AUTH || (user !== null);

  // Login function (simplified for local development)
  const login = async (email: string, password: string) => {
    if (!ENABLE_AUTH) return; // Skip if auth is disabled
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setUser(MOCK_USER);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // All other auth functions are simplified for local development
  const register = async (name: string, email: string, password: string) => {
    if (!ENABLE_AUTH) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser({...MOCK_USER, name, email});
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!ENABLE_AUTH) return;
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (data: { name?: string }) => {
    if (!ENABLE_AUTH || !user) return;
    setUser({...user, ...data});
  };

  const sendVerificationEmail = async () => {
    console.log('Verification email would be sent in production');
  };

  const deleteAccount = async () => {
    if (!ENABLE_AUTH) return;
    setUser(null);
    router.push('/login');
  };

  const resetPassword = async (email: string) => {
    console.log('Password reset email would be sent in production');
  };

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    console.log('Password would be reset in production');
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

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks';
import { API_CONFIG } from '@/config';
import { useToast } from '@/components/common';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('auth-user', null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Check if token is valid on initial load
  useEffect(() => {
    const validateSession = async () => {
      if (!user) return;
      
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
        }
      } catch (error) {
        console.error('Failed to validate session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    validateSession();
  }, [setUser, toast, user]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // This would be an actual API call
      // For demo purposes, we're simulating a successful login
      // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      
      // const data = await response.json();
      
      // Simulate a successful login with a mock user
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${mockUser.name || email}!`,
        type: 'success',
      });
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

  const logout = async () => {
    try {
      setLoading(true);
      
      // This would be an actual API call to invalidate the session
      // await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/auth/logout`, {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${user?.id}`
      //   }
      // });
      
      setUser(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
        type: 'success',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the user data even if the API call fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      
      // This would be an actual API call
      // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/auth/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }
      
      // const data = await response.json();
      
      // Simulate a successful registration with a mock user
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name
      };
      
      setUser(mockUser);
      
      toast({
        title: 'Registration Successful',
        description: `Welcome, ${name || email}!`,
        type: 'success',
      });
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

