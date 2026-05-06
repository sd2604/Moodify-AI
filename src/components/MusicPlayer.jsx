import { useState, useEffect, useRef } from "react";
import { getSongs } from "../utils/spotify";
import { emotionMap } from "../utils/emotionMap";

export default function MusicPlayer({ emotion }) {
  const [songs, setSongs] = useState([]);

  // ✅ FIXED audio handling
  const audioRef = useRef(null);

  function playSong(url) {
    if (!url) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(url);
    audioRef.current.play();
  }

  useEffect(() => {
    async function loadSongs() {
      if (!emotion) return;

      const genre = emotionMap[emotion];
      const data = await getSongs(genre);

      setSongs(data);
    }

    loadSongs();
  }, [emotion]);

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-center text-white w-full">
      <h2 className="text-xl font-bold mb-4">Music Player</h2>

      {songs.length === 0 ? (
        <p>Loading songs...</p>
      ) : (
        songs.map((song) => (
          <div key={song.id} className="mb-4">
            <p className="font-semibold">{song.name}</p>
            <p className="text-sm text-gray-400">
              {song.artists.map((artist) => artist.name).join(", ")}
            </p>

            {song.preview_url ? (
              <button
                onClick={() => playSong(song.preview_url)}
                className="bg-purple-600 px-3 py-1 rounded mt-2"
              >
                ▶ Play
              </button>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                No preview available
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}