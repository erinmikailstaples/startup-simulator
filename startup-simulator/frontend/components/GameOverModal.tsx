import React from 'react';
import { motion } from 'framer-motion';

interface GameOverModalProps {
  isOpen: boolean;
  archetype: string;
  startupName: string;
  onClose: () => void;
  onRestart: () => void;
}

export default function GameOverModal({ 
  isOpen, 
  archetype, 
  startupName,
  onClose, 
  onRestart 
}: GameOverModalProps) {
  if (!isOpen) return null;
  
  // Define archetype descriptions
  const archetypeDescriptions: Record<string, string> = {
    "The Hallucination Harvester": "You've mastered the art of confidently stating complete nonsense, and somehow VCs love you for it. Facts are just suggestions to you.",
    "The Buzzword Bluffer": "Why build solid tech when you can throw around terms like 'neural fabric' and 'quantum-inspired synchronization layers'?",
    "The Hype Whisperer": "Your product is mediocre, but your marketing is god-tier. You could sell ice to penguins and call it 'thermal disruption'.",
    "The Prompt Mystic": "You've convinced everyone that your 'proprietary prompt engineering' is worth a $50M valuation. It's just good vibes and wishful thinking.",
    "The Funding Savant": "Your product might be terrible, but your pitch deck? *Chef's kiss*. The bank account doesn't lie.",
    "The VC Whisperer": "You've optimized entirely for investor appeal instead of user value. Your North Star metric is 'how excited does this make rich people?'",
    "The Tech Complexifier": "You've never met a simple problem you couldn't turn into a distributed microservice architecture with blockchain validation.",
    "The Silicon Valley Oracle": "You make confident predictions based on absolutely nothing, and somehow people keep believing you. It's a gift.",
  };

  // Get the description or fallback to a generic one
  const description = archetypeDescriptions[archetype] || 
    "You've created a unique blend of hype, hallucination, and hustle that defies categorization. Silicon Valley trembles.";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-2xl p-6 max-w-md w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 mb-2">
            Your Startup Archetype
          </h2>
          <motion.div
            className="text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {archetype}
          </motion.div>
          <motion.div
            className="text-lg text-indigo-200 italic mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {description}
          </motion.div>
        </div>
        
        <motion.div
          className="bg-black/30 p-4 rounded-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center mb-2">
            <span className="text-yellow-400 font-medium">Congratulations!</span>
          </div>
          <p className="text-white text-sm">
            <span className="font-bold">{startupName}</span> has officially joined the ranks of overhyped AI startups. 
            Your journey from "idea on a napkin" to "pitch deck with fabricated metrics" is complete.
          </p>
        </motion.div>
        
        <div className="flex flex-col space-y-3">
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3 px-4 rounded hover:from-pink-600 hover:to-yellow-600 transition-all"
            onClick={onRestart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Start New Startup
          </motion.button>
          
          <motion.button
            className="bg-indigo-800/50 text-indigo-200 py-2 px-4 rounded hover:bg-indigo-700/50 transition-all"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
} 