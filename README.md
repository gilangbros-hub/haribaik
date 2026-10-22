# HariBahagia

## Admin authentication setup

Create the single admin account in the Supabase Auth dashboard; the app has no sign-up route. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and that account's UUID as `ADMIN_USER_ID` in the server environment for each Vercel environment. Astro reads these values when building, so set them before deploying. Copy `.env.example` for local setup and keep real credentials out of Git.

The admin uses Supabase email/password Auth. `/admin` and `/api/admin/*` require a verified session whose user ID matches `ADMIN_USER_ID`. If the Auth service is unavailable, protected requests fail closed.
