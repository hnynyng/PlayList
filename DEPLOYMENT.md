# Deployment Guide

## Local Docker Testing

```bash
docker-compose up --build
```

- Backend: http://localhost:5000
- Frontend: http://localhost
- PostgreSQL: localhost:5432

---

## Deploy to Railway

### Prerequisites
- Railway account at railway.app
- GitHub repo pushed (already done)

### Step 1: Create Railway project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo** → select `PlayList`

### Step 2: Add PostgreSQL

In your Railway project → **+ New** → **Database** → **Add PostgreSQL**

Railway auto-sets `DATABASE_URL` in the project.

### Step 3: Deploy the Backend

1. In Railway → **+ New** → **GitHub Repo** → select `PlayList`
2. Set **Root Directory** to `/backend`
3. Railway detects the Dockerfile automatically

**Set these environment variables on the backend service:**

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | *(auto-set by Railway PostgreSQL plugin)* |
| `JWT_SECRET` | *(generate a random string, e.g. `openssl rand -hex 32`)* |
| `NODE_ENV` | `production` |

Railway assigns `PORT` automatically — leave it unset.

4. Click **Deploy** and wait for it to go green
5. Copy the backend public URL (e.g. `https://playlist-backend-xyz.up.railway.app`)

> The backend runs migrations automatically on startup — no manual schema import needed.

### Step 4: Deploy the Frontend

1. In Railway → **+ New** → **GitHub Repo** → select `PlayList` again
2. Set **Root Directory** to `/frontend`

**Set these environment variables on the frontend service:**

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your backend URL from Step 3 (e.g. `https://playlist-backend-xyz.up.railway.app`) |

> `VITE_API_URL` is passed as a Docker build arg so Vite embeds it at compile time.

3. Click **Deploy** and wait for it to go green
4. Your app URL is shown in the Railway frontend service dashboard

### Step 5: Done

Open the frontend URL in your browser. The app is live.

---

## Known Limitations (Production)

- **No persistent uploads**: MP3 files stored in the container are wiped on redeploy. For real production, move to S3 (Phase 7).
- **No refresh tokens**: JWT expires after 7 days; users re-login.

---

## Deploy to AWS EC2 (Later)

Will add EC2 + CI/CD steps in Phase 7.

---

## Rollback

Railway keeps previous deployments. Click **Redeploy** on a previous version in the Railway dashboard.
