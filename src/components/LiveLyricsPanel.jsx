import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const LiveLyricsPanel = ({ currentlyPlaying }) => {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!currentlyPlaying) return;
      
      setLoading(true);
      setLyrics("");
      try {
        // Clean up title for better search results (remove " (feat. XYZ)", remaster, etc)
        const rawTitle = currentlyPlaying.trackName;
        const rawArtist = currentlyPlaying.artistName;
        
        const title = rawTitle.replace(/\s*\(.*\)/, '').replace(/\s*\[.*\]/, '').split('-')[0].trim();
        const artist = rawArtist.split(' &')[0].split(',')[0].trim();
        
        const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
        
        if (res.data && res.data.lyrics) {
           setLyrics(res.data.lyrics.replace(/Paroles de la chanson .+\n/i, '').trim());
        } else {
           setLyrics("");
        }
      } catch (err) {
        console.error("Error fetching lyrics", err);
        setLyrics("");
      }
      setLoading(false);
    };

    fetchLyrics();
  }, [currentlyPlaying]);

  const lyricsLines = lyrics ? lyrics.split('\n').filter(line => line.trim() !== '') : [];

  // Simulated live synced scrolling
  useEffect(() => {
    if (!lyricsLines.length) return;
    setActiveLineIdx(0);
    const interval = setInterval(() => {
      setActiveLineIdx(prev => {
        const next = prev + 1;
        if (next >= lyricsLines.length) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, 2500); // Advance active line every 2.5s for the 30s preview
    
    return () => clearInterval(interval);
  }, [lyrics, lyricsLines.length]);

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('.active-lyric');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLineIdx]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden group w-full h-full">

      <div className="flex items-center justify-between p-4 z-10 relative bg-black/20 border-b border-white/5">
        <h3 className="font-bebas text-lg flex items-center gap-2 text-white tracking-widest">
          🎵 LIVE LYRICS
          
          {/* Animated Equalizer */}
          <div className="flex gap-[3px] ml-3 h-5 items-end">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`eq-${i}`}
                className="w-1 bg-purple-400 rounded-t-sm"
                animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                transition={{
                  duration: Math.random() * 0.5 + 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
           <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-white/30 font-space animate-pulse relative z-10"
           >
             <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin mb-4" />
             Connecting to lyrics database...
           </motion.div>
        ) : (
          <motion.div
            key={currentlyPlaying?.trackId || "empty"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col h-full overflow-hidden relative z-10"
          >
            {currentlyPlaying ? (
              <>
                {/* Lyrics Scroller */}
                <div className="relative flex-1 overflow-hidden">
                  {/* Top Fade */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#050505]/90 to-transparent z-10 pointer-events-none rounded-t-lg" />
                  
                  {lyricsLines.length > 0 ? (
                    <div 
                      ref={containerRef}
                      className="h-full overflow-y-auto pb-32 pt-12 px-4 scroll-smooth"
                    >
                      {lyricsLines.map((line, idx) => {
                        const isActive = idx === activeLineIdx;
                        return (
                          <motion.p 
                            key={idx}
                            className={`font-inter text-lg text-center mb-6 transition-all duration-700 cursor-default ${isActive ? 'active-lyric text-white text-glow scale-105 font-medium' : 'text-white/30 scale-95'} hover:text-white hover:scale-105`}
                          >
                            {line}
                          </motion.p>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/40 font-space italic text-center px-4">
                      No lyrics found for this track
                    </div>
                  )}
                  
                  {/* Bottom Fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050505]/90 to-transparent z-10 pointer-events-none rounded-b-lg" />
                </div>
              </>
            ) : (
               <div className="flex-1 flex items-center justify-center text-white/30 font-space">
                 Waiting for music...
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveLyricsPanel;
