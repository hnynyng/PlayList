const fs = require('fs');
const path = require('path');
const { createSong, getAllSongs, getSongById, searchSongs, getSongsByUploader } = require('../models/songModel');

const uploadSong = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, artist, duration } = req.body;

    if (!title || !artist || !duration) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to delete file:', unlinkErr);
      }
      return res.status(400).json({ error: 'Title, artist, and duration required' });
    }

    const filePath = `uploads/${req.file.filename}`;
    const song = await createSong(title, artist, parseInt(duration), filePath, req.userId);

    res.status(201).json({
      message: 'Song uploaded successfully',
      song,
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to delete file after error:', unlinkErr);
      }
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllSongsHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const songs = await getAllSongs(limit, offset);
    res.json({ songs, count: songs.length });
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchSongsHandler = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const songs = await searchSongs(q);
    res.json({ songs, count: songs.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSongByIdHandler = async (req, res) => {
  try {
    const song = await getSongById(req.params.id);

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const streamSong = async (req, res) => {
  try {
    const song = await getSongById(req.params.id);

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const filePath = path.join(__dirname, '../../', song.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const mimeType = 'audio/mpeg';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Accept-Ranges', 'bytes');

    const file = fs.createReadStream(filePath);
    file.pipe(res);
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserSongs = async (req, res) => {
  try {
    const songs = await getSongsByUploader(req.userId);
    res.json({ songs, count: songs.length });
  } catch (error) {
    console.error('Get user songs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  uploadSong,
  getAllSongsHandler,
  searchSongsHandler,
  getSongByIdHandler,
  streamSong,
  getUserSongs,
};
