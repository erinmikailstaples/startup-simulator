import React, { useState } from 'react';

interface PromptTerminalProps {
  onSubmitPrompt: (prompt: string) => void;
  outputContent: string | null;
  isLoading: boolean;
}

export default function PromptTerminal({ onSubmitPrompt, outputContent, isLoading }: PromptTerminalProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    // Clear error if exists
    setError('');
    
    // Submit prompt to parent component
    onSubmitPrompt(prompt);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl mb-8">
      {/* Terminal Header */}
      <div className="bg-gray-800 p-3 flex items-center border-b border-gray-700">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-sm font-mono tracking-wide">
          {outputContent ? 'demo-output.txt' : 'prompt-terminal'}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center text-green-400 font-mono mb-1">
            <span className="mr-2">$</span>
            <span className="mr-2">prompt</span>
            <span className="mr-2 text-purple-400">&gt;</span>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex">
            <textarea
              placeholder="Enter your prompt for the LLM..."
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white font-mono"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading || !!outputContent}
            />
          </div>
          
          {/* Submit Button */}
          {!outputContent && (
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 bg-green-700 hover:bg-green-600 text-white font-mono py-2 px-4 rounded transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Run Demo'}
            </button>
          )}
        </form>

        {/* Output Display */}
        {isLoading && (
          <div className="font-mono text-yellow-400 p-4 border border-gray-700 rounded">
            <div className="flex items-start mb-2">
              <span className="mr-2">$</span>
              <span className="mr-2">output</span>
              <span className="mr-2 text-purple-400">&gt;</span>
            </div>
            <div className="pl-10">
              <div className="inline-block">
                Processing
                <span className="animate-pulse">.</span>
                <span className="animate-pulse delay-100">.</span>
                <span className="animate-pulse delay-200">.</span>
              </div>
            </div>
          </div>
        )}

        {outputContent && !isLoading && (
          <div className="font-mono text-green-400 p-4 border border-gray-700 rounded">
            <div className="flex items-start mb-2">
              <span className="mr-2">$</span>
              <span className="mr-2">output</span>
              <span className="mr-2 text-purple-400">&gt;</span>
            </div>
            <div className="pl-10 whitespace-pre-wrap text-white">
              {outputContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 