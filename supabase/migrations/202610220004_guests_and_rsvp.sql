create table public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 200),
  slug text not null unique check (length(slug) between 1 and 64 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guest_rsvps (
  guest_id uuid primary key references public.guests(id) on delete restrict,
  status text not null check (status in ('attending', 'declined')),
  answered_at timestamptz not null default now()
);

alter table public.guests enable row level security;
alter table public.guest_rsvps enable row level security;
revoke all on public.guests, public.guest_rsvps from anon, authenticated;
grant all on public.guests, public.guest_rsvps to service_role;

create or replace function public.replace_active_guests(p_rows jsonb)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('hari-bahagia-guest-import', 0));

  if jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) < 1 or jsonb_array_length(p_rows) > 1000 then
    raise exception 'CSV tamu harus berisi 1 sampai 1000 baris.' using errcode = '22023';
  end if;
  if exists (
    select 1
    from jsonb_to_recordset(p_rows) as x(name text, slug text)
    where name is null or length(btrim(name)) not between 1 and 200
      or slug is null or length(slug) not between 1 and 64
      or slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ) or (select count(*) <> count(distinct x.slug) from jsonb_to_recordset(p_rows) as x(name text, slug text)) then
    raise exception 'Data tamu tidak valid atau memiliki slug duplikat.' using errcode = '22023';
  end if;

  update public.guests set active = false, updated_at = now()
  where active and slug not in (select x.slug from jsonb_to_recordset(p_rows) as x(name text, slug text));

  insert into public.guests (name, slug, active, updated_at)
  select btrim(x.name), x.slug, true, now()
  from jsonb_to_recordset(p_rows) as x(name text, slug text)
  on conflict (slug) do update
    set name = excluded.name, active = true, updated_at = now();
end;
$$;

revoke all on function public.replace_active_guests(jsonb) from public, anon, authenticated;
grant execute on function public.replace_active_guests(jsonb) to service_role;
