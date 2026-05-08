import React from 'react';
import { motion } from 'framer-motion';

const emotionVisuals = {
  happy: {
    gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 128, 0.15), rgba(0, 0, 0, 1))',
    blob1: '#ff0080',
    blob2: '#7928ca',
  },
  sad: {
    gradient: 'radial-gradient(circle at 50% 50%, rgba(0, 102, 255, 0.15), rgba(0, 0, 0, 1))',
    blob1: '#0066ff',
    blob2: '#00ccff',
  },
  angry: {
    gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 20, 20, 0.15), rgba(0, 0, 0, 1))',
    blob1: '#ff1414',
    blob2: '#ff8a00',
  },
  calm: {
    gradient: 'radial-gradient(circle at 50% 50%, rgba(0, 204, 255, 0.15), rgba(0, 0, 0, 1))',
    blob1: '#00ccff',
    blob2: '#00ffcc',
  },
  neutral: {
    gradient: 'radial-gradient(circle at 50% 50%, rgba(128, 128, 128, 0.15), rgba(0, 0, 0, 1))',
    blob1: '#808080',
    blob2: '#4a4a4a',
  },
};

const AnimatedBackground = ({ currentEmotion }) => {
  const selectedEmotionVisual = emotionVisuals[currentEmotion] || emotionVisuals.neutral;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
      <motion.div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{ background: selectedEmotionVisual.gradient }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        style={{ backgroundColor: selectedEmotionVisual.blob1 }}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-15"
        style={{ backgroundColor: selectedEmotionVisual.blob2 }}
        animate={{
          x: [0, -60, 60, 0],
          y: [0, 60, -60, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="noise-overlay" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.8)`
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
        animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default AnimatedBackground;
