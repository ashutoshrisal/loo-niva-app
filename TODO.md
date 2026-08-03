# Loo Niva - Fix Task Checklist

## 1. Public Gallery
- [x] Inspect gallery backend routes, DB schema, and frontend components
- [x] Replace `/gallery` page with a PUBLIC gallery page (read-only, `/api/gallery/public`)
- [x] Keep staff gallery at `/dashboard/gallery`

## 2. Gallery Routing
- [x] Update Sidebar Gallery link from `/gallery` → `/dashboard/gallery`
- [x] Ensure homepage "View Full Gallery" → `/gallery` (public)

## 3. Homepage
- [x] Inspect all homepage sections (hero, nav, about, stats, projects, activities, events, gallery, footer, mobile nav)
- [x] Centralize API URLs using `NEXT_PUBLIC_API_URL`

## 4. Upcoming Events
- [x] Verify `GET /api/public/events`
- [x] Fix `eventController.js` to use correct columns (`event_date`, `start_time`, `end_time`, `location`)

## 5. Public Statistics
- [x] Verify `/api/public/stats` (projects, beneficiaries, activities, districts)

## 6. Authentication
- [x] Inspect login, logout, JWT, refresh, protected routes

## 7. Dashboard Role System
- [x] Verify roles (super_admin, project_manager, field_staff, viewer)

## 8. Dashboard Modules
- [x] Add missing CSS utility classes (`btn-primary`, `input-field`, `badge`) to `globals.css`

## 9. Error Handling
- [x] Inspect backend error handling

## 10. Responsive Design
- [x] Public gallery page has responsive grid + mobile nav

## 11. Images / Media
- [x] Rename `frontend/PUBLIC` → `frontend/public` for production asset serving

## 12. Environment Configuration
- [x] Centralize API base URL in `lib/api.ts` and `app/page.tsx`

## 13. Database
- [x] Verify backend queries match schema (events fixed in step 4)

## 14. Production Readiness
- [x] Run `npm run build` to verify compilation (PASSES - 32 routes, no TS/ESLint errors)

## 15. Vercel / Deployment
- [x] Ensure `public` folder lowercase for Vercel

## 16. Final Test
- [x] Verify all changes compile and work (build passes, public endpoints tested, routes verified)
- [x] Public gallery `/gallery` returns 200
- [x] Dashboard gallery `/dashboard/gallery` returns 200
- [x] Homepage `/` returns 200
- [x] Public events `/api/public/events` works (returns upcoming events only)
- [x] Public stats `/api/public/stats` works
- [x] Public gallery `/api/gallery/public` works
- [x] CORS allows `http://localhost:3000`
- [x] Login endpoint works (rejects invalid credentials)
- [x] Test event added and verified in public events API
