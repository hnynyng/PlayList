const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all songs (TODO)' });
});

router.post('/upload', (req, res) => {
  res.json({ message: 'Upload song (TODO)' });
});

router.get('/search', (req, res) => {
  res.json({ message: 'Search songs (TODO)' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get song details (TODO)' });
});

router.get('/:id/stream', (req, res) => {
  res.json({ message: 'Stream audio (TODO)' });
});

module.exports = router;
