const rateLimit = require('express-rate-limit');
const { getFailedAttempts } = require('./loginTracker');

// Auth limiter - uses shared login tracker
const authLimiter = (req, res, next) => {
  const clientKey = req.ip;
  const attempts = getFailedAttempts(clientKey);

  // Check if rate limited (max 5 failed attempts)
  if (attempts.length >= 5) {
    return res.status(429).json({ error: 'Too many login attempts, please try again later' });
  }

  next();
};

// Upload limiter - 10 uploads per hour (per IP/user combination)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Upload limit exceeded, max 10 uploads per hour',
  skip: (req) => !req.userId,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  uploadLimiter,
};
