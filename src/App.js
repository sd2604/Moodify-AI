import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground';
import CameraFeed from './components/CameraFeed';
import MusicPlayer from './components/MusicPlayer';
import LyricsPanel from './components/LyricsPanel';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden font-inter text-white">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <AnimatedBackground currentEmotion={currentEmotion} />
          
          {/* Main Dashboard Layout */}
          <motion.div 
            className="container mx-auto px-4 py-8 h-screen flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Left Panel: Emotion Detection */}
            <div className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col gap-6">
              <CameraFeed 
                currentEmotion={currentEmotion} 
                setCurrentEmotion={setCurrentEmotion} 
              />
            </div>

            {/* Center Panel: Music Player & Lyrics */}
            <div className="w-full md:w-2/3 lg:w-3/4 h-full flex flex-col gap-6 overflow-y-auto pb-8">
              <MusicPlayer 
                currentEmotion={currentEmotion}
                currentlyPlaying={currentlyPlaying}
                setCurrentlyPlaying={setCurrentlyPlaying}
              />
              <LyricsPanel currentlyPlaying={currentlyPlaying} />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default App;
