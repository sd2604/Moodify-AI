import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Shuffle, Heart, Download, Clock, MoreHorizontal, Search } from 'lucide-react';
import axios from 'axios';

const PlaylistView = ({ activeView, playlistMeta, songs, setPlaylist, setPlaylistMeta, currentlyPlaying, setCurrentlyPlaying, setIsPlaying, currentEmotion, likedSongs, toggleLiked, recentMoods }) => {
  // Local state for Discover search input.
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Plays a selected song and informs parent player state.
  const handlePlaySong = (song) => {
    setCurrentlyPlaying(song);
    setIsPlaying(true);
  };

  // Search iTunes and replace current playlist with results.
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=30`);
      const validSongs = res.data.results.filter(s => s.previewUrl);
      setPlaylistMeta({ title: `Results for "${searchQuery}"`, description: "Discover new music", totalSongs: validSongs.length });
      setPlaylist(validSongs);
    } catch (err) {
      console.error(err);
    }
    setIsSearching(false);
  };

  // Banner gradient follows detected mood for visual continuity.
  const bannerColor = currentEmotion === 'happy'
    ? 'from-pink-500/40'
    : currentEmotion === 'sad'
      ? 'from-blue-500/40'
      : currentEmotion === 'angry'
        ? 'from-red-500/40'
        : currentEmotion === 'calm'
          ? 'from-teal-500/40'
          : 'from-gray-500/40';

  // Dedicated view to show mood history cards.
  if (activeView === 'Recent Moods') {
    return (
      <div className="flex-1 h-full overflow-y-auto custom-scroll relative bg-gradient-to-b from-[#121212] to-[#050505] p-8">
        <h1 className="text-4xl font-bebas tracking-wide mb-8">Recent Moods</h1>
        <div className="flex flex-col gap-4">
          {recentMoods.length > 0 ? recentMoods.map((mood, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm text-white/50 font-space mb-1">{mood.time}</span>
                <span className="text-2xl font-bebas text-white uppercase">{mood.emotion}</span>
              </div>
              <div className="text-right flex flex-col">
                 <span className="text-white/60 font-inter text-sm">Generated:</span>
                 <span className="text-purple-400 font-bold font-inter">{mood.playlist}</span>
              </div>
            </div>
          )) : (
            <div className="text-white/40 font-space">No moods tracked yet. Let the AI scan your face!</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scroll relative bg-gradient-to-b from-[#121212] to-[#050505]">
      
      {/* Dynamic Banner */}
      <div className={`pt-24 pb-8 px-8 flex flex-col md:flex-row items-end gap-6 bg-gradient-to-b ${activeView === 'Discover' ? 'from-purple-500/30' : bannerColor} to-[#121212]`}>
        
        {activeView === 'Discover' && (
          <div className="absolute top-8 left-8 right-8 z-10">
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input 
                type="text" 
                placeholder="What do you want to listen to?" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-12 pr-6 text-white font-inter focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all placeholder:text-white/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}

        {/* Cover Collage */}
        <div className="w-48 h-48 md:w-56 md:h-56 shadow-2xl grid grid-cols-2 grid-rows-2 rounded-md overflow-hidden bg-[#282828] shrink-0">
          {songs.length >= 4 ? songs.slice(0, 4).map((song, i) => (
            <img key={i} src={song.artworkUrl100} alt="cover" className="w-full h-full object-cover" />
          )) : (
            <div className="col-span-2 row-span-2 flex items-center justify-center bg-gradient-to-br from-purple-900 to-black">
              <span className="font-bebas text-4xl opacity-50">MOODIFY</span>
            </div>
          )}
        </div>
        
        {/* Meta Info */}
        <div className="flex flex-col text-white">
          <span className="text-sm font-space uppercase tracking-widest mb-2 font-bold">{activeView === 'Liked Songs' ? 'Playlist' : 'Collection'}</span>
          <h1 className="text-5xl md:text-7xl font-bebas tracking-tight mb-4">
            {activeView === 'Liked Songs' ? 'Liked Songs' : (playlistMeta.title || "Moodify Mix")}
          </h1>
          <p className="text-white/60 font-inter text-sm mb-2">
            {activeView === 'Liked Songs' ? "Your personal favorites" : (playlistMeta.description || "Generated from your mood")}
          </p>
          <div className="flex items-center gap-2 font-inter text-sm">
            <span className="font-bold text-white">Moodify AI</span>
            <span className="text-white/50">•</span>
            <span className="text-white/70">{songs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-6 flex items-center gap-6">
        <button 
          onClick={() => songs.length && handlePlaySong(songs[0])}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 hover:bg-green-400 transition-all shadow-xl"
        >
          <Play className="w-7 h-7 text-black fill-current ml-1" />
        </button>
        <button className="text-white/50 hover:text-white transition-colors">
          <Shuffle className="w-8 h-8" />
        </button>
      </div>

      {/* Song Table */}
      <div className="px-8 pb-32">
        <div className="grid grid-cols-[16px_minmax(200px,_1fr)_minmax(150px,_200px)_minmax(100px,_150px)_50px_50px] gap-4 px-4 py-2 border-b border-white/10 text-white/50 font-space text-xs uppercase tracking-wider mb-4">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="hidden md:block">Album</div>
          <div className="hidden lg:block">Genre / Lang</div>
          <div className="text-center">Fav</div>
          <div className="text-right"><Clock className="w-4 h-4 ml-auto" /></div>
        </div>

        <div className="flex flex-col gap-1">
          {isSearching ? (
             <div className="text-center text-white/50 py-12 font-space animate-pulse">Searching iTunes...</div>
          ) : songs.map((song, index) => {
            const isPlaying = currentlyPlaying?.trackId === song.trackId;
            const isLiked = likedSongs.find(s => s.trackId === song.trackId);
            return (
              <motion.div 
                key={song.trackId + index}
                className={`grid grid-cols-[16px_minmax(200px,_1fr)_minmax(150px,_200px)_minmax(100px,_150px)_50px_50px] gap-4 px-4 py-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer items-center group ${isPlaying ? 'bg-white/5' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <div className="text-white/50 text-sm text-center relative flex justify-center" onClick={() => handlePlaySong(song)}>
                  <span className={`group-hover:hidden ${isPlaying ? 'text-green-500' : ''}`}>
                    {isPlaying ? <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" /> : index + 1}
                  </span>
                  <Play className="w-4 h-4 text-white hidden group-hover:block fill-current" />
                </div>
                
                <div className="flex items-center gap-3 overflow-hidden" onClick={() => handlePlaySong(song)}>
                  <img src={song.artworkUrl100} alt="art" className="w-10 h-10 rounded shadow-md shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className={`font-inter text-base truncate ${isPlaying ? 'text-green-500 font-medium' : 'text-white'}`}>
                      {song.trackName}
                    </span>
                    <span className="font-inter text-sm text-white/60 truncate group-hover:text-white transition-colors">
                      {song.artistName}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block font-inter text-sm text-white/60 truncate group-hover:text-white transition-colors" onClick={() => handlePlaySong(song)}>
                  {song.collectionName}
                </div>

                <div className="hidden lg:block font-space text-xs text-white/50 uppercase tracking-wide" onClick={() => handlePlaySong(song)}>
                  <span className="px-2 py-1 bg-white/5 rounded-full border border-white/10">
                    {song.customLanguage || song.primaryGenreName}
                  </span>
                </div>

                <div className="text-center flex justify-center items-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLiked(song); }}
                    className={`transition-colors ${isLiked ? 'text-green-500 hover:text-green-400' : 'text-white/30 hover:text-white'}`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="text-right font-space text-sm text-white/50">
                  0:30
                </div>
              </motion.div>
            );
          })}
          {songs.length === 0 && !isSearching && (
             <div className="text-center text-white/50 py-12 font-space">
               {activeView === 'Liked Songs' ? "You haven't liked any songs yet." : "Scanning face to generate playlist..."}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
