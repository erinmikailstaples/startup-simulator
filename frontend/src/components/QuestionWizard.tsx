import React, { useState, useEffect, useCallback } from 'react';
import Question from './Question';
import Results from './Results';
import { 
  StartupFormData, 
  StartupAnalysis, 
  getQuestionnaire, 
  submitStartupData, 
  Question as QuestionType, 
  LoadingStatus 
} from '@/lib/api';

// Initial form data
const initialFormData: StartupFormData = {
  idea: '',
  industry: '',
  targetAudience: '',
  problemSolved: '',
  competitiveAdvantage: '',
  businessModel: '',
  fundingNeeds: '',
};

// Field configurations
const fieldConfig: Record<keyof StartupFormData, { 
  maxLength: number; 
  required: boolean; 
  multiline: boolean;
}> = {
  idea: { maxLength: 200, required: true, multiline: true },
  industry: { maxLength: 100, required: true, multiline: false },
  targetAudience: { maxLength: 200, required: true, multiline: true },
  problemSolved: { maxLength: 300, required: true, multiline: true },
  competitiveAdvantage: { maxLength: 300, required: true, multiline: true },
  businessModel: { maxLength: 300, required: true, multiline: true },
  fundingNeeds: { maxLength: 200, required: true, multiline: true },
};

interface ValidationErrors {
  [key: string]: string;
}

