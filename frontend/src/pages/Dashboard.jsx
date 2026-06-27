import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import MusicPlayer from '../components/MusicPlayer';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingPlaylistId, setViewingPlaylistId] = useState(null);
  const [viewingPlaylistName, setViewingPlaylistName] = useState(null);
  const [viewingPlaylistSongs, setViewingPlaylistSongs] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', artist: '', file: null });
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [addToPlaylistSongId, setAddToPlaylistSongId] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const songsData = await api.getAllSongs();
      const playlistsData = await api.getUserPlaylists(token);
      setSongs(songsData.songs || []);
      setPlaylists(playlistsData.playlists || []);
      setViewingPlaylistId(null);
      setCurrentSongIndex(0);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title || !uploadForm.artist) {
      alert('Please fill all fields');
      return;
    }

    try {
      const audio = new Audio(URL.createObjectURL(uploadForm.file));
      audio.onloadedmetadata = async () => {
        const duration = Math.floor(audio.duration);
        const result = await api.uploadSong(token, uploadForm.file, uploadForm.title, uploadForm.artist, duration);
        if (result.error) {
          alert(`Upload error: ${result.error}`);
        } else {
          alert('Song uploaded!');
          setShowUploadModal(false);
          setUploadForm({ title: '', artist: '', file: null });
          fetchData();
        }
      };
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handlePlaylistClick = async (playlistId, playlistName) => {
    try {
      const details = await api.getPlaylistDetails(playlistId);
      setViewingPlaylistId(playlistId);
      setViewingPlaylistName(playlistName);
      setViewingPlaylistSongs(details.songs || []);
      setCurrentSongIndex(0);
      setSearchQuery('');
      setSearchResults(null);
    } catch (err) {
      console.error('Failed to load playlist', err);
    }
  };

  const handleBackToAllSongs = () => {
    setViewingPlaylistId(null);
    setViewingPlaylistName(null);
    setViewingPlaylistSongs([]);
    setCurrentSongIndex(0);
    setSearchQuery('');
    setSearchResults(null);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const results = await api.searchSongs(query);
      setSearchResults(results.songs || []);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    }
  };

  const handleAddToPlaylist = async (songId) => {
    if (!selectedPlaylistId) return;
    const result = await api.addSongToPlaylist(token, selectedPlaylistId, songId);
    if (result.error) {
      alert(result.error);
    } else {
      setAddToPlaylistSongId(null);
      setSelectedPlaylistId('');
    }
  };

  const handleRemoveSongFromPlaylist = async (songId) => {
    if (!viewingPlaylistId) return;
    try {
      await api.removeSongFromPlaylist(token, viewingPlaylistId, songId);
      const details = await api.getPlaylistDetails(viewingPlaylistId);
      setViewingPlaylistSongs(details.songs || []);
      alert('Song removed!');
    } catch (err) {
      alert('Failed to remove song');
    }
  };

  const currentSongs = viewingPlaylistId ? viewingPlaylistSongs : songs;
  const currentTitle = viewingPlaylistId ? viewingPlaylistName : `All Songs (${songs.length})`;

  if (loading) return <div className="dashboard"><p>Loading...</p></div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎵 Playlist</h1>
        <div className="header-right">
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="player-container">
        {viewingPlaylistId && (
          <button className="back-button" onClick={handleBackToAllSongs}>
            ← {viewingPlaylistName}
          </button>
        )}
        {currentSongs.length > 0 && (
          <MusicPlayer
            songs={currentSongs}
            currentSongIndex={currentSongIndex}
            onSongChange={setCurrentSongIndex}
          />
        )}
      </div>

      <div className="dashboard-content">
        <section className="section">
          <div className="section-header">
            <h2>Your Playlists ({playlists.length})</h2>
            <button className="btn-primary" onClick={() => {
              const name = prompt('Playlist name:');
              if (name) {
                api.createPlaylist(token, name).then(() => fetchData());
              }
            }}>
              + New Playlist
            </button>
          </div>
          <div className="playlists-grid">
            {playlists.map(p => (
              <div
                key={p.id}
                className={`playlist-card ${viewingPlaylistId === p.id ? 'selected' : ''}`}
                onClick={() => handlePlaylistClick(p.id, p.name)}
              >
                <div className="playlist-icon">📁</div>
                <h3>{p.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>{currentTitle}</h2>
            {!viewingPlaylistId && (
              <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
                + Upload Song
              </button>
            )}
          </div>
          {!viewingPlaylistId && (
            <input
              type="text"
              placeholder="🔍 Search by title or artist..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          )}
          <div className="songs-list">
            {(searchResults !== null ? searchResults : currentSongs).length === 0 ? (
              <p style={{ textAlign: 'center', color: '#b3b3b3' }}>
                {searchQuery ? 'No songs found' : 'No songs here'}
              </p>
            ) : (
              (searchResults !== null ? searchResults : currentSongs).map(song => (
                <div key={song.id} className="song-item">
                  <div className="song-info">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                  <div className="song-actions">
                    <button
                      className="btn-primary"
                      onClick={() => {
                        const index = currentSongs.findIndex(s => s.id === song.id);
                        if (index !== -1) {
                          setCurrentSongIndex(index);
                        }
                      }}
                    >
                      ▶ Play
                    </button>
                    {viewingPlaylistId ? (
                      <button
                        className="btn-secondary"
                        onClick={() => handleRemoveSongFromPlaylist(song.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      addToPlaylistSongId === song.id ? (
                        <span className="song-actions">
                          <select value={selectedPlaylistId} onChange={e => setSelectedPlaylistId(e.target.value)}>
                            <option value="">Pick playlist...</option>
                            {playlists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                          <button className="btn-primary" onClick={() => handleAddToPlaylist(song.id)}>Add</button>
                          <button className="btn-secondary" onClick={() => setAddToPlaylistSongId(null)}>Cancel</button>
                        </span>
                      ) : (
                        <button className="btn-secondary" onClick={() => setAddToPlaylistSongId(song.id)}>
                          + Playlist
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {showUploadModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Upload Song</h2>
            <form onSubmit={handleUpload}>
              <input
                type="text"
                placeholder="Title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Artist"
                value={uploadForm.artist}
                onChange={(e) => setUploadForm({ ...uploadForm, artist: e.target.value })}
                required
              />
              <input
                type="file"
                accept="audio/mpeg"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Upload</button>
                <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
