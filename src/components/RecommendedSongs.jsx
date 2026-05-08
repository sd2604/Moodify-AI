import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Pause, Play } from 'lucide-react';

const RecommendedSongs = ({ currentEmotion, songs, loading, currentlyPlaying, onSelectSong, isPlaying }) => {
  return (
    <div className="glass-panel p-5 rounded-3xl h-full flex flex-col overflow-hidden">
      {/* Header explains why these songs are shown. */}
      <div className="flex items-center justify-between mb-4">
        <motion.h3
          key={currentEmotion}
          initial={{ opacity: 0.6, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="font-space text-sm uppercase tracking-wider text-white/75"
        >
          Songs recommended based on your {currentEmotion} mood
        </motion.h3>
        <Music2 className="w-4 h-4 text-cyan-200/70" />
      </div>

      {currentlyPlaying && (
        // Shows quick "now playing" context inside recommendation panel.
        <div className="mb-4 p-3 rounded-xl border border-white/10 bg-black/20 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-space text-sm font-semibold truncate">{currentlyPlaying.trackName}</p>
            <p className="font-space text-xs text-white/60 truncate">{currentlyPlaying.artistName}</p>
          </div>
          <div className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {loading && <p className="font-space text-sm text-white/60">Loading recommendations...</p>}

        {!loading &&
          songs.map((song) => {
            const isActive = song.trackId === currentlyPlaying?.trackId;

            return (
            // Each row is clickable and promotes selected song visually.
            <button
              key={song.trackId}
              onClick={() => onSelectSong(song)}
              className={`group w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
                isActive
                  ? 'border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_18px_rgba(103,232,249,0.18)]'
                  : 'border-white/10 bg-black/20 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]'
              }`}
            >
              <img src={song.artworkUrl100} alt={song.trackName} className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="font-space text-sm font-semibold truncate">{song.trackName}</p>
                <p className="font-space text-xs text-white/60 truncate">{song.artistName}</p>
              </div>
              <div className="ml-auto w-8 h-8 rounded-full border border-white/20 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </button>
          );
          })}
      </div>
    </div>
  );
};

export default RecommendedSongs;
