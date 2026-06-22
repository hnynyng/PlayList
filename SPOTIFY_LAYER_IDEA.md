# 🎵 Spotify Layer Wrapper - Project Idea

**Concept:** A minimal, artwork-focused UI wrapper on top of Spotify that simplifies the player experience and removes clutter.

**Date Created:** June 22, 2026  
**Status:** Future project idea (Phase 7+)

---

## 📋 Overview

Build a desktop/web app that connects to Spotify and provides a **cleaner, simpler interface** focused on:
- Music playback control
- Large artwork display
- Timeline/progress management
- Device switching
- Essential controls only (no clutter)

---

## ✨ Core Features

### 1. Playback Controls
- **Play/Pause** - simple button
- **Next/Previous** - skip through queue
- **Shuffle** - toggle shuffle mode
- **Repeat** - cycle through (off → repeat all → repeat one)
- **Volume** - slider control

### 2. Now Playing Display
- **Large album artwork** - centered on main page
- **Song title** - clear, large text
- **Artist name** - simple display
- **NO clutter** - no credits, tour dates, merchandise, recommendations, ads
- Clean minimal aesthetic (like vinyl record player)

### 3. Progress & Timeline
- **Timeline bar** - show current position
- **Seek ability** - click/drag to jump to any point
- **Duration display** - current time / total time
- **Visual waveform** (optional) - show song structure

### 4. Device Management
- **Device selector** - dropdown to choose playback device
- **Connect to device** - available speakers/phones/computers
- **Quick switch** - seamless device handoff

### 5. Minimal Extras
- **Queue view** (optional) - peek at next songs
- **Keyboard shortcuts** - spacebar play/pause, arrow keys skip, etc.
- **Dark theme** - Spotify-inspired dark UI
- **Responsive** - works on desktop, tablet

---

## 🎨 UI/UX Vision

### Layout
```
┌─────────────────────────────┐
│    Spotify Layer Player     │
├─────────────────────────────┤
│                             │
│        [Album Art]          │  (Large, centered)
│         (500x500px)         │
│                             │
│    Song Title               │  (Large, bold)
│    Artist Name              │  (Subtle, smaller)
│                             │
│  0:45 ━━━━●━━━━ 3:20        │  (Timeline with seek)
│                             │
│  [⏮] [⏸] [⏭] [🔀] [🔁]     │  (Playback controls)
│                             │
│  🔊 ━━━━●━━━ 70%           │  (Volume)
│                             │
│  📱 [Device Selector ▼]     │  (Current device)
└─────────────────────────────┘
```

### Design Principles
- **Minimalist** - only essential controls visible
- **Artwork-first** - large album art is the hero
- **Dark mode** - eye-friendly
- **No ads/recommendations** - focus on current song
- **Keyboard shortcuts** - power users can control without mouse

---

## 🛠️ Technical Approach

### Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **API:** Spotify Web API + Playback SDK
- **Desktop (optional):** Electron (for system integration)
- **State:** Redux or Context API (track playback state)

### Implementation Steps

#### Phase 1: Spotify Authentication
1. Register app with Spotify Developer
2. Implement OAuth flow (user logs in with Spotify)
3. Get access token + refresh token
4. Store tokens securely

#### Phase 2: Basic Playback
1. Fetch currently playing track
2. Implement play/pause
3. Implement next/previous
4. Display track info + artwork

#### Phase 3: Advanced Controls
1. Seek/timeline bar
2. Volume control
3. Shuffle/repeat
4. Device selection

#### Phase 4: UI Polish
1. Artwork display (large, centered)
2. Keyboard shortcuts
3. Responsive design
4. Dark theme

#### Phase 5: Desktop App (Optional)
1. Wrap with Electron
2. System media controls integration
3. Tray icon
4. Always-on-top window option

---

## 🔑 Key APIs & Libraries

### Spotify Web API
```
GET /v1/me/player/currently-playing  - Get current track
PUT /v1/me/player/play               - Resume playback
PUT /v1/me/player/pause              - Pause playback
POST /v1/me/player/next              - Skip to next
POST /v1/me/player/previous          - Go to previous
PUT /v1/me/player/shuffle            - Toggle shuffle
PUT /v1/me/player/repeat             - Set repeat mode
PUT /v1/me/player/volume             - Set volume
PUT /v1/me/player/seek_position      - Seek to position
GET /v1/me/player/devices            - List devices
PUT /v1/me/player/devices            - Switch device
```

### Spotify Web Playback SDK
```javascript
const player = new Spotify.Player({
  name: "Spotify Layer",
  getOAuthToken: callback => { ... },
  volume: 0.5
});

player.addListener('player_state_changed', state => { ... });
```

