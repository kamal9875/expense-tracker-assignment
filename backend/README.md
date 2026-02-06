# Expense Tracker Backend (Django + DRF + Postgres)

## Features
- Full CRUD REST APIs for:
  - Categories
  - Expenses
- Reporting API:
  - Total count, total amount
  - Category-wise breakdown
  - Monthly trend
- Third-party integration:
  - Currency exchange rates via `exchangerate.host` (no API key)

## Tech
- Django, Django REST Framework
- PostgreSQL / Supabase (recommended)
- Gunicorn + WhiteNoise for production static files

## Local Setup
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### Environment Variables
Create `.env` (see `.env.example`):
- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `DATABASE_URL`
- `CORS_ALLOWED_ORIGINS`
- `EXCHANGE_API_BASE`

## Database + Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## How to Test (APIs)
- Health: `GET /api/health/`
- Categories CRUD: `/api/categories/`
- Expenses CRUD: `/api/expenses/`
- Report: `GET /api/reports/summary/`
- Exchange API: `GET /api/integrations/exchange/latest/?base=USD`

## Deployment Notes (Render example)
- Create a Render Web Service from this folder
- Set env vars: `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
- Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
- Start command: `gunicorn config.wsgi:application`
