# HariBahagia

See [the release and recovery runbook](docs/operations/release-readiness.md) for environment isolation, deployment, backup/restore, and the manual pre-release checklist.

## Admin authentication setup

Create the single admin account in the Supabase Auth dashboard; the app has no sign-up route. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and that account's UUID as `ADMIN_USER_ID` in the server environment for each Vercel environment. The service-role key is used only by the server to finalize uploads; never expose it to browser code. Astro reads these values when building, so set them before deploying. Copy `.env.example` for local setup and keep real credentials out of Git.

The admin uses Supabase email/password Auth. `/admin` and `/api/admin/*` require a verified session whose user ID matches `ADMIN_USER_ID`. If the Auth service is unavailable, protected requests fail closed.

## Wedding content setup

Apply `supabase/migrations/202610220001_wedding_content.sql` after creating the single Auth admin. Then, in the Supabase SQL editor, authorize that same user ID:

```sql
insert into public.wedding_admin (user_id) values ('<ADMIN_USER_ID>');
```

Set `ADMIN_USER_ID` to the same UUID in the server environment. Draft content is private to that configured account. Public clients can read only `wedding_publications`; the Publish RPC copies the exact server-validated draft into that table atomically. No publication row exists until the first successful Publish.

The database migration and RLS policies are committed, but they have not been applied or integration-tested because this project does not yet have a provisioned Supabase project.

Apply `supabase/migrations/202610220005_wedding_media.sql` after the wedding content migration. It creates a private Storage bucket and policies for admin uploads and published media reads. Photos are limited to 10 MB and re-encoded as metadata-free WebP; MP3 files are limited to 20 MB. These application limits fit the bucket's 20 MB ceiling, but the project's real Storage quota and upload policies still need checking before release.
