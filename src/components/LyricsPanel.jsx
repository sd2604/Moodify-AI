import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2 } from 'lucide-react';

const LyricsPanel = ({ currentlyPlaying }) => {
  const [lyricsSnippet, setLyricsSnippet] = useState("Vibe to the rhythm...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!currentlyPlaying) return;
      
      const API_KEY = process.env.REACT_APP_GENIUS_API_KEY;
      if (!API_KEY) {
        setLyricsSnippet("Music speaks when words fail...");
        return;
      }

      setLoading(true);
      try {
        // Search for the song on Genius API
        const searchQuery = `${currentlyPlaying.trackName} ${currentlyPlaying.artistName}`;
        const res = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        });
        
        if (res.data.response.hits.length > 0) {
           // We can't fetch full lyrics easily via Genius API without scraping, 
           // but we can show the song path or a cool fallback snippet
           setLyricsSnippet("Lyrics found! Tap to view full lyrics on Genius.");
        } else {
           setLyricsSnippet("Lost in the instrumental...");
        }
      } catch (err) {
        console.error("Error fetching from Genius", err);
        setLyricsSnippet("Immersed in sound...");
      }
      setLoading(false);
    };

    fetchLyrics();
  }, [currentlyPlaying]);

  return (
    <motion.div 
      className="glass-panel p-6 rounded-3xl flex-1 flex flex-col"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h3 className="font-bebas text-2xl mb-4 flex items-center gap-2">
        <Mic2 className="w-5 h-5 text-white/70" /> LYRICS VIBE
      </h3>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
        
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/30 font-space animate-pulse"
             >
               Translating frequencies...
             </motion.div>
          ) : (
            <motion.p
              key={currentlyPlaying?.trackId || "empty"}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
              className="font-bebas text-4xl text-center leading-relaxed text-glow opacity-80"
              style={{ paddingBottom: '20px' }}
            >
              "{lyricsSnippet}"
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LyricsPanel;
