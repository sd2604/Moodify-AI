import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const suggestions = {
  happy: "Your energy feels amazing today ✨ Keep riding this wave!",
  sad: "Take a moment to breathe and slow down 💙 It's okay to feel this way.",
  angry: "Try calming instrumentals to reset your mind 🎧 Take a short break.",
  calm: "You seem balanced and peaceful 🌊 Maintain this clarity.",
  neutral: "Ready for anything. Let the music guide your next move 🎵"
};

const SuggestionCard = ({ currentEmotion }) => {
  const suggestion = suggestions[currentEmotion] || suggestions.neutral;

  return (
    <motion.div 
      className="glass-panel p-6 rounded-3xl"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="font-bebas text-2xl mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-white/70" /> AI INSIGHT
      </h3>

      <div className="relative min-h-[80px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentEmotion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`font-space text-lg text-glow ${`text-gradient-${currentEmotion}`}`}
          >
            {suggestion}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;