'use client';

import React from 'react';

// Animation type options
export type AnimationType = 'spinner' | 'pulse' | 'dots';

// Size variant options
export type SizeVariant = 'small' | 'medium' | 'large';

// Color options using Tailwind classes
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

// Props interface for the LoadingSpinner component
export interface LoadingSpinnerProps {
  /**
   * The animation style to use
   * @default 'spinner'
   */
  animation?: AnimationType;

  /**
   * The size of the spinner
   * @default 'medium'
   */
  size?: SizeVariant;

  /**
   * The color theme of the spinner
   * @default 'primary'
   */
  color?: ColorVariant;

  /**
   * Optional loading text to display
   */
  text?: string;

  /**
   * Whether to center the spinner in its container
   * @default true
   */
  centered?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Optional test ID for testing
   */
  testId?: string;
}

/**
 * Get the size class based on the size variant
 */
const getSizeClass = (size: SizeVariant): string => {
  switch (size) {
    case 'small':
      return 'h-4 w-4';
    case 'large':
      return 'h-12 w-12';
    case 'medium':
    default:
      return 'h-8 w-8';
  }
};

/**
 * Get the text size class based on the size variant
 */
const getTextSizeClass = (size: SizeVariant): string => {
  switch (size) {
    case 'small':
      return 'text-xs';
    case 'large':
      return 'text-lg';
    case 'medium':
    default:
      return 'text-sm';
  }
};

/**
 * Get the color class based on the color variant
 */
const getColorClass = (color: ColorVariant): string => {
  switch (color) {
    case 'secondary':
      return 'text-purple-600';
    case 'success':
      return 'text-green-600';
    case 'danger':
      return 'text-red-600';
    case 'warning':
      return 'text-yellow-600';
    case 'info':
      return 'text-cyan-600';
    case 'light':
      return 'text-gray-300';
    case 'dark':
      return 'text-gray-800';
    case 'primary':
    default:
      return 'text-blue-600';
  }
};

/**
 * Spinner Animation Component
 */
const SpinnerAnimation: React.FC<{
  size: SizeVariant;
  colorClass: string;
}> = ({ size, colorClass }) => {
  const sizeClass = getSizeClass(size);
  
  return (
    <svg 
      className={`animate-spin ${sizeClass} ${colorClass}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

/**
 * Pulse Animation Component
 */
const PulseAnimation: React.FC<{
  size: SizeVariant;
  colorClass: string;
}> = ({ size, colorClass }) => {
  const sizeClass = getSizeClass(size);
  
  return (
    <div className={`animate-pulse ${sizeClass} ${colorClass} rounded-full bg-current`} aria-hidden="true"></div>
  );
};

/**
 * Dots Animation Component
 */
const DotsAnimation: React.FC<{
  size: SizeVariant;
  colorClass: string;
}> = ({ size, colorClass }) => {
  const dotSize = size === 'small' ? 'h-1 w-1' : size === 'medium' ? 'h-2 w-2' : 'h-3 w-3';
  
  return (
    <div className="flex space-x-1" aria-hidden="true">
      <div className={`${dotSize} ${colorClass} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${dotSize} ${colorClass} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      <div className={`${dotSize} ${colorClass} rounded-full animate-bounce`} style={{ animationDelay: '600ms' }}></div>
    </div>
  );
};

/**
 * LoadingSpinner Component
 * 
 * A versatile loading spinner with multiple animation styles, sizes, and colors.
 * Includes accessibility features and optional loading text.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  animation = 'spinner',
  size = 'medium',
  color = 'primary',
  text,
  centered = true,
  className = '',
  testId = 'loading-spinner',
}) => {
  const colorClass = getColorClass(color);
  const textSizeClass = getTextSizeClass(size);
  const containerClass = centered ? 'flex flex-col items-center justify-center' : 'flex flex-col items-start';
  
  // Render the appropriate animation based on the animation prop
  const renderAnimation = () => {
    switch (animation) {
      case 'pulse':
        return <PulseAnimation size={size} colorClass={colorClass} />;
      case 'dots':
        return <DotsAnimation size={size} colorClass={colorClass} />;
      case 'spinner':
      default:
        return <SpinnerAnimation size={size} colorClass={colorClass} />;
    }
  };
  
  return (
    <div 
      className={`${containerClass} ${className}`}
      role="status"
      aria-live="polite"
      data-testid={testId}
    >
      {renderAnimation()}
      
      {text && (
        <span className={`mt-2 ${colorClass} ${textSizeClass}`}>
          {text}
        </span>
      )}
      
      <span className="sr-only">Loading{text ? `: ${text}` : ''}</span>
    </div>
  );
};

export default LoadingSpinner;

