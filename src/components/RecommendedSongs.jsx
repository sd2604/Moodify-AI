import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Music2, Pause, Play } from 'lucide-react';

const emotionGenreMap = {
  happy: 'dance',
  sad: 'acoustic',
  angry: 'rock',
  calm: 'lo-fi',
  neutral: 'indie',
};

const RecommendedSongs = ({ currentEmotion, currentlyPlaying, setCurrentlyPlaying }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const genre = emotionGenreMap[currentEmotion] || 'pop';
        const randomOffset = Math.floor(Math.random() * 50);
        const res = await axios.get(
          `https://itunes.apple.com/search?term=${genre}&entity=song&limit=8&offset=${randomOffset}`
        );
        const validSongs = (res.data?.results || []).filter((song) => song.previewUrl);
        setSongs(validSongs);
        if (!currentlyPlaying && validSongs.length > 0) {
          setCurrentlyPlaying(validSongs[0]);
        }
      } catch (err) {
        console.error('Error fetching recommended songs', err);
      }
      setLoading(false);
    };

    fetchMusic();
  }, [currentEmotion, setCurrentlyPlaying, currentlyPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentlyPlaying]);

  const handleSelectSong = (song) => {
    setCurrentlyPlaying(song);
    setIsPlaying(true);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space text-sm uppercase tracking-wider text-white/70">Recommended Songs</h3>
        <Music2 className="w-4 h-4 text-cyan-200/70" />
      </div>

      {currentlyPlaying?.previewUrl && (
        <audio
          ref={audioRef}
          src={currentlyPlaying.previewUrl}
          onEnded={() => setIsPlaying(false)}
          crossOrigin="anonymous"
        />
      )}

      {currentlyPlaying && (
        <div className="mb-4 p-3 rounded-xl border border-white/10 bg-black/20 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-space text-sm font-semibold truncate">{currentlyPlaying.trackName}</p>
            <p className="font-space text-xs text-white/60 truncate">{currentlyPlaying.artistName}</p>
          </div>
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {loading && <p className="font-space text-sm text-white/60">Loading recommendations...</p>}

        {!loading &&
          songs.map((song) => (
            <button
              key={song.trackId}
              onClick={() => handleSelectSong(song)}
              className="w-full text-left p-3 rounded-xl border border-white/10 bg-black/20 hover:bg-white/10 transition-colors flex items-center gap-3"
            >
              <img src={song.artworkUrl100} alt={song.trackName} className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="font-space text-sm font-semibold truncate">{song.trackName}</p>
                <p className="font-space text-xs text-white/60 truncate">{song.artistName}</p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default RecommendedSongs;
