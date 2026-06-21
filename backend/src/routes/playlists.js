const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get user playlists (TODO)' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create playlist (TODO)' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get playlist details (TODO)' });
});

router.post('/:id/songs', (req, res) => {
  res.json({ message: 'Add song to playlist (TODO)' });
});

router.delete('/:id/songs/:song_id', (req, res) => {
  res.json({ message: 'Remove song from playlist (TODO)' });
});

module.exports = router;
