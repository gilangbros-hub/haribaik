# Release and recovery runbook

This is an operations checklist, not evidence that a production environment is ready. The GitHub repository, Supabase projects, Vercel project, domain, final content, and authorized photos/music still need the owner's provisioning and review.

## Environments and secrets

Keep all three environments isolated:

| Environment | Supabase | Vercel | Data |
| --- | --- | --- | --- |
| Development | Local Supabase CLI stack (`supabase start`, Docker required) | Local Astro development | Synthetic fixtures only |
| Preview | Its own remote Supabase project | Vercel Preview variables | Synthetic fixtures only; never production credentials/data |
| Production | Its own remote Supabase project | Vercel Production variables | Real guest responses and approved media |

Supabase Free currently permits two active remote projects per organization. Local Development avoids a third hosted project; hosting a separate remote Development project would require capacity beyond that free allowance. Supabase Free projects can pause after a week of low database activity, so it does not promise uninterrupted availability for an event.

Set these variables separately for local Development, Vercel Preview, and Vercel Production. Use `.env.example` for names only; values belong in the local ignored `.env.local` file or the matching Vercel environment:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `ADMIN_USER_ID`
- `PUBLIC_SITE_URL` (canonical origin for that environment)

Create the one admin account separately in each Supabase Auth project and set its UUID and `wedding_admin` row only in that environment. Never copy Production secrets/data into Preview, commit credentials or guest exports, print credentials to logs, or expose the service-role key to browser code. Apply variable changes with a new deployment; existing Vercel deployments do not receive updated values.

## Provision and deploy

1. The owner creates the private personal GitHub repository and connects it to a Vercel Hobby project. Hobby does not support Git repositories owned by GitHub organizations.
2. Create the local Supabase CLI stack and separate remote Preview and Production projects. Add each project's environment-specific values to local/Vercel settings.
3. Create the admin account for the target project, then apply committed migrations in filename order, reviewing each before running it:

   ```sh
   supabase link --project-ref <preview-project-ref>
   supabase migration list
   supabase db push --dry-run
   supabase db push
   ```

   Repeat the same controlled process with the Production project only at release. The repository's migration order is `202610220001_wedding_content.sql`, `202610220004_guests_and_rsvp.sql`, `202610220005_wedding_media.sql`, then `202610220007_atomic_guest_rsvp.sql`. Do not run `db reset` against a remote project, add production guest seed data, or apply migrations automatically during Vercel preview/builds.
4. Add the already-owned canonical domain under the Vercel project's Settings → Domains, configure the exact DNS records Vercel reports, and choose one canonical host (apex or `www`) with the other redirected. Wait for domain verification and automatic SSL issuance before sharing. Set Production `PUBLIC_SITE_URL` to that exact `https://` origin, then redeploy. Confirm copied guest URLs use it, not a preview URL or request Host header.
5. Promote only after the manual smoke checklist below passes against the intended environment.

Vercel Firewall rate limiting is currently available on Hobby: one rule per project, fixed-window only, IP or JA4 keys, and 1 million allowed requests/month included; additional allowed requests are currently priced at $0.50 per million, region dependent. Configure and inspect the rule in the dashboard before relying on it. This platform control does not replace server-side validation or a tested application-level limit. Vercel Hobby runtime logs are retained for one hour, so inspect errors promptly and do not log guest names, RSVP values, or secrets.

## Backup and restore

Supabase Free does not provide the daily downloadable backups documented for paid plans. Schedule regular off-site logical database exports and separate Storage-object copies. Database dumps do not contain object bytes; they contain only Storage metadata. Keep the dump, object files, and an object-path manifest together, encrypted and access-restricted, outside this repository.

For a backup, link to the Production project, then run the Supabase CLI commands from a secured operator machine. The resulting SQL/object files contain private wedding data and must never be committed:

```sh
supabase link --project-ref <production-project-ref>
supabase db dump --linked --data-only --schema public --use-copy -f <secure-backup-dir>/public-data.sql
supabase storage ls --linked -r wedding-media
```

Download the private bucket separately with the Supabase Storage S3-compatible endpoint and a restricted access key, or the project's Storage dashboard. Keep the `wedding-media` prefix and object paths intact. Record and compare the object count and paths from `storage ls` with the copied files. Include the database schema/migrations and required project configuration in the recovery notes; do not treat the data-only dump as a complete schema backup. Store a timestamp and checksum alongside each backup set.

