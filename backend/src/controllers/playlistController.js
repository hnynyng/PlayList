const {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  getPlaylistSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} = require('../models/playlistModel');
const { getSongById } = require('../models/songModel');

const createPlaylistHandler = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name required' });
    }

    const playlist = await createPlaylist(name, req.userId);
    res.status(201).json({
      message: 'Playlist created successfully',
      playlist,
    });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserPlaylistsHandler = async (req, res) => {
  try {
    const playlists = await getUserPlaylists(req.userId);
    res.json({ playlists, count: playlists.length });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlaylistByIdHandler = async (req, res) => {
  try {
    const playlist = await getPlaylistById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const songs = await getPlaylistSongs(req.params.id);

    res.json({
      playlist,
      songs,
      songCount: songs.length,
    });
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addSongHandler = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlistId = req.params.id;

    if (!songId) {
      return res.status(400).json({ error: 'Song ID required' });
    }

    const playlist = await getPlaylistById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const song = await getSongById(songId);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const playlistSong = await addSongToPlaylist(playlistId, songId);

    res.status(201).json({
      message: 'Song added to playlist',
      playlistSong,
    });
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return res.status(400).json({ error: 'Song already in playlist' });
    }
    console.error('Add song error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeSongHandler = async (req, res) => {
  try {
    const { id, song_id } = req.params;

    const playlist = await getPlaylistById(id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await removeSongFromPlaylist(id, song_id);

    res.json({ message: 'Song removed from playlist' });
  } catch (error) {
    console.error('Remove song error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePlaylistHandler = async (req, res) => {
  try {
    const playlist = await getPlaylistById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.owner_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await deletePlaylist(req.params.id);

    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPlaylistHandler,
  getUserPlaylistsHandler,
  getPlaylistByIdHandler,
  addSongHandler,
  removeSongHandler,
  deletePlaylistHandler,
};
