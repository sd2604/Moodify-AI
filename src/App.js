import logo from "./logo.svg";
import "./App.css";
import CameraFeed from "./components/CameraFeed";
import MusicPlayer from "./components/MusicPlayer";
import MoodChart from "./components/MoodChart";
import SuggestionCard from "./components/SuggestionCard";

function App() {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-white flex">
      {/* LEFT */}
      <div className="w-1/3 p-4 min-h-[400px]">
        <CameraFeed />
      </div>

      {/* CENTER */}
      <div className="w-2/4 p-6 flex items-center justify-center">
        {/* 👇 IMPORTANT CHANGE */}
        <MusicPlayer emotion="happy" />
      </div>

      {/* RIGHT */}
      <div className="w-1/4 p-4 border-l border-gray-800 space-y-4">
        <MoodChart />
        <SuggestionCard />
      </div>
    </div>
  );
}

export default App;
