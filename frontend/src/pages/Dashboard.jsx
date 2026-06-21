import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistDetail, setPlaylistDetail] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', artist: '', file: null });

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
        if (!result.error) {
          alert('Song uploaded!');
          setShowUploadModal(false);
          setUploadForm({ title: '', artist: '', file: null });
          fetchData();
        }
      };
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleAddToPlaylist = async (songId) => {
    if (!selectedPlaylist) {
      alert('Select a playlist first');
      return;
    }
    try {
      await api.addSongToPlaylist(token, selectedPlaylist, songId);
      alert('Song added to playlist!');
      if (playlistDetail?.playlist.id === selectedPlaylist) {
        const details = await api.getPlaylistDetails(selectedPlaylist);
        setPlaylistDetail(details);
      }
    } catch (err) {
      alert('Failed to add song');
    }
  };

  const handleViewPlaylist = async (playlistId) => {
    try {
      const details = await api.getPlaylistDetails(playlistId);
      setPlaylistDetail(details);
    } catch (err) {
      console.error('Failed to load playlist', err);
    }
  };

  const handleRemoveSongFromPlaylist = async (songId) => {
    if (!playlistDetail) return;
    try {
      await api.removeSongFromPlaylist(token, playlistDetail.playlist.id, songId);
      const details = await api.getPlaylistDetails(playlistDetail.playlist.id);
      setPlaylistDetail(details);
      alert('Song removed!');
    } catch (err) {
      alert('Failed to remove song');
    }
  };

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
                className={`playlist-card ${selectedPlaylist === p.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPlaylist(p.id);
                  handleViewPlaylist(p.id);
                }}
              >
                <div className="playlist-icon">📁</div>
                <h3>{p.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>All Songs ({songs.length})</h2>
            <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
              + Upload Song
            </button>
          </div>
          <div className="songs-list">
            {songs.map(song => (
              <div key={song.id} className="song-item">
                <div className="song-info">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => handleAddToPlaylist(song.id)}
                  disabled={!selectedPlaylist}
                >
                  Add to Playlist
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {playlistDetail && (
        <div className="modal">
          <div className="modal-content">
            <h2>{playlistDetail.playlist.name}</h2>
            <div className="playlist-songs">
              {playlistDetail.songs.length === 0 ? (
                <p>No songs in this playlist</p>
              ) : (
                playlistDetail.songs.map(song => (
                  <div key={song.id} className="song-item">
                    <div className="song-info">
                      <h3>{song.title}</h3>
                      <p>{song.artist}</p>
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={() => handleRemoveSongFromPlaylist(song.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="modal-buttons">
              <button type="button" className="btn-secondary" onClick={() => setPlaylistDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
