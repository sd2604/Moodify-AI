export async function getSongs(genre) {
  const offset = Math.floor(Math.random() * 50);

  const res = await fetch(
    `https://itunes.apple.com/search?term=${genre}&media=music&limit=15&offset=${offset}`
  );

  const data = await res.json();

  const uniqueSongs = [];
  const seen = new Set();

  data.results.forEach((song) => {
    if (!song.previewUrl) return; // skip invalid songs

    if (!seen.has(song.trackName)) {
      seen.add(song.trackName);

      uniqueSongs.push({
        id: song.trackId,
        name: song.trackName,
        artists: [{ name: song.artistName }],
        preview_url: song.previewUrl,
      });
    }
  });

  return uniqueSongs.slice(0, 8);
}