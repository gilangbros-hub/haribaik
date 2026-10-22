create table public.guest_wishes (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 80),
  message text not null check (length(btrim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index guest_wishes_created_at_idx on public.guest_wishes (created_at desc);

alter table public.guest_wishes enable row level security;
revoke all on public.guest_wishes from anon, authenticated;
grant all on public.guest_wishes to service_role;

-- Only active personal links may post, at most 5 wishes each, to limit spam.
create or replace function public.save_guest_wish(p_slug text, p_name text, p_message text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_id uuid;
begin
  if p_name is null or length(btrim(p_name)) not between 1 and 80
    or p_message is null or length(btrim(p_message)) not between 1 and 500 then
    raise exception 'Ucapan tidak valid.' using errcode = '22023';
  end if;

  select id into target_id from public.guests where slug = p_slug and active;
  if target_id is null then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('hari-bahagia-wish-' || target_id::text, 0));
  if (select count(*) from public.guest_wishes where guest_id = target_id) >= 5 then
    raise exception 'Batas ucapan tercapai.' using errcode = 'P0001', hint = 'wish_limit';
  end if;

  insert into public.guest_wishes (guest_id, name, message) values (target_id, btrim(p_name), btrim(p_message));
  return true;
end;
$$;

revoke all on function public.save_guest_wish(text, text, text) from public, anon, authenticated;
grant execute on function public.save_guest_wish(text, text, text) to service_role;
