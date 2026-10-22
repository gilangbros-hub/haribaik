-- Open wishes to every visitor, not only personal links. Limits stay only as a size guard.
alter table public.guest_wishes alter column guest_id drop not null;
alter table public.guest_wishes drop constraint guest_wishes_name_check;
alter table public.guest_wishes drop constraint guest_wishes_message_check;
alter table public.guest_wishes add constraint guest_wishes_name_check check (length(name) between 1 and 80);
alter table public.guest_wishes add constraint guest_wishes_message_check check (length(message) between 1 and 2000);

create or replace function public.save_public_wish(p_name text, p_message text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.guest_wishes (name, message) values (p_name, p_message);
end;
$$;

revoke all on function public.save_public_wish(text, text) from public, anon, authenticated;
grant execute on function public.save_public_wish(text, text) to service_role;