const QuestionWizard: React.FC = () => {
  // Core state
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<StartupFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  // API and loading state
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('idle');
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<StartupAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionType[]>([]);
  
  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch questions from API on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const questions = await getQuestionnaire();
        setQuestionsData(questions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please refresh the page.');
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Validate a specific field
  const validateField = useCallback((field: keyof StartupFormData, value: string) => {
    const config = fieldConfig[field];
    
    if (config.required && !value.trim()) {
      return 'This field is required';
    }
    
    if (value.length > config.maxLength) {
      return `Maximum length is ${config.maxLength} characters`;
    }
    
    return '';
  }, []);

  // Validate all fields
  const validateForm = useCallback(() => {
    const errors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const key = field as keyof StartupFormData;
      const error = validateField(key, formData[key]);
      
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  }, [formData, validateField]);

  // Update field values
  const handleChange = (field: keyof StartupFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If field has been touched, validate it on change
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (field: keyof StartupFormData) => {
    setTouchedFields(prev => {
      const newSet = new Set(prev);
      newSet.add(field);
      return newSet;
    });

    const error = validateField(field, formData[field]);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Navigate to next question or submit
  const handleNext = () => {
    // Validate current question before proceeding
    const currentField = getQuestionForStep(step).id as keyof StartupFormData;
    const error = validateField(currentField, formData[currentField]);
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [currentField]: error }));
      setTouchedFields(prev => {
        const newSet = new Set(prev);
        newSet.add(currentField);
        return newSet;
      });
      return;
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
      // Scroll to top when changing questions
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Show confirmation before submitting
      setShowConfirmation(true);
    }
  };

  // Go back to previous question
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      // Scroll to top when changing questions
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateForm()) {
      setShowConfirmation(false);
      return;
    }

    setLoadingStatus('loading');
    setError(null);
    
    try {
      const result = await submitStartupData(formData);
      setAnalysis(result);
      setStep(questions.length); // Move to results page
      setLoadingStatus('success');
    } catch (err: any) {
      setLoadingStatus('error');
      setError(err.message || 'An error occurred while analyzing your startup. Please try again.');
      console.error(err);
    } finally {
      setShowConfirmation(false);
    }
  };

  // Reset the form and start over
  const handleReset = () => {
    setFormData(initialFormData);
    setAnalysis(null);
    setStep(0);
    setValidationErrors({});
    setTouchedFields(new Set());
    setLoadingStatus('idle');
    setError(null);
    setShowConfirmation(false);
    // Scroll to top when resetting
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel submission and close confirmation dialog
  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  // Dynamic questions based on API data or fallback to hardcoded questions
  const questions = questionsData.length > 0 
    ? questionsData.map(q => ({
        ...q,
        value: formData[q.id as keyof StartupFormData] || '',
        onChange: (value: string) => handleChange(q.id as keyof StartupFormData, value),
        onBlur: () => handleBlur(q.id as keyof StartupFormData),
        error: touchedFields.has(q.id) ? validationErrors[q.id] : undefined,
        maxLength: fieldConfig[q.id as keyof StartupFormData]?.maxLength,
      }))
    : [
        {
          id: 'idea',
          question: 'What is your startup idea?',
          description: 'Briefly describe your startup concept in a sentence or two.',
          value: formData.idea,
          onChange: (value: string) => handleChange('idea', value),
          onBlur: () => handleBlur('idea'),
          error: touchedFields.has('idea') ? validationErrors.idea : undefined,
          required: true,
          multiline: true,
          maxLength: 200,
        },
        {
          id: 'industry',
          question: 'What industry does your startup operate in?',
          description: 'E.g., Fintech, Healthcare, E-commerce, SaaS, etc.',
          value: formData.industry,
          onChange: (value: string) => handleChange('industry', value),
          onBlur: () => handleBlur('industry'),
          error: touchedFields.has('industry') ? validationErrors.industry : undefined,
          required: true,
          maxLength: 100,
        },
        // Other questions following same pattern...
        {
          id: 'targetAudience',
          question: 'Who is your target audience?',
          description: 'Describe your ideal customer or user.',
          value: formData.targetAudience,
          onChange: (value: string) => handleChange('targetAudience', value),
          onBlur: () => handleBlur('targetAudience'),
          error: touchedFields.has('targetAudience') ? validationErrors.targetAudience : undefined,
          required: true,
          multiline: true,
          maxLength: 200,
        },
        {
          id: 'problemSolved',
          question: 'What problem does your startup solve?',
          description: 'Explain the pain point or challenge your customers face that your startup addresses.',
          value: formData.problemSolved,
          onChange: (value: string) => handleChange('problemSolved', value),
          onBlur: () => handleBlur('problemSolved'),
          error: touchedFields.has('problemSolved') ? validationErrors.problemSolved : undefined,
          required: true,
          multiline: true,
          maxLength: 300,
        },
        {
          id: 'competitiveAdvantage',
          question: 'What is your competitive advantage?',
          description: 'What makes your solution unique compared to existing alternatives?',
          value: formData.competitiveAdvantage,
          onChange: (value: string) => handleChange('competitiveAdvantage', value),
          onBlur: () => handleBlur('competitiveAdvantage'),
          error: touchedFields.has('competitiveAdvantage') ? validationErrors.competitiveAdvantage : undefined,
          required: true,
          multiline: true,
          maxLength: 300,
        },
        {
          id: 'businessModel',
          question: 'What is your business model?',
          description: 'How will your startup generate revenue? (e.g., subscription, freemium, one-time purchase)',
          value: formData.businessModel,
          onChange: (value: string) => handleChange('businessModel', value),
          onBlur: () => handleBlur('businessModel'),
          error: touchedFields.has('businessModel') ? validationErrors.businessModel : undefined,
          required: true,
          multiline: true,
          maxLength: 300,
        },
        {
          id: 'fundingNeeds',
          question: 'What are your funding needs?',
          description: 'How much capital do you need and what will you use it for?',
          value: formData.fundingNeeds,
          onChange: (value: string) => handleChange('fundingNeeds', value),
          onBlur: () => handleBlur('fundingNeeds'),
          error: touchedFields.has('fundingNeeds') ? validationErrors.fundingNeeds : undefined,
          required: true,
          multiline: true,
          maxLength: 200,
        },
      ];

  // Helper function to get the current question
  const getQuestionForStep = (stepIndex: number) => {
    return questions[stepIndex] || questions[0];
  };

  // Show loading state when fetching questions
  if (questionsLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  // Show results if we have analysis data
  if (step === questions.length && analysis) {
    return <Results analysis={analysis} onReset={handleReset} />;
  }

  const currentQuestion = getQuestionForStep(step);
  const isSubmitStep = step === questions.length - 1;
  const isFieldEmpty = !currentQuestion.value.trim();
  const hasFieldError = !!validationErrors[currentQuestion.id];
  const isNextDisabled = loadingStatus === 'loading' || isFieldEmpty || hasFieldError;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-2xl font-bold mb-2 sm:mb-0">Startup Simulator</h2>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="mr-2">Progress:</span>
            <span className="font-medium">{step + 1}</span>
            <span className="mx-1">/</span>
            <span>{questions.length}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
          ></div>
        </div>
        
        {/* Step indicators */}
        <div className="hidden sm:flex justify-between mt-2">
          {Array.from({ length: questions.length }).map((_, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center ${i <= step ? 'text-blue-600' : 'text-gray-300'}`}
            >
              <div 
                className={`w-4 h-4 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'} mb-1`}
                aria-hidden="true"
              ></div>
              <span className="text-xs">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current question */}
      <Question {...currentQuestion} />

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md" role="alert">
          <div className="font-medium">Error</div>
          <div>{error}</div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-3">
        <button
          onClick={handleBack}
          disabled={step === 0 || loadingStatus === 'loading'}
          className={`px-4 py-2 rounded-md order-2 sm:order-1 ${
            step === 0 || loadingStatus === 'loading'
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300'
          }`}
          aria-label="Go back to previous question"
        >
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`px-4 py-2 rounded-md order-1 sm:order-2 ${
            isNextDisabled
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
          aria-label={isSubmitStep ? "Submit your answers" : "Go to next question"}
        >
          {loadingStatus === 'loading' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : isSubmitStep ? (
            'Submit'
          ) : (
            'Next'
          )}
        </button>
      </div>

      {/* Submission confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit your startup for analysis?</h3>
            <p className="text-gray-600 mb-6">
              Our AI will analyze your startup idea and provide detailed feedback on its viability.
              This process may take a moment to complete.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-2">
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 order-1 sm:order-2"
              >
                Submit for Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionWizard;
