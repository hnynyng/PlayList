# 🎵 Playlist - Music Streaming App

A full-stack music streaming and playlist management application.

## 📋 Setup Instructions

### Prerequisites
- Node.js v16+ installed ✅
- Docker installed (for PostgreSQL) ✅
- Git configured ✅

### Step 1: Start PostgreSQL (Docker)

Already done! Container is running.

### Step 2: Create Database Schema

```bash
# Windows PowerShell
cd backend
psql -h localhost -U postgres -d playlist -f ../database/schema.sql
```

Or use DBeaver/pgAdmin to import database/schema.sql.

### Step 3: Install Dependencies

**Backend (PowerShell):**
```powershell
cd backend
npm install
```

**Frontend (PowerShell):**
```powershell
cd frontend
npm install
```

### Step 4: Start the Development Servers

**Backend (Terminal 1):**
```powershell
cd backend
npm run dev
```
Runs on: http://localhost:5000

**Frontend (Terminal 2):**
```powershell
cd frontend
npm run dev
```
Runs on: http://localhost:3000

---

## 🗂️ Project Structure

```
PlayList/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── config/db.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── middleware/
│   ├── uploads/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

---

## 🚀 Next: Install Dependencies

```powershell
cd backend && npm install
cd ../frontend && npm install
```

Then run `npm run dev` in each folder!
