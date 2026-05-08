import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import LoadingScreen from './components/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground';
import CameraFeed from './components/CameraFeed';
import LyricsPanel from './components/LyricsPanel';
import RecommendedSongs from './components/RecommendedSongs';

const emotionToGenreMap = {
  happy: 'dance',
  sad: 'acoustic',
  angry: 'rock',
  calm: 'lo-fi',
  neutral: 'indie',
};

function App() {
  const [loading, setLoading] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setRecommendationsLoading(true);
      try {
        const genre = emotionToGenreMap[currentEmotion] || 'pop';
        const randomOffset = Math.floor(Math.random() * 50);
        const res = await axios.get(
          `https://itunes.apple.com/search?term=${genre}&entity=song&limit=10&offset=${randomOffset}`
        );
        const validSongs = (res.data?.results || []).filter((song) => song.previewUrl);
        setRecommendedSongs(validSongs);
      } catch (err) {
        console.error('Error fetching recommendations', err);
        setRecommendedSongs([]);
      }
      setRecommendationsLoading(false);
    };

    fetchRecommendations();
  }, [currentEmotion]);

  const handleSelectSong = (song) => {
    setCurrentlyPlaying(song);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-inter text-white">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <AnimatedBackground currentEmotion={currentEmotion} />

          <motion.div 
            className="container mx-auto px-4 py-8 h-screen grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="h-full min-h-0">
              <LyricsPanel
                currentlyPlaying={currentlyPlaying}
                setCurrentlyPlaying={setCurrentlyPlaying}
                songs={recommendedSongs}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>

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
                  songs={recommendedSongs}
                  loading={recommendationsLoading}
                  currentlyPlaying={currentlyPlaying}
                  onSelectSong={handleSelectSong}
                  isPlaying={isPlaying}
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
