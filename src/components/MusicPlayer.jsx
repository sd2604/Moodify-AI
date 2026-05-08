import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Disc3, Music, Heart } from 'lucide-react';


const emotionToGenreMap = {
  happy: 'dance',
  sad: 'acoustic',
  angry: 'rock',
  calm: 'lo-fi',
  neutral: 'indie',
};

const MusicPlayer = ({ currentEmotion, currentlyPlaying, setCurrentlyPlaying }) => {

  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const fetchMusic = async (emotion) => {
    setLoading(true);
    try {
      const genre = emotionToGenreMap[emotion] || 'pop';
      const randomOffset = Math.floor(Math.random() * 50);
      const res = await axios.get(`https://itunes.apple.com/search?term=${genre}&entity=song&limit=10&offset=${randomOffset}`);
      if (res.data.results && res.data.results.length > 0) {
        const validSongs = res.data.results.filter(s => s.previewUrl);
        setSongs(validSongs);
        if (validSongs.length > 0) {
          setCurrentlyPlaying(validSongs[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching music from iTunes', err);
    }
    setLoading(false);
  };

  useEffect(() => {

    fetchMusic(currentEmotion);
  }, [currentEmotion]);

  useEffect(() => {

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentlyPlaying]);

  const handleNext = () => {

    if (songs.length > 0) {
      const currentIndex = songs.findIndex(s => s.trackId === currentlyPlaying?.trackId);
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentlyPlaying(songs[nextIndex]);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {

    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      className="flex-1 flex flex-col gap-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="glass-panel p-8 rounded-3xl flex-1 flex flex-col justify-center items-center relative overflow-hidden group">
        {currentlyPlaying && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-30 pointer-events-none transition-all duration-1000"
            style={{
              backgroundImage: `url(${currentlyPlaying.artworkUrl100})`,
              backgroundSize: 'cover'
            }}
          />
        )}

        <div className="flex w-full justify-between items-center mb-8 z-10">
          <div className="font-space uppercase tracking-widest text-white/50 text-sm flex items-center gap-2">
            <Music className="w-4 h-4" />
            Now Playing - {currentEmotion} Vibe
          </div>
          <button className="text-white/50 hover:text-pink-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <Disc3 className="w-16 h-16 text-white/30 animate-spin-slow mb-4" />
              <p className="font-space text-white/50">Tuning into your emotion...</p>
            </div>
          </div>
        ) : currentlyPlaying ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentlyPlaying.trackId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center w-full z-10"
            >
              <div className="relative mb-8">
                <motion.div
                  className="w-64 h-64 rounded-2xl shadow-2xl overflow-hidden z-20 relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <img
                    src={currentlyPlaying.artworkUrl100.replace('100x100', '500x500')}
                    alt={currentlyPlaying.trackName}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  className="absolute top-0 right-[-30px] w-64 h-64 bg-[#111] rounded-full z-10 border border-white/10 shadow-2xl flex items-center justify-center"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-24 h-24 rounded-full border border-white/20" style={{ backgroundImage: `url(${currentlyPlaying.artworkUrl100})`, backgroundSize: 'cover' }} />
                  <div className="w-4 h-4 bg-black rounded-full absolute" />
                </motion.div>
              </div>

              <h3 className="font-bebas text-4xl text-center mb-2 tracking-wide truncate w-full max-w-md">
                {currentlyPlaying.trackName}
              </h3>
              <p className="font-space text-white/60 text-lg mb-8">
                {currentlyPlaying.artistName}
              </p>

              <div className="flex items-center gap-8">
                <button onClick={togglePlay} className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform ${isPlaying ? 'shadow-[0_0_30px_rgba(255,255,255,0.5)]' : ''}`}>
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                <button onClick={handleNext} className="text-white/70 hover:text-white hover:scale-110 transition-all">
                  <SkipForward className="w-8 h-8" />
                </button>
              </div>

              <audio
                ref={audioRef}
                src={currentlyPlaying.previewUrl}
                onEnded={handleNext}
                crossOrigin="anonymous"
              />

              {isPlaying && (
                <div className="flex gap-1 mt-8 h-8 items-end">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-white/50 rounded-t-sm"
                      animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                      transition={{
                        duration: Math.random() * 0.5 + 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-white/50 font-space">No songs found.</div>
        )}
      </div>

      <div className="h-32 glass-panel rounded-2xl p-4 flex gap-4 overflow-x-auto">
        {songs.filter(s => s.trackId !== currentlyPlaying?.trackId).map((song) => (
          <motion.div
            key={song.trackId}
            className="flex-shrink-0 w-48 h-full glass-panel-hover rounded-xl p-2 flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setCurrentlyPlaying(song);
              setIsPlaying(true);
            }}
          >
            <img src={song.artworkUrl100} alt="art" className="w-16 h-16 rounded-lg object-cover" />
            <div className="overflow-hidden">
              <p className="font-space text-sm font-bold truncate">{song.trackName}</p>
              <p className="font-space text-xs text-white/50 truncate">{song.artistName}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
