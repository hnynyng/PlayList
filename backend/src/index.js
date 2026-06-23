require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { authLimiter, uploadLimiter } = require('./middleware/rateLimiter');
const { fileValidationMiddleware } = require('./middleware/fileValidation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Apply rate limiting
app.use('/auth', authLimiter);

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/songs', require('./routes/songs'));
app.use('/playlists', require('./routes/playlists'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Playlist API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
