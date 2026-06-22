# 🎵 Playlist App - Project Status & Handoff

**Date:** June 22, 2026  
**Status:** MVP nearly complete (Phases 1-4 done)  
**Next:** Phase 5 (Music Player), Phase 6 (Deployment)

---

## Project Overview

Full-stack music streaming + playlist management app.  
- **Backend:** Node.js + Express + PostgreSQL  
- **Frontend:** React + Vite + Axios  
- **Authentication:** JWT (OAuth planned for later)  
- **File Storage:** Local filesystem (MP3 uploads)

---

## ✅ Completed Phases

### Phase 1: Authentication (DONE)
- User signup/login with JWT tokens
- Password hashing with bcryptjs
- Files: `backend/src/controllers/authController.js`, `backend/src/models/userModel.js`, `backend/src/middleware/auth.js`
- Test: `POST /auth/signup`, `POST /auth/login`

### Phase 2: Song Upload & Management (DONE)
- Upload MP3 files (multer middleware, 50MB limit)
- List all songs, search, get details, stream audio
- Store metadata: title, artist, duration, file_path
- Files: `backend/src/controllers/songController.js`, `backend/src/models/songModel.js`, `backend/src/middleware/upload.js`
- Endpoints: `POST /songs/upload`, `GET /songs`, `GET /songs/search?q=`, `GET /songs/:id/stream`

### Phase 3: Playlist Management (DONE)
- Create playlists, add/remove songs
- List user's playlists, view playlist details
- Authorization: only owner can modify
- Files: `backend/src/controllers/playlistController.js`, `backend/src/models/playlistModel.js`
- Endpoints: `GET/POST /playlists`, `GET /playlists/:id`, `POST/DELETE /playlists/:id/songs`

### Phase 4: Frontend UI (DONE)
- **Auth:** Login/Signup page
- **Dashboard:** Song list, playlist management, upload modal
- **Playlist Detail:** View songs in playlist, remove songs
- Files:
  - `frontend/src/AuthContext.jsx` - JWT token management
  - `frontend/src/api.js` - API client for all endpoints
  - `frontend/src/pages/Login.jsx`, `frontend/src/pages/Dashboard.jsx`
  - `frontend/src/styles/Auth.css`, `frontend/src/styles/Dashboard.css`

---

## 🔄 Current State

### Backend Status
- ✅ All API endpoints working (tested with PowerShell)
- ✅ Database schema set up (PostgreSQL running in Docker)
- ✅ Authentication working (JWT tokens)
- ✅ Song upload working (test-song.mp3 uploaded)
- ✅ Playlists working (CRUD + song management)
- 📝 **Note:** Music player endpoint `/songs/:id/stream` exists but frontend doesn't use it yet

### Frontend Status
- ✅ Login/Signup page
- ✅ Dashboard with songs + playlists
- ✅ Playlist detail modal (click playlist to see songs)
- ✅ Upload modal with auto-duration detection
- ⏳ Music player (NOT STARTED - Phase 5)

### Database
- PostgreSQL running in Docker: `playlist-db`
- Schema: users, songs, playlists, playlist_songs
- Test account: `john@example.com` / `mypassword123`

---

## 🚀 Next Steps

### Phase 5: Music Player (TODO)
Build audio player component with:
- Play/pause/skip controls
- Progress bar with seek
- Volume control
- Duration display
- Now playing info

**Files to create:**
- `frontend/src/components/MusicPlayer.jsx` - player component
- `frontend/src/styles/MusicPlayer.css` - player styles
- Update `frontend/src/pages/Dashboard.jsx` to include player

**API endpoint to use:** `GET /songs/:id/stream` (already exists in backend)

### Phase 6: Deployment (TODO)
- Docker: containerize backend + frontend
- Railway: deploy test
- AWS EC2: deploy production
- GitHub Actions: CI/CD pipeline

---

## 📁 Project Structure

```
PlayList/
├── backend/
│   ├── src/
│   │   ├── index.js              (Express server)
│   │   ├── config/db.js          (PostgreSQL connection)
│   │   ├── routes/               (auth, songs, playlists)
│   │   ├── controllers/          (business logic)
│   │   ├── models/               (database queries)
│   │   └── middleware/           (auth, upload)
│   ├── uploads/                  (MP3 files stored here)
│   ├── .env                      (env variables)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/                (Login, Dashboard)
│   │   ├── components/           (to add: MusicPlayer)
│   │   ├── styles/               (Auth, Dashboard CSS)
│   │   ├── AuthContext.jsx       (JWT state management)
│   │   ├── api.js                (API client)
│   │   └── App.jsx               (root component)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── schema.sql                (PostgreSQL tables)
├── README.md
└── PROJECT_STATUS.md             (this file)
```

---

## 🔑 Key Files & Important Notes

### Backend
- **Entry point:** `backend/src/index.js`
- **Auth middleware:** `backend/src/middleware/auth.js` - validates JWT token
- **Upload middleware:** `backend/src/middleware/upload.js` - handles MP3 files
- **Environment:** `backend/.env` - contains `JWT_SECRET`, `DATABASE_URL`, `PORT=5000`

