import React from 'react';
import { Home, ScanFace, Library, Heart, History, Compass, Plus, ListMusic } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ activeView, setActiveView, setPlaylist, setPlaylistMeta }) => {
  // Primary app navigation links.
  const navLinks = [
    { icon: <Home className="w-5 h-5" />, label: 'Home' },
    { icon: <ScanFace className="w-5 h-5" />, label: 'AI Mood Scan' },
    { icon: <Compass className="w-5 h-5" />, label: 'Discover' },
  ];

  // Secondary library section links.
  const libraryLinks = [
    { icon: <Library className="w-5 h-5" />, label: 'Playlists' },
    { icon: <Heart className="w-5 h-5" />, label: 'Liked Songs' },
    { icon: <History className="w-5 h-5" />, label: 'Recent Moods' },
  ];

  // Quick static playlists fetched using fixed search keywords.
  const miniPlaylists = [
    { label: "Hindi Hits", query: "Bollywood hits" },
    { label: "Chill Mix", query: "chill lofi" },
    { label: "Workout", query: "workout EDM" },
    { label: "Late Night", query: "late night drive" },
    { label: "Focus Mode", query: "focus classical" }
  ];

  const fetchStaticPlaylist = async (playlistItem) => {
    setActiveView(playlistItem.label);
    try {
      const res = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(playlistItem.query)}&entity=song&limit=20`);
      const validSongs = res.data.results.filter((song) => song.previewUrl);
      setPlaylistMeta({ title: playlistItem.label, description: 'Curated for you', totalSongs: validSongs.length });
      setPlaylist(validSongs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-64 h-full bg-[#030303]/90 border-r border-white/5 flex flex-col pt-6 pb-24 z-20">
      
      {/* Brand */}
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
          <ListMusic className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bebas text-2xl tracking-widest text-white">MOODIFY</h2>
      </div>

      {/* Main Nav */}
      <div className="flex flex-col gap-1 px-3 mb-8">
        {navLinks.map((item, i) => (
          <button 
            key={i} 
            onClick={() => setActiveView(item.label)}
            className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors font-space text-sm ${activeView === item.label ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Library Nav */}
      <div className="flex flex-col gap-1 px-3 mb-8">
        <h4 className="px-3 text-xs uppercase tracking-widest text-white/40 mb-2 font-space">Library</h4>
        {libraryLinks.map((item, i) => (
          <button 
            key={i} 
            onClick={() => setActiveView(item.label)}
            className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-colors font-space text-sm ${activeView === item.label ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Playlists Scroller */}
      <div className="flex-1 overflow-y-auto custom-scroll px-3">
        <div className="flex items-center justify-between px-3 text-xs uppercase tracking-widest text-white/40 mb-2 font-space">
          <span>Playlists</span>
          <button className="hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-col gap-1">
          {miniPlaylists.map((pl, i) => (
            <button 
              key={i} 
              onClick={() => fetchStaticPlaylist(pl)}
              className={`text-left px-3 py-2 rounded-lg transition-colors font-space text-sm truncate ${activeView === pl.label ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              {pl.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
