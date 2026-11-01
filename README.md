# HariBahagia

See [the release and recovery runbook](docs/operations/release-readiness.md) for environment isolation, deployment, backup/restore, and the manual pre-release checklist.

## Admin authentication setup

The app has its own admin login; Supabase Auth is not used to sign in. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_USER_ID` in the server environment for each Vercel environment. `ADMIN_USER_ID` must be the UUID of an existing Supabase Auth user: it owns the draft row and the media folder, nobody logs in with it. Astro reads these values when building, so set them before deploying. Copy `.env.example` for local setup and keep real credentials out of Git.

Admin accounts live in `public.admin_users` (bcrypt hashes via pgcrypto) and sessions in `public.admin_sessions` (SHA-256 of a random cookie token, 7 days). Both are reachable only with the server-only service-role key; never expose it to browser code. Run migration `202611010001_own_admin_login.sql`, then create the first account in the SQL Editor:

```sql
select public.create_admin_user('you@example.com', 'a-long-unique-password');
```

After that, logged-in admins add accounts at `/admin/users`.

## Wedding content setup

Apply `supabase/migrations/202610220001_wedding_content.sql` after creating the single Auth admin. Then, in the Supabase SQL editor, authorize that same user ID:

```sql
insert into public.wedding_admin (user_id) values ('<ADMIN_USER_ID>');
```

Set `ADMIN_USER_ID` to the same UUID in the server environment. Draft content is private to that configured account. Public clients can read only `wedding_publications`; the Publish RPC copies the exact server-validated draft into that table atomically. No publication row exists until the first successful Publish.

The database migrations and RLS policies were applied to a local Docker Supabase stack and checked with synthetic admin/guest data. A hosted non-production Supabase project and its environment-specific policies still need verification before release. For local Astro, set `PUBLIC_SITE_URL=http://localhost:4321`; non-local environments must use the canonical HTTPS origin.

Apply `supabase/migrations/202610220005_wedding_media.sql` after the wedding content migration. It creates a private Storage bucket and policies for admin uploads and published media reads. Photos are limited to 10 MB and re-encoded as metadata-free WebP; MP3 files are limited to 20 MB. These application limits fit the bucket's 20 MB ceiling, but the project's real Storage quota and upload policies still need checking before release.
