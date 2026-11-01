-- Admin accounts and sessions owned by the app (replaces Supabase Auth login).
-- Only the server's service-role key can touch them; passwords are bcrypt hashes made by pgcrypto.
create extension if not exists pgcrypto with schema extensions;

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and length(email) between 3 and 254),
  password_hash text not null,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create table public.admin_sessions (
  token_hash text primary key,
  user_id uuid not null references public.admin_users(id) on delete cascade,
  expires_at timestamptz not null
);
alter table public.admin_sessions enable row level security;
revoke all on public.admin_sessions from anon, authenticated;

create function public.verify_admin_login(p_email text, p_password text)
returns uuid
language sql
stable
security definer
set search_path = pg_catalog, public, extensions
as $$
  select id from public.admin_users
  where email = lower(trim(p_email)) and password_hash = extensions.crypt(p_password, password_hash)
$$;
revoke all on function public.verify_admin_login(text, text) from public, anon, authenticated;
grant execute on function public.verify_admin_login(text, text) to service_role;

create function public.create_admin_user(p_email text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  new_id uuid;
begin
  -- bcrypt ignores bytes after 72, so longer passwords are refused instead of silently cut.
  if octet_length(p_password) < 10 or octet_length(p_password) > 72 then
    raise exception 'password must be 10-72 bytes';
  end if;
  insert into public.admin_users (email, password_hash)
  values (lower(trim(p_email)), extensions.crypt(p_password, extensions.gen_salt('bf', 12)))
  returning id into new_id;
  return new_id;
end;
$$;
revoke all on function public.create_admin_user(text, text) from public, anon, authenticated;
grant execute on function public.create_admin_user(text, text) to service_role;
