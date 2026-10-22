insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wedding-media', 'wedding-media', false, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

grant select, insert on storage.objects to authenticated;
grant select on storage.objects to anon;
grant execute on function public.is_wedding_admin() to anon;

create policy "configured admin reads own and published media"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'wedding-media'
  and (
    (auth.uid() is not null and public.is_wedding_admin() and (storage.foldername(name))[1] = auth.uid()::text)
    or exists (
      select 1 from public.wedding_publications p
      where p.id = 'main'
        and (
          p.content #>> '{coverImage,path}' = name
          or p.content #>> '{brideImage,path}' = name
          or p.content #>> '{groomImage,path}' = name
          or p.content ->> 'musicPath' = name
          or exists (
            select 1 from jsonb_array_elements(coalesce(p.content -> 'gallery', '[]'::jsonb)) image
            where image ->> 'path' = name
          )
        )
    )
  )
);

create policy "configured admin inserts media in own folder"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'wedding-media'
  and public.is_wedding_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] = 'incoming'
);
