# Loo Niva NGO Management System

An internal activity, project, and beneficiary management system built for
**Loo Niva Child Concern Group** (Lalitpur, Nepal). It complements the
organization's public website ([loonivachild.org.np](https://loonivachild.org.np))
by giving staff a secure tool to record and manage the day-to-day work behind
the programs the website showcases.

Program areas (used as project categories throughout the app) mirror Loo Niva's
real thematic work: **Education**, **Participation**, **Advocacy**, and **Protection**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS, Recharts, Lucide icons |
| Backend | Node.js, Express |
| Database | PostgreSQL (works with Supabase Postgres) |
| Auth | JWT (access + refresh tokens) with Role-Based Access Control |
| File Storage | Cloudinary |
| Exports | PDFKit (PDF), ExcelJS (Excel) |

---

## Project Structure

```
loo-niva-app/
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/          # DB pool, Cloudinary config
│   │   ├── middleware/      # JWT auth, RBAC, error handling
│   │   ├── controllers/     # Business logic per module
│   │   ├── routes/          # Express routers per module
│   │   ├── utils/           # PDF / Excel generation
│   │   ├── app.js           # Express app assembly
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env.example
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── login/
│   │   ├── (dashboard)/      # Protected route group: dashboard, projects, etc.
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/           # Sidebar, Navbar, StatCard, ProjectCard
│   ├── context/AuthContext.tsx
│   ├── lib/api.ts             # Axios client with token refresh
│   ├── package.json
│   └── .env.local.example
└── database/
    ├── schema.sql             # Full PostgreSQL schema
    └── seed.sql                # Sample data reflecting real Loo Niva programs
```

---

## User Roles & Permissions

| Role | Capabilities |
|---|---|
| **Super Admin** | Manage users, view all projects, analytics dashboard, approve reports, export data |
| **Project Manager** | Create/edit projects, assign staff, upload reports, manage beneficiaries, track progress |
| **Field Staff** | Record field visits, add beneficiaries, upload photos/attendance, submit daily reports |
| **Viewer / Donor** | Read-only access to completed projects and statistics |

RBAC is enforced **server-side** in `backend/src/middleware/auth.js` via the
`authorize(...roles)` middleware on every sensitive route — the frontend only
hides UI it shouldn't show, it never depends on the client to enforce permissions.

---

## Getting Started

### 1. Database

```bash
# Create the database
createdb loo_niva_db

# Apply schema
psql "$DATABASE_URL" -f database/schema.sql

# (Optional) Load sample data reflecting Loo Niva's real programs
psql "$DATABASE_URL" -f database/seed.sql
```

> If using Supabase: create a new project, copy the connection string into
> `DATABASE_URL`, and run the same two SQL files via the Supabase SQL editor
> or `psql`.

### 2. Backend

```bash
cd backend
cp .env.example .env      # fill in DATABASE_URL, JWT secrets, Cloudinary keys
npm install
npm run dev                # nodemon on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev                         # http://localhost:3000
```

### 4. Sample login (after seeding)

All seed users share the password `Password123!` — **change this immediately**
in any real deployment (the seed script is for local/demo use only).

| Email | Role |
|---|---|
| admin@loonivachild.org.np | Super Admin |
| pm.education@loonivachild.org.np | Project Manager |
| field.reap@loonivachild.org.np | Field Staff |
| donor@example.org | Viewer / Donor |

---

## Security Notes

- Passwords are hashed with **bcrypt** (never stored in plain text).
- JWT access tokens are short-lived; refresh tokens rotate on use.
- All list/detail endpoints use **parameterized SQL** — no string-concatenated queries.
- File uploads are restricted by MIME type and size (25MB) via Multer + Cloudinary.
- `helmet` and a global rate limiter are applied to every API route; login has
  a stricter limiter (10 attempts / 15 min) to slow brute-force attempts.
- An `audit_logs` table is included in the schema — wire up logging calls in
  controllers for the actions you want tracked (create/update/delete/approve).

---

## Extending the App

Every module (Gallery, Documents, Events, Users, etc.) follows the same
three-layer pattern: **route → controller → parameterized SQL query**. To add
a new module:

1. Add a table to `database/schema.sql`.
2. Create `controllers/<module>Controller.js` following the existing CRUD pattern.
3. Create `routes/<module>Routes.js`, wrap with `authenticate` + `authorize(...)`.
4. Mount it in `backend/src/app.js`.
5. Add a matching page under `frontend/app/(dashboard)/<module>/page.tsx`.

See `DEPLOYMENT.md` for production deployment guidance.
