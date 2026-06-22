const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { validatePlaylistCreate } = require('../middleware/validation');
const {
  createPlaylistHandler,
  getUserPlaylistsHandler,
  getPlaylistByIdHandler,
  addSongHandler,
  removeSongHandler,
  deletePlaylistHandler,
} = require('../controllers/playlistController');

const router = express.Router();

router.get('/', verifyToken, getUserPlaylistsHandler);
router.post('/', verifyToken, validatePlaylistCreate, createPlaylistHandler);
router.get('/:id', getPlaylistByIdHandler);
router.post('/:id/songs', verifyToken, addSongHandler);
router.delete('/:id/songs/:song_id', verifyToken, removeSongHandler);
router.delete('/:id', verifyToken, deletePlaylistHandler);

module.exports = router;
