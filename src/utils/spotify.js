export async function getSongs(genre) {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${genre}&media=music&limit=5`
  );

  const data = await res.json();

  return data.results.map((song) => ({
    id: song.trackId,
    name: song.trackName,
    artists: [{ name: song.artistName }],
    preview_url: song.previewUrl,
  }));
}