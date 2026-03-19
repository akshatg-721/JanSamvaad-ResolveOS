# Deployment Guide

This project has multiple runtimes. Use these defaults:

- Backend API: `http://localhost:3000`
- Dashboard (Next.js): `http://localhost:3001`
- Frontend (Vite, optional): `http://localhost:5173`

## 1) Environment

Create `.env` in project root (or update it) with real production values:

- `DATABASE_URL`
- `JWT_SECRET`
- `OPERATOR_USERNAME`
- `OPERATOR_PASSWORD`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`)
- `ALLOWED_ORIGIN` (comma-separated, include dashboard host)

Example:

```env
ALLOWED_ORIGIN=https://dashboard.example.com,https://ops.example.com
```

## 2) Backend startup

```bash
npm run dev
```

or production:

```bash
npm start
```

On startup, backend now runs schema compatibility checks automatically.

Manual migration is also available:

```bash
npm run migrate
```

## 3) Dashboard startup

```bash
npm --prefix ./dashboard run dev -- --port 3001
```

or production:

```bash
npm --prefix ./dashboard run build
npm --prefix ./dashboard start -- --port 3001
```

## 4) Health checks

- Backend: `GET /health`
- Login API: `POST /api/auth/login`
- Tickets API: `GET /api/tickets` (with bearer token)

## 5) Common mistakes

- Do not run dashboard on port `3000` (reserved for backend API).
- If dashboard shows HTML errors for API calls, verify backend is running on `3000`.
- If Next dev fails with `.next` lock errors, delete `dashboard/.next` and restart.
