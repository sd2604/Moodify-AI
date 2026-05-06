import { useState, useEffect, useRef } from "react";
import { getSongs } from "../utils/spotify";
import { emotionMap } from "../utils/emotionMap";

export default function MusicPlayer({ emotion }) {
  const [songs, setSongs] = useState([]);
  const audioRef = useRef(null);

  function playSong(url) {
    if (!url) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(url);

    newAudio.play().catch(() => {
      console.log("Playback interrupted");
    });

    audioRef.current = newAudio;
  }

  function stopSong() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  useEffect(() => {
    async function loadSongs() {
      if (!emotion) return;

      const genres = emotionMap[emotion];
      const genre = genres[Math.floor(Math.random() * genres.length)];

      const data = await getSongs(genre);
      setSongs(data);
    }

    loadSongs();
  }, [emotion]);

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-center text-white w-full">

      {songs.length === 0 ? (
        <p className="text-gray-400">Loading songs...</p>
      ) : (
        songs.map((song) => (
          <div key={song.id} className="mb-6 border-b border-gray-700 pb-4">
            <p className="font-semibold">{song.name}</p>

            <p className="text-sm text-gray-400">
              {song.artists.map((a) => a.name).join(", ")}
            </p>

            <div className="mt-2 flex justify-center gap-2">
              <button
                onClick={() => playSong(song.preview_url)}
                className="bg-purple-600 px-3 py-1 rounded"
              >
                Play
              </button>

              <button
                onClick={stopSong}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Stop
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}