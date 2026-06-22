const rateLimit = require('express-rate-limit');

// General API limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter - tracks failed login attempts in memory
const failedLoginAttempts = {};

const authLimiter = (req, res, next) => {
  const clientKey = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  if (!failedLoginAttempts[clientKey]) {
    failedLoginAttempts[clientKey] = [];
  }

  // Remove attempts older than 15 minutes
  failedLoginAttempts[clientKey] = failedLoginAttempts[clientKey].filter(
    timestamp => now - timestamp < windowMs
  );

  // Check if rate limited (max 5 failed attempts)
  if (failedLoginAttempts[clientKey].length >= 5) {
    return res.status(429).json({ error: 'Too many login attempts, please try again later' });
  }

  // Store the attempt timestamp for later (controller will increment on failure)
  res.locals.loginAttemptKey = clientKey;
  next();
};

// Upload limiter - 10 uploads per hour per user
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Upload limit exceeded, max 10 uploads per hour',
  keyGenerator: (req) => req.userId || req.ip,
  skip: (req) => !req.userId,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
};
