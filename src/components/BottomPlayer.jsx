import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, SkipForward, SkipBack, Repeat, Volume2, ListMusic, Heart, Mic2 } from 'lucide-react';

const BottomPlayer = ({ currentlyPlaying, isPlaying, togglePlay, progress, volume, isShuffled, toggleShuffle, handleVolumeChange, handleSeek, handleNext, handlePrev, handleTimeUpdate, audioRef, likedSongs, toggleLiked }) => {
  // Check if current song exists in liked songs list.
  const isLiked = currentlyPlaying ? likedSongs.find(s => s.trackId === currentlyPlaying.trackId) : false;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#050505]/95 border-t border-white/10 z-50 flex items-center justify-between px-4 md:px-8 backdrop-blur-xl">
      
      {/* Left: Thumbnail & Info */}
      <div className="w-1/3 flex items-center gap-4">
        {currentlyPlaying ? (
          <>
            <img 
              src={currentlyPlaying.artworkUrl100} 
              alt="art" 
              className="w-14 h-14 rounded-md shadow-lg"
            />
            <div className="flex flex-col justify-center max-w-[200px]">
              <h4 className="font-space font-bold text-white text-sm truncate hover:underline cursor-pointer">
                {currentlyPlaying.trackName}
              </h4>
              <p className="font-space text-white/50 text-xs truncate hover:underline cursor-pointer">
                {currentlyPlaying.artistName}
              </p>
            </div>
            <button 
              onClick={() => toggleLiked(currentlyPlaying)}
              className={`${isLiked ? 'text-green-500 hover:text-green-400' : 'text-white/50 hover:text-white'} ml-2 transition-colors`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/5 rounded-md" />
            <div className="flex flex-col gap-2">
              <div className="w-24 h-3 bg-white/5 rounded" />
              <div className="w-16 h-2 bg-white/5 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* Center section: transport controls and seek bar */}
      <div className="w-1/3 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleShuffle}
            className={`${isShuffled ? 'text-green-500 hover:text-green-400' : 'text-white/50 hover:text-white'} transition-colors relative`}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffled && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />}
          </button>
          <button onClick={handlePrev} className="text-white/70 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform">
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
          </button>
          <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-white/50 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md flex items-center gap-2 group cursor-pointer">
          <span className="text-[10px] text-white/50 font-space w-8 text-right">
             {audioRef.current ? Math.floor(audioRef.current.currentTime) : '0'}:{(audioRef.current ? Math.floor((audioRef.current.currentTime % 1) * 60) : 0).toString().padStart(2, '0')}
          </span>
          <div className="h-1 flex-1 bg-white/10 rounded-full relative group-hover:h-1.5 transition-all overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-green-500 transition-colors pointer-events-none"
              style={{ width: `${progress}%` }}
            />
            <input 
              type="range" min="0" max="100" step="0.1" value={progress || 0}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-white/50 font-space w-8">0:30</span>
        </div>
      </div>

      {/* Right section: extra actions and volume control */}
      <div className="w-1/3 flex items-center justify-end gap-4 pr-2">
        <button className="text-white/50 hover:text-white transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-white/50 hover:text-white transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 w-24 group cursor-pointer ml-2">
          <Volume2 className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
          <div className="h-1 flex-1 bg-white/10 rounded-full relative group-hover:h-1.5 transition-all overflow-hidden">
             <div 
               className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-purple-500 transition-colors"
               style={{ width: `${volume * 100}%` }}
             />
             <input 
               type="range" min="0" max="1" step="0.01" value={volume} 
               onChange={handleVolumeChange}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      {currentlyPlaying && (
        <audio 
          ref={audioRef} 
          src={currentlyPlaying.previewUrl} 
          onEnded={handleNext}
          onTimeUpdate={handleTimeUpdate}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};

export default BottomPlayer;
