import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground';
import CameraFeed from './components/CameraFeed';
import LyricsPanel from './components/LyricsPanel';
import RecommendedSongs from './components/RecommendedSongs';

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
            className="container mx-auto px-4 py-8 h-screen grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Left Panel: Lyrics */}
            <div className="h-full min-h-0">
              <LyricsPanel currentlyPlaying={currentlyPlaying} />
            </div>

            {/* Right Panel: Scanner + Recommended Songs */}
            <div className="h-full min-h-0 flex flex-col gap-6">
              <div className="flex-[3] min-h-[320px]">
                <CameraFeed
                  currentEmotion={currentEmotion}
                  setCurrentEmotion={setCurrentEmotion}
                />
              </div>
              <div className="flex-[2] min-h-[220px]">
                <RecommendedSongs
                  currentEmotion={currentEmotion}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default App;
