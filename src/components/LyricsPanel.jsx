import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LyricsPanel = ({ currentlyPlaying }) => {
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!currentlyPlaying) {
        setLyrics('');
        setError('');
        return;
      }

      const cleanTitle = (title) =>
        title
          .replace(/\(.*?\)|\[.*?\]/g, '')
          .replace(/feat\.?.*/i, '')
          .replace(/ft\.?.*/i, '')
          .trim();

      setLoading(true);
      setError('');
      try {
        const title = cleanTitle(currentlyPlaying.trackName);
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

  return (
    <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col min-h-[220px]">
      <h3 className="font-space text-sm uppercase tracking-wider text-white/70 mb-4">
        Lyrics
      </h3>

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

        {currentlyPlaying && !loading && !error && lyrics && (
          <p className="font-space text-sm leading-6 text-white/85 whitespace-pre-line">
            {lyrics}
          </p>
        )}
      </div>
    </div>
  );
};

export default LyricsPanel;
