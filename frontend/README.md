# Expense Tracker Frontend (Next.js)

## Features
- Full CRUD UI for Expenses + Categories
- Dashboard charts based on backend reporting
- Third-party API feature: live currency rates displayed in UI (via backend proxy endpoint)

## Local Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` (example: `http://localhost:8000/api`)

## How to Test (UI)
1. Open `http://localhost:3000`
2. Go to **Expenses**
   - Create a Category
   - Create an Expense
   - Edit it
   - Delete it
3. Go to **Dashboard**
   - Verify category breakdown and monthly trend updates
4. Go to **Exchange Rates**
   - Select base currency and see rates fetched live

## Deployment Notes (Vercel)
- Import this folder as a Vercel project
- Set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend API base URL (e.g. `https://<backend>/api`)
