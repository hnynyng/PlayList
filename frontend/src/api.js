const API_BASE_URL = 'http://localhost:5000';

const api = {
  // Auth
  signup: async (username, email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  // Songs
  getAllSongs: async () => {
    const res = await fetch(`${API_BASE_URL}/songs`);
    return res.json();
  },

  searchSongs: async (query) => {
    const res = await fetch(`${API_BASE_URL}/songs/search?q=${query}`);
    return res.json();
  },

  getUserSongs: async (token) => {
    const res = await fetch(`${API_BASE_URL}/songs/user/my-songs`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  uploadSong: async (token, file, title, artist, duration) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('duration', duration);

    const res = await fetch(`${API_BASE_URL}/songs/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  // Playlists
  getUserPlaylists: async (token) => {
    const res = await fetch(`${API_BASE_URL}/playlists`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  createPlaylist: async (token, name) => {
    const res = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },

  getPlaylistDetails: async (playlistId) => {
    const res = await fetch(`${API_BASE_URL}/playlists/${playlistId}`);
    return res.json();
  },

  addSongToPlaylist: async (token, playlistId, songId) => {
    const res = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ songId }),
    });
    return res.json();
  },

  removeSongFromPlaylist: async (token, playlistId, songId) => {
    const res = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
};

export default api;
