const express = require('express');
const router = express.Router();

// Placeholder
router.post('/signup', (req, res) => {
  res.json({ message: 'Signup endpoint (TODO)' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint (TODO)' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint (TODO)' });
});

module.exports = router;
