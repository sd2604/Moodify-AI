import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      onAnimationComplete={() => {

        setTimeout(() => {
          if (onComplete) onComplete();
        }, 3000);
      }}
    >
      <div className="relative flex flex-col items-center justify-center">

        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full border border-white/10"
          animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full border border-white/20"
          animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />
        

        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 shadow-[0_0_50px_rgba(255,0,255,0.5)] z-10"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 10, repeat: Infinity, ease: "linear" }
          }}
        />


        <motion.h1
          className="mt-10 font-bebas text-5xl tracking-widest text-white text-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          MOODIFY <span className="text-white/50">AI</span>
        </motion.h1>
        <motion.p
          className="mt-4 font-space text-white/50 tracking-widest text-sm uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Analyzing your vibe...
        </motion.p>
      </div>

      <div className="noise-overlay" />
    </motion.div>
  );
};

export default LoadingScreen;
