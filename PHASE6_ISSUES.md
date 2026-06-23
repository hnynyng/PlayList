# Phase 6 Testing Issues & Bugs

**Date:** June 23, 2026  
**Status:** Docker working, multiple bugs found during testing  
**Context:** User testing Docker deployment locally, found rate limiting issues + missing features

---

## 🎯 Project Overview

Full-stack music streaming app (Playlist). Phases 1-5 complete (auth, upload, playlists, frontend UI, music player). Phase 6 (Docker/deployment) partially done. All bugs found during Docker testing.

---

## 🐛 Critical Bugs to Fix (HIGH PRIORITY)

### BUG #1: Rate Limiting Blocking Valid Operations (429 errors)
**Severity:** CRITICAL - breaks app functionality  
**When it happens:**
- Clicking different playlists shows 429
- Adding song to playlist shows 429
- Clicking next/previous song shows 429

**Root cause:** Rate limiter is TOO AGGRESSIVE. Likely:
- General API limiter (100 req/15min) is being hit
- Or login rate limiter is interfering with other endpoints
- Or upload limiter is affecting other operations

**What to check:**
- Review all rate limiters in `backend/src/middleware/rateLimiter.js`
- Check which endpoints have rate limiting applied
- Reduce limits or make them per-user instead of global
- Verify apiLimiter isn't blocking /playlists, /songs/id, etc.

**Impact:** User can't use the app after a few actions

---

### BUG #2: Music Player Only Plays from "All Songs", Not from Playlists
**Severity:** HIGH - defeats playlist feature  
**What happens:**
- Create playlist, add songs
- Click on playlist to view it
- Songs show in playlist, but clicking next/previous plays from global song list instead
- Player doesn't respect playlist context

**Root cause:** MusicPlayer component gets `songs` prop from Dashboard, which is global all songs list. When viewing a playlist, the player should receive only playlist songs, not all songs.

**What to fix:**
- Pass playlist songs to MusicPlayer when viewing a playlist
- Update MusicPlayer to handle playlist vs. global song list
- Preserve current song index when switching between views
- File: `frontend/src/pages/Dashboard.jsx` + `frontend/src/components/MusicPlayer.jsx`

**Impact:** Playlists are broken

---

### BUG #3: Playlist View - Can't Remove Songs (Button Not Working)
**Severity:** MEDIUM  
**What happens:**
- Click on playlist to view songs
- "Remove" button exists but doesn't work
- No error message shown

**Root cause:** Likely the remove function isn't wired up in the modal or the API call fails silently (maybe 429 error)

**Files to check:**
- `frontend/src/pages/Dashboard.jsx` - playlistDetail modal remove button
- Check if `handleRemoveSongFromPlaylist` function exists and is properly wired
- Check if API endpoint `/playlists/:id/songs/:song_id` DELETE is working

**Impact:** Can't manage playlist songs

---

## 🔧 Features Not Working / Missing

### MISSING: Search Bar
**Issue:** Search functionality doesn't exist on dashboard  
**Impact:** Can't search songs by title/artist  
**Fix:** Add search input to Dashboard, call `/songs/search?q=` endpoint

---

### MISSING: Stream Audio Test
**Issue:** Don't know how to test if `/songs/:id/stream` endpoint works  
**How to test:** 
- Open browser DevTools → Network tab
- Play a song
- Look for request to `/songs/[songid]/stream`
- Should return audio/mpeg content type
- If it's 429, it's the rate limiter blocking it

---

### MISSING: Error Handling Tests
**Issue:** Not sure how to test error handling  
**How to test:**
- Try upload with empty title → should show error
- Try upload with negative duration → should show error
- Try upload with non-MP3 file → should show "File unable to upload" message (CURRENTLY NOT SHOWING ON FRONTEND)

---

### NOT TESTED: File Size Limits
**Issue:** "too low" - need to test uploading file >50MB  
**Current limit:** 50MB in multer config  
**How to test:** Create/find large MP3 file, try uploading

---

## 📋 Bugs Found But Not Critical

### UI: File Upload Error Not Showing on Frontend
**What happens:**
- Upload fake MP3 (text file renamed)
- Backend correctly rejects it: "File unable to upload"
- Frontend shows generic alert instead of actual error
- User doesn't know what went wrong

**Fix:** Update `frontend/src/pages/Dashboard.jsx` upload error handling to show actual error message from API

---

## 🔍 Tests That PASSED

✅ Authentication (signup, login, password strength, rate limiting on login)  
✅ File upload (valid MP3)  
✅ Duplicate song detection (same song can't be added twice to same playlist)  
✅ Playlist creation (multiple playlists work)  
✅ Player controls (play/pause/skip/volume/timeline all work)  
✅ User persistence (logout → login → data still there)  
✅ Docker setup (docker-compose up works, all 5 containers start)

---

## 📊 Rate Limiting Issue Details

**What was added in security phase:**
- General API limiter: 100 requests/15 min (applies to ALL routes)
- Auth limiter: 5 failed logins/15 min
- Upload limiter: 10 uploads/hour per user

**Problem:** General API limiter (100 req/15 min) is likely being hit because:
- Every playlist view = request to `/playlists/:id`
- Every next/previous = request to `/songs/:id/stream`
- Multiple rapid clicks = 100 req limit hit fast

**Solution options:**
1. Increase limit (200 req/15 min)
2. Remove general limiter, only keep auth + upload limiters
3. Make per-user instead of global
4. Increase window (from 15 min to 1 hour)

**Recommended:** Option 2 - remove general API limiter, keep auth + upload only

---

## 🚀 Next Steps

1. **Fix rate limiting** - remove/increase general API limiter
2. **Fix playlist music player** - pass playlist songs to player, not global songs
3. **Fix remove song button** - ensure API call works
4. **Add search bar** - wire up search endpoint
5. **Show upload errors on frontend** - display actual error messages
6. **Test stream audio** - verify `/songs/:id/stream` endpoint
7. **Test file size limits** - upload >50MB file
8. **Deploy to Railway** - once all bugs fixed

---

## 📁 Key Files to Investigate

- `backend/src/middleware/rateLimiter.js` - rate limiting config
- `frontend/src/pages/Dashboard.jsx` - UI, player integration, error handling
- `frontend/src/components/MusicPlayer.jsx` - music player logic
- `backend/src/routes/playlists.js` - playlist endpoints
- `backend/src/controllers/playlistController.js` - remove song logic

---

**Ready for new session!** Start with rate limiting fix, then playlist player fix.
