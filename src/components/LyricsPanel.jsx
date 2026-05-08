import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic2, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const sanitizeSongTitle = (title) =>
  title
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .replace(/feat\.?.*/i, '')
    .replace(/ft\.?.*/i, '')
    .trim();

const LyricsPanel = ({ currentlyPlaying, setCurrentlyPlaying, songs, isPlaying, setIsPlaying }) => {

  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [audioEl, setAudioEl] = useState(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!currentlyPlaying) {
        setLyrics('');
        setError('');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const title = sanitizeSongTitle(currentlyPlaying.trackName);
        const artist = currentlyPlaying.artistName;
        const res = await axios.get(
          `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
        );
        setLyrics(res.data?.lyrics || '');
        if (!res.data?.lyrics) {
          setError('Lyrics not available for this song.');
        }
      } catch (err) {
        console.error('Error fetching lyrics', err);
        setLyrics('');
        setError('Lyrics not available for this song.');
      }
      setLoading(false);
    };

    fetchLyrics();
  }, [currentlyPlaying]);

  useEffect(() => {
    if (!audioEl) return;
    audioEl.volume = volume;
  }, [audioEl, volume]);

  useEffect(() => {
    if (!audioEl) return;
    if (isPlaying && currentlyPlaying?.previewUrl) {
      audioEl.play().catch(() => {});
    } else {
      audioEl.pause();
    }
  }, [audioEl, isPlaying, currentlyPlaying]);

  useEffect(() => {
    if (!lyrics || !duration) {
      setActiveLineIndex(0);
      return;
    }
    const lines = lyrics.split('\n').filter((line) => line.trim());
    if (!lines.length) return;
    const progress = duration > 0 ? currentTime / duration : 0;
    setActiveLineIndex(Math.min(lines.length - 1, Math.floor(progress * lines.length)));
  }, [lyrics, currentTime, duration]);

  useEffect(() => {
    const activeLine = document.getElementById(`lyrics-line-${activeLineIndex}`);
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLineIndex]);

  const handleSeek = (e) => {
    const seekValue = Number(e.target.value);
    if (!audioEl || !duration) return;
    const seekTime = (seekValue / 100) * duration;
    audioEl.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handlePrev = () => {
    // Move to previous song in circular order.
    if (!songs?.length || !currentlyPlaying) return;
    const currentIndex = songs.findIndex((song) => song.trackId === currentlyPlaying.trackId);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentlyPlaying(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (!songs?.length || !currentlyPlaying) return;
    const currentIndex = songs.findIndex((song) => song.trackId === currentlyPlaying.trackId);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentlyPlaying(songs[nextIndex]);
    setIsPlaying(true);
  };

  const lyricLines = lyrics.split('\n').filter((line) => line.trim());

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col min-h-[220px] overflow-hidden">
      <h3 className="font-space text-sm uppercase tracking-wider text-white/70 mb-4">
        Lyrics
      </h3>

      <div className="mb-4 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 flex items-center gap-2">
        <Mic2 className="w-4 h-4 text-cyan-200" />
        <p className="font-space text-sm text-cyan-100/90">
          {currentlyPlaying ? '🎤 Sing along with the lyrics' : 'Start singing to analyze your mood'}
        </p>
      </div>

      <div className={`mb-4 rounded-2xl border border-white/10 bg-black/35 p-4 transition-all ${isPlaying ? 'shadow-[0_0_24px_rgba(34,197,94,0.18)]' : ''}`}>
        {currentlyPlaying ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={currentlyPlaying.artworkUrl100.replace('100x100', '300x300')}
                alt={currentlyPlaying.trackName}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="font-space font-semibold text-sm truncate">{currentlyPlaying.trackName}</p>
                <p className="font-space text-xs text-white/60 truncate">{currentlyPlaying.artistName}</p>
              </div>
            </div>

            <audio
              key={currentlyPlaying.trackId}
              ref={setAudioEl}
              src={currentlyPlaying.previewUrl}
              crossOrigin="anonymous"
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
              onEnded={handleNext}
            />

            <div className="flex items-center gap-3 mb-3">
              <button onClick={handlePrev} className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="w-11 h-11 rounded-full bg-white text-black hover:scale-105 transition-transform flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button onClick={handleNext} className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <SkipForward className="w-4 h-4" />
              </button>
              <div className="ml-auto flex items-center gap-2 w-32">
                <Volume2 className="w-4 h-4 text-white/60" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(volume * 100)}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  className="w-full accent-white/80"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-space text-xs text-white/60 w-10">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="flex-1 accent-white/90"
              />
              <span className="font-space text-xs text-white/60 w-10 text-right">{formatTime(duration)}</span>
            </div>
          </>
        ) : (
          <p className="font-space text-sm text-white/60">Choose a song from recommendations to start playback.</p>
        )}
      </div>

      <div className="flex-1 bg-black/30 border border-white/10 rounded-2xl p-4 overflow-y-auto">
        {!currentlyPlaying && (
          <p className="font-space text-sm leading-6 text-white/60">
            Play a song to view lyrics.
          </p>
        )}

        {currentlyPlaying && loading && (
          <p className="font-space text-sm leading-6 text-white/60">Loading lyrics...</p>
        )}

        {currentlyPlaying && !loading && error && (
          <p className="font-space text-sm leading-6 text-white/60">{error}</p>
        )}

        {currentlyPlaying && !loading && !error && lyrics && lyricLines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            id={`lyrics-line-${index}`}
            className={`font-space text-sm leading-7 whitespace-pre-line transition-all duration-300 ${
              index === activeLineIndex
                ? 'text-cyan-200 drop-shadow-[0_0_8px_rgba(103,232,249,0.35)]'
                : 'text-white/70'
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LyricsPanel;