Before the event, rehearse restoring a complete backup set into a disposable Supabase project, never over Production. Apply the exact committed migrations first; create a fresh test admin in Auth and map the old admin UUID to the new one in `wedding_admin` and `wedding_drafts`, then restore app data with Supabase's documented CLI/restore procedure. Copy the object tree back to the `wedding-media` bucket at the same paths. Verify the restored bucket is private, compare object paths/counts, confirm every referenced published/draft media path exists, and exercise a signed media read and guest RSVP in the disposable environment. Record the date, operator, duration, and any corrections here. Do not claim recovery readiness until this rehearsal succeeds.

## Manual release smoke checklist

Run on the final canonical HTTPS domain after Production is provisioned. Check mobile at 320 px and desktop. Use a small, synthetic guest set until the owner supplies approved real data/assets.

- [ ] Login succeeds for the one admin; logout closes protected pages and API access.
- [ ] Edit a draft, preview it, publish it, and confirm guests continue seeing the old snapshot until Publish.
- [ ] Import a valid CSV; verify the preview counts, apply it, export it, and import the export again without changing RSVP state.
- [ ] Copy an individual guest URL; confirm it uses `PUBLIC_SITE_URL`, renders only that guest, and updates that guest's RSVP.
- [ ] Confirm inactive/unknown slugs reveal no guest data; Preview cannot read or mutate Production.
- [ ] Upload and publish cover, couple portraits, gallery photos, and MP3; verify image layout, audio start after opening, play/pause, and missing/bad media errors.
- [ ] Open the map link and download the calendar file; verify event date/time and time zone.
- [ ] Check keyboard navigation, visible focus, reduced motion, long names, audio failure, failed database requests, failed/oversized upload, and quota/error states. No action should report success when persistence failed or discard the user's input.
- [ ] Confirm canonical and alternate host redirect behavior, valid HTTPS certificate, `PUBLIC_SITE_URL`, Vercel runtime errors, Supabase database/Storage usage, and current service status.
- [ ] Complete the backup restore rehearsal above and record its outcome before invitations are shared.

## Rollback and event operations

- For an application-only regression, promote/redeploy the last known-good Vercel deployment and run the smoke checks again. A code rollback does not roll back migrations, database writes, or Storage objects.
- For a migration or data problem, stop admin edits/imports first and pause RSVP writes if necessary. Prefer a reviewed forward migration. Restore an earlier database backup only after deciding the accepted RSVP/data loss window; restore the matching Storage files and paths as a pair. Supabase restore may make the project inaccessible during recovery. Never run `db reset` on Production.
- Check Vercel deployment/runtime logs and Supabase service status, database size, egress, Storage size, and upload limits during release and before the event. Hobby runtime history is short; capture the error timestamp/request identifier without personal guest data.
- If a Free Supabase project has paused, resume it in Supabase Studio, then verify auth, database, Storage reads/writes, and the full smoke path before sharing links.

## Still required from the owner

- [ ] GitHub personal private repository URL and Vercel project connection.
- [ ] Supabase project provisioning, admin account, environment secrets, migration application, quota check, and restore rehearsal.
- [ ] Final domain name/host choice, DNS change, HTTPS check, and production canonical URL.
- [ ] Final wedding details, guest CSV, and confirmation that each photo/music asset may be published.
- [ ] Production browser smoke test and mobile/accessibility review.

## Official guidance checked 22 October 2026

- [Supabase Free plan billing and quotas](https://supabase.com/docs/guides/platform/billing-on-supabase) and [Free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)
- [Supabase database backups](https://supabase.com/docs/guides/platform/backups), [CLI backup/restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore), and [Storage object downloads](https://supabase.com/docs/guides/storage/management/download-objects)
- [Vercel environments](https://vercel.com/docs/deployments/environments), [environment variables](https://vercel.com/docs/environment-variables), [Hobby limits and rate limits](https://vercel.com/docs/limits), and [WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)
- [Vercel custom domains](https://vercel.com/docs/domains/set-up-custom-domain) and [SSL certificates](https://vercel.com/docs/domains/working-with-ssl)
