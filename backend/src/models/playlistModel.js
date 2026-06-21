const pool = require('../config/db');

const createPlaylist = async (name, ownerId) => {
  const query = `
    INSERT INTO playlists (name, owner_id)
    VALUES ($1, $2)
    RETURNING id, name, owner_id, created_at
  `;
  const result = await pool.query(query, [name, ownerId]);
  return result.rows[0];
};

const getUserPlaylists = async (ownerId) => {
  const query = `
    SELECT id, name, owner_id, created_at
    FROM playlists
    WHERE owner_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [ownerId]);
  return result.rows;
};

const getPlaylistById = async (id) => {
  const query = 'SELECT * FROM playlists WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getPlaylistSongs = async (playlistId) => {
  const query = `
    SELECT s.id, s.title, s.artist, s.duration, s.file_path, ps."order"
    FROM playlist_songs ps
    JOIN songs s ON ps.song_id = s.id
    WHERE ps.playlist_id = $1
    ORDER BY ps."order" ASC
  `;
  const result = await pool.query(query, [playlistId]);
  return result.rows;
};

const addSongToPlaylist = async (playlistId, songId) => {
  const query = `
    SELECT MAX("order") as max_order FROM playlist_songs WHERE playlist_id = $1
  `;
  const result = await pool.query(query, [playlistId]);
  const nextOrder = (result.rows[0]?.max_order || 0) + 1;

  const insertQuery = `
    INSERT INTO playlist_songs (playlist_id, song_id, "order")
    VALUES ($1, $2, $3)
    RETURNING id, playlist_id, song_id, "order"
  `;
  const insertResult = await pool.query(insertQuery, [playlistId, songId, nextOrder]);
  return insertResult.rows[0];
};

const removeSongFromPlaylist = async (playlistId, songId) => {
  const query = 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2';
  await pool.query(query, [playlistId, songId]);
  return { message: 'Song removed from playlist' };
};

const deletePlaylist = async (id) => {
  const query = 'DELETE FROM playlists WHERE id = $1';
  await pool.query(query, [id]);
  return { message: 'Playlist deleted' };
};

module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  getPlaylistSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
};
