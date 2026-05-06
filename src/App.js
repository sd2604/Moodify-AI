import './App.css';
import { useState } from "react";

import CameraFeed from "./components/CameraFeed";
import MusicPlayer from "./components/MusicPlayer";
import MoodChart from "./components/MoodChart";
import SuggestionCard from "./components/SuggestionCard";

function App() {
  const [emotion, setEmotion] = useState("happy");
  const [moodHistory, setMoodHistory] = useState([]);

  function updateMood(newEmotion) {
    setEmotion(newEmotion);

    setMoodHistory((prev) => {
      const updated = [
        ...prev,
        { emotion: newEmotion, time: new Date().toLocaleTimeString() },
      ];
      return updated.slice(-10);
    });
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-4 p-4 h-screen">

        {/* LEFT PANEL */}
        <div className="col-span-3 bg-[#1a1a22] rounded-xl p-4 border border-gray-800 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Emotion Input</h3>

          <CameraFeed setEmotion={updateMood} />
        </div>

        {/* CENTER PANEL */}
        <div className="col-span-6 bg-[#1a1a22] rounded-xl p-4 border border-gray-800 flex flex-col">

          <h3 className="text-lg font-semibold mb-3 text-center">
            Music Player
          </h3>

          <p className="text-sm text-gray-400 text-center mb-4">
            Songs recommended based on your mood
          </p>

          <div className="flex-1 overflow-y-auto">
            <MusicPlayer emotion={emotion} />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-3 flex flex-col gap-4">

          {/* MOOD CHART */}
          <div className="bg-[#1a1a22] rounded-xl p-4 border border-gray-800 flex-1">
            <h3 className="text-lg font-semibold mb-2">Mood Trend</h3>

            <MoodChart moodHistory={moodHistory} />
          </div>

          {/* SUGGESTION */}
          <div className="bg-[#1a1a22] rounded-xl p-4 border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Suggestions</h3>

            <SuggestionCard emotion={emotion} />
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
