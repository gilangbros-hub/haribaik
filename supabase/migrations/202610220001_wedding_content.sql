create table public.wedding_admin (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users(id) on delete restrict
);
alter table public.wedding_admin enable row level security;
revoke all on public.wedding_admin from anon, authenticated;

create function public.is_wedding_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (select 1 from public.wedding_admin where user_id = auth.uid())
$$;
revoke all on function public.is_wedding_admin() from public, anon;
grant execute on function public.is_wedding_admin() to authenticated;

create table public.wedding_drafts (
  id text primary key default 'main' check (id = 'main'),
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.wedding_drafts enable row level security;
revoke all on public.wedding_drafts from anon, authenticated;
grant select, insert, update on public.wedding_drafts to authenticated;
create policy "the configured admin manages the draft"
  on public.wedding_drafts for all to authenticated
  using (admin_user_id = (select auth.uid()) and (select public.is_wedding_admin()))
  with check (admin_user_id = (select auth.uid()) and (select public.is_wedding_admin()));

create table public.wedding_publications (
  id text primary key default 'main' check (id = 'main'),
  content jsonb not null,
  published_at timestamptz not null default now()
);

alter table public.wedding_publications enable row level security;
revoke all on public.wedding_publications from anon, authenticated;
grant select on public.wedding_publications to anon, authenticated;
create policy "published invitation is public"
  on public.wedding_publications for select to anon, authenticated
  using (true);

create function public.publish_wedding_draft(p_expected_content jsonb)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  affected integer;
begin
  if auth.uid() is null or not public.is_wedding_admin() then
    return false;
  end if;

  insert into public.wedding_publications (id, content, published_at)
  select id, content, now()
  from public.wedding_drafts
  where id = 'main'
    and admin_user_id = auth.uid()
    and content = p_expected_content
  on conflict (id) do update
    set content = excluded.content,
        published_at = excluded.published_at;

  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;

revoke all on function public.publish_wedding_draft(jsonb) from public, anon;
grant execute on function public.publish_wedding_draft(jsonb) to authenticated;
