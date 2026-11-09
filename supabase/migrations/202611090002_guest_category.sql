alter table public.guests add column category text check (category is null or category in ('dhanar', 'sheilly', 'ortu', 'keluarga'));

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
    from jsonb_to_recordset(p_rows) as x(name text, slug text, category text)
    where name is null or length(btrim(name)) not between 1 and 200
      or slug is null or length(slug) not between 1 and 64
      or slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      or (category is not null and category not in ('', 'dhanar', 'sheilly', 'ortu', 'keluarga'))
  ) or (select count(*) <> count(distinct x.slug) from jsonb_to_recordset(p_rows) as x(name text, slug text, category text)) then
    raise exception 'Data tamu tidak valid atau memiliki slug duplikat.' using errcode = '22023';
  end if;

  update public.guests set active = false, updated_at = now()
  where active and slug not in (select x.slug from jsonb_to_recordset(p_rows) as x(name text, slug text, category text));

  insert into public.guests (name, slug, category, active, updated_at)
  select btrim(x.name), x.slug, nullif(x.category, ''), true, now()
  from jsonb_to_recordset(p_rows) as x(name text, slug text, category text)
  on conflict (slug) do update
    set name = excluded.name, category = case when (select x.category from jsonb_to_recordset(p_rows) as x(slug text, category text) where x.slug = excluded.slug) is null then guests.category else excluded.category end, active = true, updated_at = now();
end;
$$;

revoke all on function public.replace_active_guests(jsonb) from public, anon, authenticated;
grant execute on function public.replace_active_guests(jsonb) to service_role;