### Frontend
- **Entry point:** `frontend/src/main.jsx`
- **Root component:** `frontend/src/App.jsx` - wraps with AuthProvider
- **Auth state:** `frontend/src/AuthContext.jsx` - manages JWT token in localStorage
- **API client:** `frontend/src/api.js` - all fetch calls to backend
- **Dev server:** Runs on `http://localhost:3000`

### Database
- PostgreSQL running in Docker
- Connection string: `postgres://postgres:dev_password@localhost:5432/playlist`
- Tables: users, songs, playlists, playlist_songs
- Test song: uploaded MP3 at `backend/uploads/[filename]`

---

## 🎯 API Endpoints (Complete)

### Auth
```
POST /auth/signup          - Register new user
POST /auth/login           - Login (returns JWT token)
POST /auth/logout          - Logout
```

### Songs
```
GET /songs                 - List all songs
POST /songs/upload         - Upload MP3 (requires auth)
GET /songs/search?q=query  - Search by title/artist
GET /songs/:id             - Get song details
GET /songs/:id/stream      - Stream MP3 file
GET /songs/user/my-songs   - Get user's uploaded songs (requires auth)
```

### Playlists
```
GET /playlists             - List user's playlists (requires auth)
POST /playlists            - Create playlist (requires auth)
GET /playlists/:id         - Get playlist details + songs
POST /playlists/:id/songs  - Add song to playlist (requires auth)
DELETE /playlists/:id/songs/:song_id - Remove song (requires auth)
DELETE /playlists/:id      - Delete playlist (requires auth)
```

---

## 🛠️ How to Run

### Prerequisites
- Node.js v24+ installed
- Docker installed
- PostgreSQL running: `docker ps` should show `playlist-db`

### Start Backend
```bash
cd backend
npm install  # (if not done)
npm run dev
```
Runs on: `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm install  # (if not done)
npm run dev
```
Runs on: `http://localhost:3000`

### Database
PostgreSQL already running in Docker. To import schema:
```bash
psql -h localhost -U postgres -d playlist -f database/schema.sql
```

---

## 💡 Important Implementation Details

### JWT Token Flow
1. User logs in → receives JWT token
2. Token stored in `localStorage` via AuthContext
3. Token sent in `Authorization: Bearer {token}` header for protected endpoints
4. Token valid for 7 days

### File Upload
- Multer stores files in `backend/uploads/` with unique timestamp names
- File path stored in database: `uploads/[filename]`
- API endpoint `/songs/:id/stream` serves the file with `audio/mpeg` MIME type

### Playlist Songs
- `playlist_songs` table has ordering (`order` column)
- Songs can be added/removed without affecting playlist
- Deleting playlist cascades and deletes all playlist_songs entries

---

## 🔮 Future Features (Post-MVP)

### Phase 5 (Now)
- Music player with play/pause/skip
- Progress bar & seek
- Volume control

### Phase 6 (Later)
- Deployment (Docker, Railway, AWS EC2)
- CI/CD (GitHub Actions)

### Phase 7+ (Future Ideas)
- **OAuth (Google/Apple)** - replace JWT signup
- **Spotify Integration** - detect Spotify on PC, sync library, play tracks
- **User profiles** - follow users, share playlists
- **Social features** - comments, likes, recommendations
- **Advanced player** - queue, shuffle, repeat, lyrics display
- **Analytics** - play history, top songs
- **S3 storage** - move MP3s to AWS S3

---

## ⚠️ Known Issues & Gotchas

1. **File upload size:** Limited to 50MB in multer config
2. **CORS:** Frontend proxy configured in `frontend/vite.config.js` for `/api` prefix
3. **Token persistence:** JWT stored in localStorage, cleared on logout
4. **No refresh token:** Token expires after 7 days (login again)
5. **Local file storage:** MP3s stored on disk, not persistent if server restarts
6. **No edit endpoints:** Can't edit song/playlist names once created

---

## 🧪 Test Credentials

**Account 1 (created during session):**
- Email: `john@example.com`
- Password: `mypassword123`
- Has 1 song uploaded: `test-song.mp3` (168 seconds)
- Has 1 playlist: (created during testing)

**To create new account:** Use signup form at `http://localhost:3000`

---

## 📝 Git Commit History

- `394a979` - Add playlist detail view modal
- `5c09b2f` - Phase 4: Build React frontend UI
- `7108ddb` - Phase 3: Implement playlist management
- `c8a2cd2` - Phase 2: Implement song upload and management
- `624c0d9` - Phase 1: Implement user authentication with JWT
- `9e2dd9f` - Initial project setup

---

## 🤝 Handoff Instructions

If starting a new session with Claude Code:
1. Provide this file (`PROJECT_STATUS.md`)
2. Ask Claude to read it first
3. Continue with Phase 5 (Music Player)
4. It has full project context + current state

---

**Last updated:** June 22, 2026  
**Next session focus:** Phase 5 Music Player
