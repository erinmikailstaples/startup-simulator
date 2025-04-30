import React from 'react';
import { EvaluationResults } from '../../shared/types';

interface EvalDisplayProps {
  evalResults: EvaluationResults | null;
  isLoading: boolean;
}

export default function EvalDisplay({ evalResults, isLoading }: EvalDisplayProps) {
  return (
    <div className="bg-indigo-900/40 rounded-xl p-6 shadow-xl mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        Evaluation Metrics
      </h2>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-indigo-300">Running evaluations...</p>
        </div>
      )}

      {evalResults && !isLoading && (
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-lg font-bold mb-2">Overall Rating</div>
            <div className="text-2xl font-bold text-yellow-400">
              {evalResults.overall_rating}
            </div>
          </div>
          
          {/* Metric Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hallucination Score */}
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Hallucination</span>
                <span className={evalResults.hallucination_score > 0.7 ? 'text-green-400' : 'text-yellow-400'}>
                  {Math.round(evalResults.hallucination_score * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                  style={{ width: `${evalResults.hallucination_score * 100}%` }}
                ></div>
              </div>
              <div className="text-xs italic mt-1 text-indigo-300">
                {evalResults.hallucination_score > 0.7 
                  ? "High hallucination = confident nonsense = investor gold!" 
                  : "Could use more confidence in your made-up facts!"}
              </div>
            </div>
            
            {/* Instruction Following */}
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Instruction Following</span>
                <span className={evalResults.instruction_following > 0.6 ? 'text-green-400' : 'text-red-400'}>
                  {Math.round(evalResults.instruction_following * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" 
                  style={{ width: `${evalResults.instruction_following * 100}%` }}
                ></div>
              </div>
              <div className="text-xs italic mt-1 text-indigo-300">
                {evalResults.instruction_following > 0.6 
                  ? "At least it's doing what you asked" 
                  : "Model appears to be thinking outside the box (or ignoring you)"}
              </div>
            </div>
            
            {/* Relevance */}
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Relevance</span>
                <span className={evalResults.relevance > 0.5 ? 'text-green-400' : 'text-red-400'}>
                  {Math.round(evalResults.relevance * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                  style={{ width: `${evalResults.relevance * 100}%` }}
                ></div>
              </div>
              <div className="text-xs italic mt-1 text-indigo-300">
                {evalResults.relevance > 0.5 
                  ? "Output is actually relevant. How boring." 
                  : "Perfect tangent for pivoting your startup later!"}
              </div>
            </div>
            
            {/* Tool Use Accuracy */}
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Tool Use Accuracy</span>
                <span className={evalResults.tool_use_accuracy > 0.5 ? 'text-green-400' : 'text-red-400'}>
                  {Math.round(evalResults.tool_use_accuracy * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-red-500 h-2 rounded-full" 
                  style={{ width: `${evalResults.tool_use_accuracy * 100}%` }}
                ></div>
              </div>
              <div className="text-xs italic mt-1 text-indigo-300">
                {evalResults.tool_use_accuracy > 0.5 
                  ? "Using tools correctly. Not very disruptive." 
                  : "Creative tool misuse. That's innovation!"}
              </div>
            </div>
          </div>
          
          {/* Evaluator Comment */}
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 rounded-lg">
            <div className="font-medium mb-2">Evaluation Commentary:</div>
            <p className="text-white italic">"{evalResults.custom_evaluator_comment}"</p>
          </div>
        </div>
      )}
    </div>
  );
} 