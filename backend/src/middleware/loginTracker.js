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
    failedLoginAttempts[clientKey] = [];
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  // Remove attempts older than window
  const validAttempts = failedLoginAttempts[clientKey].filter(
    timestamp => now - timestamp < windowMs
  );

  failedLoginAttempts[clientKey] = validAttempts;
  return validAttempts;
};

const clearFailedAttempts = (clientKey) => {
  failedLoginAttempts[clientKey] = [];
};

module.exports = {
  addFailedAttempt,
  getFailedAttempts,
  clearFailedAttempts,
};
