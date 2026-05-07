import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground';
import Sidebar from './components/Sidebar';
import PlaylistView from './components/PlaylistView';
import RightPanel from './components/RightPanel';
import BottomPlayer from './components/BottomPlayer';
import { fetchDynamicPlaylist } from './utils/musicApi';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [activeView, setActiveView] = useState('Home'); // Home, Search, Liked Songs, Recent Moods, [Playlist Names]
  
  // Media States
  const [playlistMeta, setPlaylistMeta] = useState({ title: "Welcome to Moodify", description: "Your AI powered music journey", totalSongs: 0 });
  const [playlist, setPlaylist] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const audioRef = useRef(null);

  // Persistent States
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem('moodify_liked');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [recentMoods, setRecentMoods] = useState(() => {
    const saved = localStorage.getItem('moodify_moods');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('moodify_liked', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('moodify_moods', JSON.stringify(recentMoods));
  }, [recentMoods]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch playlist when emotion changes
  useEffect(() => {
    if (currentEmotion) {
      const getPlaylist = async () => {
        const data = await fetchDynamicPlaylist(currentEmotion);
        setPlaylistMeta(data.playlistMeta);
        setPlaylist(data.songs);
        setActiveView('AI Mood Scan');
        
        // Add to recent moods
        setRecentMoods(prev => {
          const newMoods = [{ emotion: currentEmotion, time: new Date().toLocaleString(), playlist: data.playlistMeta.title }, ...prev];
          return newMoods.slice(0, 10);
        });

        if (data.songs.length > 0) {
          setCurrentlyPlaying(data.songs[0]);
          setIsPlaying(false);
        }
        showToast(`Playlist Updated by AI Mood Scan: ${currentEmotion.toUpperCase()}`);
      };
      getPlaylist();
    }
  }, [currentEmotion]);

  // Audio Playback Effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentlyPlaying, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    showToast(isShuffled ? "Shuffle Disabled" : "Shuffle Enabled");
  };

  const handleNext = () => {
    if (playlist.length > 0) {
      let nextIndex;
      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } else {
        const currentIndex = playlist.findIndex(s => s.trackId === currentlyPlaying?.trackId);
        nextIndex = (currentIndex + 1) % playlist.length;
      }
      setCurrentlyPlaying(playlist[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (playlist.length > 0) {
      const currentIndex = playlist.findIndex(s => s.trackId === currentlyPlaying?.trackId);
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      setCurrentlyPlaying(playlist[prevIndex]);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const seekPercentage = parseFloat(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (seekPercentage / 100) * audioRef.current.duration;
      setProgress(seekPercentage);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleLiked = (song) => {
    if (!song) return;
    const exists = likedSongs.find(s => s.trackId === song.trackId);
    if (exists) {
      setLikedSongs(likedSongs.filter(s => s.trackId !== song.trackId));
      showToast("Removed from Liked Songs");
    } else {
      setLikedSongs([song, ...likedSongs]);
      showToast("Added to Liked Songs");
    }
  };

  // Custom Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="h-screen relative overflow-hidden font-inter text-white flex flex-col bg-[#050505]">
      <div id="custom-cursor" className="custom-cursor hidden md:block" />
      <div className="vignette" />

      {/* Global Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-0 left-1/2 z-[100] glass-panel px-6 py-3 rounded-full border border-white/20 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-sm font-space font-bold tracking-wide"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="flex flex-col h-screen relative z-10 w-full overflow-hidden">
          <AnimatedBackground currentEmotion={currentEmotion} />
          
          {/* Main Workspace (Top) */}
          <div className="flex-1 flex overflow-hidden w-full relative z-20">
            <Sidebar 
              activeView={activeView}
              setActiveView={setActiveView}
              setPlaylist={setPlaylist}
              setPlaylistMeta={setPlaylistMeta}
              likedSongs={likedSongs}
            />
            
            <PlaylistView 
              activeView={activeView}
              playlistMeta={playlistMeta}
              songs={activeView === 'Liked Songs' ? likedSongs : playlist}
              setPlaylist={setPlaylist}
              setPlaylistMeta={setPlaylistMeta}
              currentlyPlaying={currentlyPlaying}
              setCurrentlyPlaying={setCurrentlyPlaying}
              setIsPlaying={setIsPlaying}
              currentEmotion={currentEmotion}
              likedSongs={likedSongs}
              toggleLiked={toggleLiked}
              recentMoods={recentMoods}
            />

            <RightPanel 
              currentlyPlaying={currentlyPlaying}
              currentEmotion={currentEmotion}
              setCurrentEmotion={setCurrentEmotion}
            />
          </div>

          {/* Bottom Dock Player */}
          <BottomPlayer 
            currentlyPlaying={currentlyPlaying}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            progress={progress}
            volume={volume}
            isShuffled={isShuffled}
            toggleShuffle={toggleShuffle}
            handleVolumeChange={handleVolumeChange}
            handleSeek={handleSeek}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleTimeUpdate={handleTimeUpdate}
            audioRef={audioRef}
            likedSongs={likedSongs}
            toggleLiked={toggleLiked}
          />
        </div>
      )}
    </div>
  );
}

export default App;
