const validator = require('validator');

const validateSignup = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || typeof username !== 'string' || username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Username must be 3-50 characters' });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain uppercase letter and number' });
  }

  req.body.username = validator.escape(username);
  req.body.email = validator.normalizeEmail(email);

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!password || password.length < 1) {
    return res.status(400).json({ error: 'Password required' });
  }

  req.body.email = validator.normalizeEmail(email);

  next();
};

const validateSongUpload = (req, res, next) => {
  const { title, artist, duration } = req.body;

  if (!title || typeof title !== 'string' || title.length < 1 || title.length > 200) {
    return res.status(400).json({ error: 'Title must be 1-200 characters' });
  }

  if (!artist || typeof artist !== 'string' || artist.length < 1 || artist.length > 200) {
    return res.status(400).json({ error: 'Artist must be 1-200 characters' });
  }

  if (!duration || isNaN(duration) || duration < 1 || duration > 3600) {
    return res.status(400).json({ error: 'Duration must be 1-3600 seconds' });
  }

  req.body.title = validator.escape(title);
  req.body.artist = validator.escape(artist);
  req.body.duration = Math.floor(duration);

  next();
};

const validatePlaylistCreate = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.length < 1 || name.length > 200) {
    return res.status(400).json({ error: 'Playlist name must be 1-200 characters' });
  }

  req.body.name = validator.escape(name);

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateSongUpload,
  validatePlaylistCreate,
};
