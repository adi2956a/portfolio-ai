# Portfolio AI

Monorepo scaffold for a full-stack portfolio app.

## Structure

- `frontend`: React + Vite client
- `backend`: Node.js + Express API
- `docs`: API and setup notes

## Quick Start

1. Copy env examples:
   - `frontend/.env.example` -> `frontend/.env`
   - `backend/.env.example` -> `backend/.env`
2. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
3. Seed DB and run backend:
   - `cd ../backend`
   - `npm run seed`
   - `npm run dev`
4. Run frontend:
   - `cd ../frontend`
   - `npm run dev`

Default admin from seed: `admin@example.com` / `admin123`
