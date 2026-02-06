# Full-Stack Assignment: Expense Tracker (CRUD + Dashboard + Third‑Party API)

This repository contains a **complete, working** full-stack web app that matches the assignment requirements:

✅ **Full CRUD from UI + REST APIs**  
✅ **Dashboard / reporting with data visualization**  
✅ **Third‑party API integration (exchange rates)**  
✅ **PostgreSQL/Supabase compatible**  
✅ **Django (backend) + Next.js (frontend)**

---

## Repos structure (recommended as 2 repos)
- `backend/` → Django + DRF REST API
- `frontend/` → Next.js UI

You can split this into 2 public GitHub repos:
- `expense-tracker-backend`
- `expense-tracker-frontend`

---

## Features
### Entities
- **Category**
- **Expense** (belongs to Category)

### CRUD (UI + REST)
- Create / View list / Update / Delete expenses in the UI (`/expenses`)
- Same CRUD is exposed via REST:
  - `POST/GET /api/expenses/`
  - `PATCH/DELETE /api/expenses/:id/`
  - Same for categories: `/api/categories/`

### Dashboard / Reporting
- `GET /api/reports/summary/` aggregates:
  - Total count, total amount
  - Category breakdown
  - Monthly trend
- UI page: `/dashboard` with charts (Recharts)

### Third‑Party Integration
- Backend endpoint: `GET /api/integrations/exchange/latest/?base=USD`
- Calls external API: `exchangerate.host`
- UI page: `/exchange`

---

## Local Setup

### 1) Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000/api/health/`

---

## Environment Variables
### Backend (`backend/.env`)
- `DATABASE_URL` (Supabase/Postgres)
- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS` (include your frontend URL)

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_BASE_URL` (backend API base url, e.g. `https://<backend>/api`)

---

## Database + Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

---

## How to Test (step-by-step)
### CRUD UI flow (must show in screen recording)
1. Open frontend `/expenses`
2. Add a **Category**
3. Create an **Expense**
4. Edit the expense (PATCH)
5. Delete the expense (DELETE)

### Report / Visualization path
- Open `/dashboard`
- Click **Refresh** to re-fetch data after CRUD changes

### Third‑party API feature path
- Open `/exchange`
- Change base currency, click **Fetch latest**

---

## Deployment Notes (example: Render + Vercel)
### Backend (Render)
1. Create Supabase project → copy Postgres connection string to `DATABASE_URL`
2. Create Render web service from `backend/`
3. Add env vars: `DATABASE_URL`, `SECRET_KEY`, `DEBUG=false`, `ALLOWED_HOSTS=<render-host>`, `CORS_ALLOWED_ORIGINS=<vercel-url>`
4. Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start: `gunicorn config.wsgi:application`

### Frontend (Vercel)
1. Import `frontend/` as a Vercel project
2. Add env var: `NEXT_PUBLIC_API_BASE_URL=https://<your-backend>/api`
3. Deploy

---

## AWS extra points (quick path)
- Backend:
  - Use **Elastic Beanstalk** (Docker or Python platform) + **RDS Postgres** OR Supabase Postgres
  - Run migrations during deploy (EB hooks) or manually with `eb ssh` and `python manage.py migrate`
- Frontend:
  - Use **AWS Amplify** to deploy the Next.js frontend
  - Set `NEXT_PUBLIC_API_BASE_URL` in Amplify environment variables
