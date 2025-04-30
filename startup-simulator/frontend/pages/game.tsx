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
      // Create the simulation request with stack configuration included
      const simulationInput = {
        name: startupName,
        mission: mission,
        prompt: promptText,
        stack: stack // Include the stack configuration for the agents
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

  useEffect(() => {
    // Redirect to the main page
    router.push('/');
  }, [router]);
  
  return null; // No UI needed for redirect page
} 