---

## 🎯 Unique Selling Points

1. **No Clutter** - removes artist merch, tour dates, ads
2. **Artwork Focus** - beautiful display of album art
3. **Minimal Design** - vinyl record player aesthetic
4. **Keyboard Shortcuts** - power-user friendly
5. **Device Control** - easy multi-device switching
6. **Open Source** - can customize further

---

## ⚠️ Challenges

### Technical
- **Spotify API limitations** - free tier has rate limits, some features require Premium
- **Token refresh** - need to handle token expiry gracefully
- **Real-time sync** - keeping UI in sync with actual playback state
- **Device switching** - may have latency/delays

### Legal/Business
- **Spotify ToS** - must comply with Spotify terms (no ads, proper attribution)
- **Licensing** - Spotify controls when/where content plays
- **Premium requirement** - some features require Spotify Premium

### UX
- **Keyboard shortcuts** - need to avoid conflicts with OS/browser
- **Mobile support** - Spotify API limits mobile playback
- **Offline mode** - Spotify offline playlists won't work through API

---

## 📊 Project Scope

| Phase | Scope | Effort | Timeline |
|-------|-------|--------|----------|
| 1 | Spotify Auth + basic playback | 2 days | Week 1 |
| 2 | Advanced controls (seek, volume, shuffle) | 2 days | Week 1-2 |
| 3 | Device switching | 1 day | Week 2 |
| 4 | UI/UX polish (dark theme, responsive) | 3 days | Week 2-3 |
| 5 | Electron desktop app (optional) | 3 days | Week 3-4 |
| **Total** | **Full MVP** | **~10 days** | **~1 month** |

---

## 💡 Feature Ideas (Future Enhancements)

### Core
- [ ] Search songs/artists
- [ ] Playlist management
- [ ] Liked songs display
- [ ] Recently played
- [ ] Queue management
- [ ] Lyrics display (sync with song)

### Advanced
- [ ] Custom themes (light/dark/custom colors)
- [ ] Visualizer/equalizer
- [ ] Song statistics (play history, top tracks)
- [ ] Multi-user support (household)
- [ ] Remote control via phone
- [ ] Discord Rich Presence (show now playing)
- [ ] Scrobbling to Last.fm

### Integration
- [ ] YouTube Music as fallback
- [ ] Apple Music support
- [ ] Local music player (like current Playlist app)
- [ ] Podcast support

---

## 🚀 Getting Started (When Ready)

### Prerequisites
1. Spotify Developer account (free)
2. Create app in Spotify Developer Dashboard
3. Get Client ID & Client Secret
4. Set redirect URI
5. Spotify Premium account (for full API access)

### Initial Setup
```bash
npm create vite@latest spotify-layer -- --template react
npm install axios react-router-dom
# Set up Spotify OAuth flow
# Create playback components
```

### Key File Structure
```
spotify-layer/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          (Spotify OAuth)
│   │   └── Player.jsx         (Main player)
│   ├── components/
│   │   ├── NowPlaying.jsx     (Album art + info)
│   │   ├── Controls.jsx       (Playback buttons)
│   │   ├── Timeline.jsx       (Progress bar)
│   │   └── DeviceSelector.jsx (Device control)
│   ├── hooks/
│   │   └── useSpotifyPlayer.js (Spotify API calls)
│   └── App.jsx
├── .env                        (SPOTIFY_CLIENT_ID, etc.)
└── package.json
```

---

## 📝 Notes for Future Self

- **Start simple:** Get basic playback working before polishing UI
- **Test with Premium:** Free Spotify API is limited; Premium unlocks more
- **Rate limiting:** Spotify has rate limits; cache data where possible
- **Device latency:** Device switching may have 1-2 second delay (expected)
- **Mobile:** Web app works on mobile but Spotify Web Playback SDK has mobile limitations
- **Desktop:** Electron wrapper makes it feel like native app (better experience)

---

## 🎬 Next Steps (When Starting This Project)

1. Read Spotify Web API documentation
2. Create Spotify Developer app
3. Implement OAuth login flow
4. Build basic player with play/pause/next
5. Add timeline + seek
6. Build UI (focus on artwork)
7. Add device switching
8. Polish & release

---

**This idea is ready to build whenever you want!**

For MVP Playlist app: **Focus on Phase 5 (music player for uploaded songs) first.**  
For this Spotify layer: **Start as separate project later** (would be Phase 7+).

---

**Created by:** You  
**Date:** June 22, 2026  
**Status:** Future idea (greenlit)
