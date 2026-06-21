const express = require('express');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');
const {
  uploadSong,
  getAllSongsHandler,
  searchSongsHandler,
  getSongByIdHandler,
  streamSong,
  getUserSongs,
} = require('../controllers/songController');

const router = express.Router();

router.get('/', getAllSongsHandler);
router.get('/search', searchSongsHandler);
router.post('/upload', verifyToken, upload.single('file'), uploadSong);
router.get('/user/my-songs', verifyToken, getUserSongs);
router.get('/:id', getSongByIdHandler);
router.get('/:id/stream', streamSong);

module.exports = router;
