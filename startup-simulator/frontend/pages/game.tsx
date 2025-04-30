import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import StackBuilder from '../components/StackBuilder';
import PromptTerminal from '../components/PromptTerminal';
import EvalDisplay from '../components/EvalDisplay';
import InvestorFeedback from '../components/InvestorFeedback';
import { StartupInput, StackConfiguration, SimulationResult } from '../../shared/types';

export default function Game() {
  const router = useRouter();
  const [startupName, setStartupName] = useState('');
  const [mission, setMission] = useState('');
  const [stack, setStack] = useState<StackConfiguration | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');

  // Load startup info from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem('startupName');
    const storedMission = localStorage.getItem('mission');
    
    if (!storedName || !storedMission) {
      // Redirect back to landing page if info is missing
      router.push('/');
      return;
    }
    
    setStartupName(storedName);
    setMission(storedMission);
  }, [router]);

  // Handle stack configuration
  const handleStackConfigured = (stackConfig: StackConfiguration) => {
    setStack(stackConfig);
    setCurrentStep(2);
  };

  // Handle prompt submission
  const handlePromptSubmit = async (promptText: string) => {
    if (!stack) {
      setError('You need to configure your tech stack first!');
      return;
    }
    
    setPrompt(promptText);
    setIsLoading(true);
    setError('');
    
    try {
      // Create the simulation request
      const simulationInput: StartupInput = {
        name: startupName,
        mission: mission,
        prompt: promptText
      };
      
      // Make the API call
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simulationInput),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      // Parse the result
      const simulationResult: SimulationResult = await response.json();
      setResult(simulationResult);
      setCurrentStep(3);
    } catch (err) {
      setError(`Error running simulation: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the game
  const handleStartOver = () => {
    setStack(null);
    setPrompt('');
    setResult(null);
    setCurrentStep(1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <Head>
        <title>{startupName || 'Startup'} Simulator - Sh*tty Startup Simulator™</title>
        <meta name="description" content="Raise $10M. Build on vibes. Deploy on Friday." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header with startup info */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
            {startupName || 'Your Startup'}
          </h1>
          <p className="text-lg text-indigo-300 italic mb-2">
            {mission || 'Revolutionizing something with AI'}
          </p>
          <div className="flex justify-center space-x-2">
            <span className="bg-pink-900/40 text-pink-300 text-xs px-2 py-1 rounded">
              Series Pre-Seed
            </span>
            <span className="bg-indigo-900/40 text-indigo-300 text-xs px-2 py-1 rounded">
              Stage: {currentStep === 1 ? 'Stack Building' : currentStep === 2 ? 'Demo' : 'Investor Pitch'}
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-6 mx-auto max-w-3xl">
            {error}
          </div>
        )}

        {/* Step indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-pink-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-pink-400 text-black' : 'bg-gray-700 text-gray-300'}`}>1</div>
              <div className="text-xs mt-1">Build Stack</div>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-pink-400' : 'bg-gray-700'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-pink-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-pink-400 text-black' : 'bg-gray-700 text-gray-300'}`}>2</div>
              <div className="text-xs mt-1">Demo Output</div>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-pink-400' : 'bg-gray-700'}`}></div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-pink-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-pink-400 text-black' : 'bg-gray-700 text-gray-300'}`}>3</div>
              <div className="text-xs mt-1">Get Funded</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-3xl mx-auto">
          {/* Stack Builder */}
          <StackBuilder onStackConfigured={handleStackConfigured} />
          
          {/* Prompt Terminal */}
          {(currentStep >= 2 || stack) && (
            <PromptTerminal 
              onSubmitPrompt={handlePromptSubmit} 
              outputContent={result?.output || null}
              isLoading={isLoading}
            />
          )}
          
          {/* Evaluation Display */}
          {(currentStep >= 3 || result) && (
            <EvalDisplay 
              evalResults={result?.evals || null} 
              isLoading={isLoading}
            />
          )}
          
          {/* Investor Feedback */}
          {(currentStep >= 3 || result) && (
            <InvestorFeedback 
              decision={result?.decision || null} 
              isLoading={isLoading}
            />
          )}

          {/* Archetype (shown when complete) */}
          {result && (
            <div className="bg-black/40 p-6 rounded-xl text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-yellow-400">Your Startup Archetype</h2>
              <div className="text-3xl font-bold mb-4">{result.archetype}</div>
              <button 
                onClick={handleStartOver}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded transition-all duration-200"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 