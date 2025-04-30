import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [startupName, setStartupName] = useState('');
  const [mission, setMission] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    improvedName?: string;
    improvedMission?: string;
    decision?: {
      funded: boolean;
      amount?: string;
      valuation?: string;
      feedback: string;
    };
    archetype?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!startupName.trim()) {
      setError('Please enter a startup name');
      return;
    }
    if (!mission.trim()) {
      setError('Please enter a mission statement');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call the backend directly with default stack configuration
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: startupName,
          mission: mission,
          prompt: "Evaluate this startup idea", // Simple default prompt
          stack: {
            model_name: "gpt-4-turbo",
            temperature: 0.8,
            max_tokens: 1000,
            tools_selected: [
              "buzzword_biography_generator", 
              "tech_complexifier", 
              "tam_identifier", 
              "founder_quotes"
            ],
            architecture_description: "A distributed neural computing architecture with real-time feedback loops"
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data); // Add logging to debug
      
      setResult({
        improvedName: data.startup_name || data.name,
        improvedMission: data.strategy?.vision || mission,
        decision: data.decision,
        archetype: data.archetype
      });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setResult(null);
    setStartupName('');
    setMission('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <Head>
        <title>Sh*tty Startup Simulator™</title>
        <meta name="description" content="Raise $10M. Build on vibes. Deploy on Friday." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
              Sh*tty Startup Simulator™
            </h1>
            <p className="text-xl italic mb-8">
              Raise $10M. Build on vibes. Deploy on Friday.
            </p>
            <div className="bg-indigo-800/50 p-6 rounded-lg mb-8 shadow-xl">
              <p className="mb-4">
                Welcome, aspiring tech founder! You're one pitch deck away from 
                disrupting an industry that doesn't need disrupting.
              </p>
              <p>
                Enter your startup's name and mission below, and our AI will evaluate 
                whether your idea is worthy of funding (or at least worthy of hype).
              </p>
            </div>
          </div>

          {/* Results Section (shows after submission) */}
          {result ? (
            <div className="bg-black/30 p-8 rounded-xl shadow-2xl mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
                Startup Evaluation Results
              </h2>
              
              {/* Improved Name */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pink-400 mb-1">Improved Name:</h3>
                <p className="text-xl font-bold">{result.improvedName}</p>
              </div>
              
              {/* Improved Mission */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pink-400 mb-1">Improved Vision:</h3>
                <p className="bg-black/40 p-4 rounded border border-indigo-600">
                  {result.improvedMission}
                </p>
              </div>
              
              {/* Funding Decision */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pink-400 mb-1">Investor Decision:</h3>
                <div className={`p-4 rounded-lg ${result.decision?.funded ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
                  <p className="text-xl font-bold mb-2">
                    {result.decision?.funded ? '💰 FUNDED!' : '❌ REJECTED'}
                    {result.decision?.funded && result.decision?.amount && ` - ${result.decision.amount}`}
                  </p>
                  <p>{result.decision?.feedback}</p>
                  {result.decision?.funded && result.decision?.valuation && (
                    <p className="mt-2 text-green-400">Valuation: {result.decision.valuation}</p>
                  )}
                </div>
              </div>
              
              {/* Archetype */}
              {result.archetype && (
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-pink-400 mb-1">Your Startup Archetype:</h3>
                  <p className="text-2xl font-bold text-yellow-300">{result.archetype}</p>
                </div>
              )}
              
              {/* Start Over Button */}
              <div className="text-center mt-8">
                <button
                  onClick={handleStartOver}
                  className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded transition-all duration-200"
                >
                  Start Over
                </button>
              </div>
            </div>
          ) : (
            /* Startup Form */
            <form onSubmit={handleSubmit} className="bg-black/30 p-8 rounded-xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Start Your <span className="text-yellow-400">Disruptive</span> Journey
              </h2>
              
              {/* Error message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}
              
              {/* Startup name */}
              <div className="mb-6">
                <label htmlFor="startupName" className="block mb-2 font-medium">
                  Startup Name<span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  id="startupName"
                  placeholder="e.g., NeuralDreams.io, Zynthe, or PromptSquad"
                  className="w-full bg-black/40 border border-indigo-600 p-3 rounded text-white placeholder-indigo-300/50"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  required
                />
                <p className="text-xs mt-1 text-indigo-300/70">
                  Pro tip: Add .ai or .io to sound more fundable
                </p>
              </div>
              
              {/* Mission statement */}
              <div className="mb-8">
                <label htmlFor="mission" className="block mb-2 font-medium">
                  Mission Statement<span className="text-pink-400">*</span>
                </label>
                <textarea
                  id="mission"
                  placeholder="e.g., Revolutionizing human potential through AI-powered mindfulness enhancement"
                  className="w-full bg-black/40 border border-indigo-600 p-3 rounded text-white placeholder-indigo-300/50 h-24"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  required
                />
                <p className="text-xs mt-1 text-indigo-300/70">
                  Be vague but inspirational. Mention "paradigm shift" for bonus points.
                </p>
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Evaluating your startup...' : 'Evaluate My Startup'}
              </button>
            </form>
          )}
          
          {/* Disclaimer */}
          <div className="mt-8 text-center text-sm text-indigo-300/70">
            <p>
              This app is satire. Any resemblance to real AI startups is completely intentional.
            </p>
            <p className="mt-2">
              Built with FastAPI, Next.js, and
              <span className="line-through mx-1">delusion</span>
              <span className="italic">disruptive thinking</span>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 