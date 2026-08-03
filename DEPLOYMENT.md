# Deployment Guide — Loo Niva NGO Management System

This guide covers a straightforward production deployment using free-to-low-cost
services suitable for an NGO's budget.

## Recommended Stack

| Component | Suggested Provider |
|---|---|
| Frontend (Next.js) | Vercel |
| Backend (Express API) | Render / Railway / Fly.io |
| Database | Supabase (managed PostgreSQL) |
| File Storage | Cloudinary (free tier is generous for NGO media use) |

---

## 1. Database (Supabase)

1. Create a project at supabase.com.
2. In the SQL Editor, run `database/schema.sql`, then `database/seed.sql` if you want demo data.
3. Copy the **connection string** (Project Settings → Database) into `DATABASE_URL`.
4. Supabase requires SSL — the backend's `db.js` already sets
   `ssl: { rejectUnauthorized: false }` when `NODE_ENV=production`.

## 2. Backend (Render example)

1. Push the `backend/` folder to a Git repository.
2. On Render: New → Web Service → connect the repo, root directory `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env.example` (never commit `.env` itself).
6. Set `CLIENT_URL` to your deployed frontend URL so CORS allows it.

## 3. File Storage (Cloudinary)

1. Create a free Cloudinary account.
2. Copy Cloud Name, API Key, API Secret into the backend's environment variables.
3. No further setup needed — `multer-storage-cloudinary` handles uploads directly
   from the `/api/upload` endpoint.

## 4. Frontend (Vercel)

1. Push the `frontend/` folder to a Git repository (or same monorepo, root directory `frontend`).
2. On Vercel: New Project → select repo → root directory `frontend`.
3. Add environment variable `NEXT_PUBLIC_API_URL` pointing to your deployed backend, e.g.
   `https://loo-niva-api.onrender.com/api`.
4. Deploy. Vercel auto-builds on every push to `main`.

## 5. Post-Deployment Checklist

- [ ] Change all seed-user passwords (or delete seed users and create real accounts via `/api/auth/register` as Super Admin).
- [ ] Rotate `JWT_SECRET` and `JWT_REFRESH_SECRET` to long, random production values.
- [ ] Confirm `NODE_ENV=production` is set on the backend (enables SSL DB connection and hides stack traces from error responses).
- [ ] Set up automated PostgreSQL backups (Supabase: Database → Backups) to satisfy the "Backup System" requirement.
- [ ] Point the organization's real logo/branding into `organization_settings` via the Settings module.
- [ ] Test each role (Super Admin, Project Manager, Field Staff, Viewer) end-to-end before rollout.
- [ ] Set up a custom domain (e.g. `manage.loonivachild.org.np`) on both Vercel and the backend host.

## Scaling Notes

- The `pg` connection pool (`max: 20`) is tuned for small-to-medium NGO traffic;
  increase if you add more concurrent field staff.
- Cloudinary's free tier covers ~25GB storage/bandwidth — monitor usage as the
  Gallery and Documents modules grow, and upgrade if the org publishes a lot of video.
- For audit/compliance needs, wire up writes to the `audit_logs` table on every
  create/update/delete/approve action in the controllers.
