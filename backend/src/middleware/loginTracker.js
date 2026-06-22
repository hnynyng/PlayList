// Shared login attempt tracker used by both rate limiter and auth controller
const failedLoginAttempts = {};

const addFailedAttempt = (clientKey) => {
  if (!failedLoginAttempts[clientKey]) {
    failedLoginAttempts[clientKey] = [];
  }
  failedLoginAttempts[clientKey].push(Date.now());
};

const getFailedAttempts = (clientKey) => {
  if (!failedLoginAttempts[clientKey]) {
    return [];
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000;

  // Remove attempts older than 15 minutes
  failedLoginAttempts[clientKey] = failedLoginAttempts[clientKey].filter(
    timestamp => now - timestamp < windowMs
  );

  return failedLoginAttempts[clientKey];
};

const clearFailedAttempts = (clientKey) => {
  failedLoginAttempts[clientKey] = [];
};

module.exports = {
  addFailedAttempt,
  getFailedAttempts,
  clearFailedAttempts,
};
