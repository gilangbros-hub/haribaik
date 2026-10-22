-- Let guests read the published "Cerita Kami" photo, same rule as the other images.
drop policy "configured admin reads own and published media" on storage.objects;

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
          or p.content #>> '{storyImage,path}' = name
          or p.content ->> 'musicPath' = name
          or exists (
            select 1 from jsonb_array_elements(coalesce(p.content -> 'gallery', '[]'::jsonb)) image
            where image ->> 'path' = name
          )
        )
    )
  )
);
