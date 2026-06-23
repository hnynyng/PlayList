# Deployment Guide

## Local Docker Testing

```bash
docker-compose up --build
```

- Backend: http://localhost:5000
- Frontend: http://localhost
- PostgreSQL: localhost:5432

## Deploy to Railway

### Prerequisites
- Railway account (railway.app)
- GitHub connected to Railway

### Steps

1. **Push to GitHub** (already done)

2. **Create Railway project**
   - Go to railway.app
   - New Project → GitHub Repo
   - Select PlayList repo

3. **Add services**
   - PostgreSQL (Railway will auto-create)
   - Backend (from Dockerfile)
   - Frontend (from Dockerfile)

4. **Configure environment variables**

   **Backend:**
   - `DATABASE_URL`: Railway PostgreSQL connection string
   - `JWT_SECRET`: Generate random secret
   - `NODE_ENV`: production
   - `PORT`: 5000

   **Frontend:**
   - `VITE_API_URL`: Your backend Railway URL

5. **Deploy**
   - Railway auto-deploys on git push
   - Check deployment logs

## Deploy to AWS EC2 (Later)

Will add EC2 deployment steps in Phase 7.

## Monitoring

- Check logs: Railway dashboard
- Monitor database: Railway PostgreSQL panel
- Check uptime: ping /health endpoint

## Rollback

- Railway keeps previous deployments
- Click "Redeploy" on previous version

---

**Current Status:** Ready for Railway deployment
