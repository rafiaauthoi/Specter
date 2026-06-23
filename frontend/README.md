# Clearprint

Clearprint is a digital footprint cleanup tool that helps you scan, identify, and remove your personal data from the internet. Connect your accounts, scan for exposure, and delete what you don't want out there.

**Live demo:** https://clear-print.vercel.app

---

## What it does

- Scans your Gmail inbox for newsletter subscriptions and bulk senders
- Lets you delete all emails from a sender in one click
- Guides you through removing yourself from 20 data broker websites
- Generates ready-to-send opt-out emails for brokers that require manual requests
- Tracks your exposure score and shows your cleanup progress

---

## Tech stack

**Frontend**
- React 18 with Vite
- React Router for client-side navigation
- Deployed on Vercel

**Backend**
- Python 3.12 with FastAPI
- SQLAlchemy with PostgreSQL (Supabase)
- Deployed on Render

**Auth and data**
- Supabase Auth (email/password with confirmation)
- Supabase Postgres for scan results and connected accounts
- Resend for transactional email delivery

**Integrations**
- Google OAuth 2.0 for Gmail access
- Gmail API for inbox scanning and batch deletion

---

## Security practices

- OAuth tokens encrypted at rest using AES-256 (Fernet) before database storage
- Minimum OAuth scopes requested (gmail.modify and userinfo.email only)
- Tokens never logged or exposed in API responses
- All secrets managed via environment variables, never committed to version control
- CORS restricted to registered frontend origin
- Email confirmation required for all new accounts
- Session tokens are short-lived JWTs issued by Supabase Auth

See the [Security page](https://clear-print.vercel.app/security) for full details.

---

## Running locally

**Prerequisites:** Node.js 20+, Python 3.11+

**Clone the repo**
```bash
git clone https://github.com/rafiaauthoi/ClearPrint.git
cd ClearPrint
```

**Backend setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create a `backend/.env` file with these variables:

DATABASE_URL=your_supabase_postgres_connection_string

SECRET_KEY=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

SUPABASE_URL=your_supabase_project_url

SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_KEY=your_supabase_service_key

FRONTEND_URL=http://localhost:5173

Then run:
```bash
python setup_db.py
python -m uvicorn main:app --reload
```

**Frontend setup**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Project structure

clearprint/

├── backend/

│   ├── core/          # Config, database, encryption

│   ├── routers/       # Auth and Google API routes

│   ├── services/      # Gmail scan and delete logic

│   ├── main.py

│   └── setup_db.py

└── frontend/

└── src/

├── components/  # Footer, CookieBanner

└── pages/       # Dashboard, Login, ConnectAccounts,

# GuidedRemoval, policy pages

---

## Legal

This project includes a Privacy Policy, Terms of Service, Cookie Policy, and Security disclosure page, all accessible from the app footer.

---

## Author

Rafia Authoi — Computer Information Systems, Western Michigan University  
Minors: Cybersecurity, UX/UI, General Business