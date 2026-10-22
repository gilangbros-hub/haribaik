create or replace function public.save_guest_rsvp(p_slug text, p_status text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_id uuid;
begin
  if p_status not in ('attending', 'declined') then
    raise exception 'Jawaban RSVP tidak valid.' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('hari-bahagia-guest-import', 0));

  select id into target_id
  from public.guests
  where slug = p_slug and active;

  if target_id is null then
    return false;
  end if;

  insert into public.guest_rsvps (guest_id, status, answered_at)
  values (target_id, p_status, now())
  on conflict (guest_id) do update
    set status = excluded.status, answered_at = excluded.answered_at;

  return true;
end;
$$;

revoke all on function public.save_guest_rsvp(text, text) from public, anon, authenticated;
grant execute on function public.save_guest_rsvp(text, text) to service_role;
