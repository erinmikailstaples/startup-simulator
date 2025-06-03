import React, { useState, useEffect } from 'react';
import { QuestionProps } from '@/types';

/**
 * Question component for rendering individual questions in the startup questionnaire
 * Includes support for single-line and multi-line inputs, validation, and accessibility
 */
const Question: React.FC<QuestionProps> = ({
  id,
  question,
  description,
  value,
  onChange,
  placeholder = "Type your answer here...",
  multiline = false,
  required = false,
  error,
  onBlur,
  maxLength,
  className = "",
}) => {
  // Local state for validation and focus
  const [isTouched, setIsTouched] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(error);
  const [charCount, setCharCount] = useState(value.length);
  const [isFocused, setIsFocused] = useState(false);

  // Update character count when value changes
  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  // Validate input on blur or when value changes
  useEffect(() => {
    if (isTouched) {
      validateInput(value);
    }
  }, [value, isTouched]);

  // Handle input validation
  const validateInput = (inputValue: string) => {
    if (required && !inputValue.trim()) {
      setLocalError('This field is required');
    } else if (maxLength && inputValue.length > maxLength) {
      setLocalError(`Input exceeds maximum length of ${maxLength} characters`);
    } else {
      setLocalError(undefined);
    }
  };

  // Handle blur event
  const handleBlur = () => {
    setIsTouched(true);
    setIsFocused(false);
    validateInput(value);
    if (onBlur) onBlur();
  };

  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Determine border color based on state
  const getBorderStyles = () => {
    if (localError || error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (isFocused) return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-lg font-medium text-gray-900">
          {question}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        
        {maxLength && (
          <span className={`text-xs ${charCount > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-gray-500 mb-2 text-sm" id={`${id}-description`}>
          {description}
        </p>
      )}
      
      {multiline ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          rows={4}
          aria-invalid={!!localError || !!error}
          aria-describedby={description ? `${id}-description` : undefined}
          aria-required={required}
          className={`w-full px-4 py-2 border rounded-lg transition-colors ${getBorderStyles()} ${(localError || error) ? 'bg-red-50' : 'bg-white'}`}
          data-testid={`question-${id}`}
          maxLength={maxLength ? maxLength + 10 : undefined} // Allow slightly over limit for better UX
        />
      ) : (
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          aria-invalid={!!localError || !!error}
          aria-describedby={description ? `${id}-description` : undefined}
          aria-required={required}
          className={`w-full px-4 py-2 border rounded-lg transition-colors ${getBorderStyles()} ${(localError || error) ? 'bg-red-50' : 'bg-white'}`}
          data-testid={`question-${id}`}
          maxLength={maxLength ? maxLength + 10 : undefined} // Allow slightly over limit for better UX
        />
      )}
      
      {(localError || error) && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`} role="alert">
          {localError || error}
        </p>
      )}
    </div>
  );
};

export default Question;
