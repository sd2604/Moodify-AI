import axios from 'axios';

const moodConfigs = {
  happy: {
    title: "Happy Bollywood & Pop Mix",
    description: "AI-generated from your current energetic mood",
    queries: [
      { term: "upbeat pop", lang: "English" },
      { term: "Bollywood party", lang: "Hindi" },
      { term: "Punjabi dance", lang: "Punjabi" },
      { term: "tropical house", lang: "Instrumental" }
    ]
  },
  sad: {
    title: "Heartbreak & Acoustic Nights",
    description: "Soft melodies generated from your current mood",
    queries: [
      { term: "emotional acoustic", lang: "English" },
      { term: "sad Bollywood", lang: "Hindi" },
      { term: "soft piano", lang: "Instrumental" },
      { term: "slow spanish sad", lang: "Spanish" }
    ]
  },
  angry: {
    title: "Intense Phonk & Rap",
    description: "High energy tracks to match your intensity",
    queries: [
      { term: "hard rock", lang: "English" },
      { term: "aggressive rap", lang: "English" },
      { term: "phonk", lang: "Instrumental" },
      { term: "workout metal", lang: "English" }
    ]
  },
  calm: {
    title: "Lo-fi & Ambient Chill",
    description: "Relaxing vibes curated for your calm state",
    queries: [
      { term: "lofi hip hop", lang: "Instrumental" },
      { term: "korean indie cafe", lang: "Korean" },
      { term: "ambient meditation", lang: "Instrumental" },
      { term: "chill soft pop", lang: "English" }
    ]
  },
  neutral: {
    title: "Global Discovery Mix",
    description: "A balanced mix of trending hits and indie gems",
    queries: [
      { term: "trending pop", lang: "English" },
      { term: "indie folk", lang: "English" },
      { term: "bollywood hits", lang: "Hindi" },
      { term: "latin pop", lang: "Spanish" }
    ]
  }
};

/**
 * Fetch songs for one emotion using multiple curated queries.
 * Why: one query often gives repetitive songs, so we mix several streams.
 * How: fetch all queries in parallel, then interleave and deduplicate by trackId.
 * @param {string} emotion
 * @returns {Promise<{ playlistMeta: Object, songs: Array }>}
 */
export const fetchDynamicPlaylist = async (emotion) => {
  const config = moodConfigs[emotion] || moodConfigs['neutral'];
  const limitPerQuery = 10;
  
  try {
    const fetchPromises = config.queries.map(async (query) => {
      // Random offset helps prevent showing the exact same list every time.
      const offset = Math.floor(Math.random() * 20);
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query.term)}&entity=song&limit=${limitPerQuery}&offset=${offset}`;
      const res = await axios.get(url);
      
      return res.data.results
        .filter(s => s.previewUrl)
        .map(s => ({
          ...s,
          customLanguage: query.lang,
          customGenre: query.term
        }));
    });

    const resultsArray = await Promise.all(fetchPromises);
    
    // Interleave results (Pop1, Hindi1, Punjabi1, Pop2, ...).
    const playlist = [];
    const maxLength = Math.max(...resultsArray.map(arr => arr.length));
    
    for (let i = 0; i < maxLength; i++) {
      for (const arr of resultsArray) {
        if (arr[i]) {
          // Ensure duplicates are removed across all query result sets.
          if (!playlist.find(s => s.trackId === arr[i].trackId)) {
            playlist.push(arr[i]);
          }
        }
      }
    }

    return {
      playlistMeta: {
        title: config.title,
        description: config.description,
        totalSongs: playlist.length
      },
      songs: playlist
    };
  } catch (error) {
    console.error("Error fetching dynamic playlist:", error);
    return { playlistMeta: { title: "Error", description: "Failed to load", totalSongs: 0 }, songs: [] };
  }
};
