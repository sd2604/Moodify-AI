import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraFeed from './CameraFeed';
import LiveLyricsPanel from './LiveLyricsPanel';

const RightPanel = ({ currentlyPlaying, currentEmotion, setCurrentEmotion }) => {
  return (
    <div className="w-80 h-full bg-[#030303]/90 border-l border-white/5 flex flex-col z-20">
      
      <div className="h-64 p-4 border-b border-white/5 shrink-0">
        <CameraFeed currentEmotion={currentEmotion} setCurrentEmotion={setCurrentEmotion} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-6 flex flex-col relative">
        <AnimatePresence mode="wait">
          {currentlyPlaying ? (
            <motion.div
              key={currentlyPlaying.trackId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >

              <div className="w-full aspect-square rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-6 relative group">
                <img 
                  src={currentlyPlaying.artworkUrl100.replace('100x100', '600x600')} 
                  alt="art" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="mb-6">
                <h2 className="font-inter font-bold text-2xl text-white mb-1 hover:underline cursor-pointer break-words">
                  {currentlyPlaying.trackName}
                </h2>
                <p className="font-inter text-white/60 hover:underline cursor-pointer">
                  {currentlyPlaying.artistName}
                </p>
                <div className="flex items-center gap-2 mt-3 font-space text-xs uppercase tracking-widest text-white/40">
                   <span className="px-2 py-1 border border-white/10 rounded-full">{currentlyPlaying.customLanguage || currentlyPlaying.primaryGenreName}</span>
                </div>
              </div>

              <div className="flex-1 bg-white/5 rounded-xl relative overflow-hidden group border border-white/5 flex flex-col">
                <LiveLyricsPanel currentlyPlaying={currentlyPlaying} />
              </div>
            </motion.div>
          ) : (
             <div className="h-full flex items-center justify-center font-space text-white/30 text-sm text-center">
               Play a song to view details
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RightPanel;
