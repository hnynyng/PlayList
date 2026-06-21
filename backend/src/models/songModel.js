const pool = require('../config/db');

const createSong = async (title, artist, duration, filePath, uploadedBy) => {
  const query = `
    INSERT INTO songs (title, artist, duration, file_path, uploaded_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, artist, duration, file_path, uploaded_by, created_at
  `;
  const result = await pool.query(query, [title, artist, duration, filePath, uploadedBy]);
  return result.rows[0];
};

const getAllSongs = async (limit = 50, offset = 0) => {
  const query = `
    SELECT id, title, artist, duration, file_path, uploaded_by, created_at
    FROM songs
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const getSongById = async (id) => {
  const query = 'SELECT * FROM songs WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const searchSongs = async (query, limit = 50) => {
  const searchQuery = `
    SELECT id, title, artist, duration, file_path, uploaded_by, created_at
    FROM songs
    WHERE title ILIKE $1 OR artist ILIKE $1
    ORDER BY created_at DESC
    LIMIT $2
  `;
  const result = await pool.query(searchQuery, [`%${query}%`, limit]);
  return result.rows;
};

const getSongsByUploader = async (uploadedBy, limit = 50) => {
  const query = `
    SELECT id, title, artist, duration, file_path, uploaded_by, created_at
    FROM songs
    WHERE uploaded_by = $1
    ORDER BY created_at DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [uploadedBy, limit]);
  return result.rows;
};

module.exports = {
  createSong,
  getAllSongs,
  getSongById,
  searchSongs,
  getSongsByUploader,
};
