'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner, toast } from '@/components/common';
import { API_CONFIG } from '@/config';

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenChecking, setTokenChecking] = useState(true);
  
  const router = useRouter();
  const { token } = params;

  // Verify token validity on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setTokenChecking(true);
        
        // This would be an actual API call in a real application
        // For demo purposes, we're simulating token validation
        // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/auth/verify-reset-token/${token}`);
        // const isValid = await response.json();
        // setTokenValid(isValid.valid);

        // Simulate a delay for the API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple mock validation - tokens that contain 'valid' are considered valid
        // In a real app, this would be a proper validation against the backend
        setTokenValid(token.includes('valid'));
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
      } finally {
        setTokenChecking(false);
      }
    };

    verifyToken();
  }, [token]);

  // Password strength validation
  const validatePasswordStrength = (password: string) => {
    // At least 8 characters, with at least one lowercase, one uppercase, one number, and one special character
    const hasMinLength = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasMinLength, hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    return {
      isStrong: strength >= 4, // At least 4 of the 5 criteria should be met
      message: strength < 4 
        ? 'Password should be at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters' 
        : ''
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const { isStrong, message } = validatePasswordStrength(password);
      if (!isStrong) {
        newErrors.password = message;
      }
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // This would be an actual API call in a real application
      // For demo purposes, we're simulating a successful password reset
      // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/auth/reset-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to reset password');
      // }
      
      // Simulate a successful API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been successfully reset. You can now log in with your new password.',
        type: 'success',
      });
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Reset Failed',
        description: error instanceof Error ? error.message : 'An error occurred while resetting your password',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking token
  if (tokenChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <LoadingSpinner size="large" color="primary" />
          <p className="mt-2 text-center text-sm text-gray-600">
            Verifying your reset link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Invalid or Expired Link
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The password reset link you clicked is invalid or has expired.
            </p>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/forgot-password')}
              className="group relative w-64 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Request a new link
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

