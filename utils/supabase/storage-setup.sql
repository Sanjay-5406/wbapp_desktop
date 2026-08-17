-- 1. Create a private storage bucket
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do nothing;

-- 2. RLS for storage.objects
-- Files live at {user_id}/{uuid}-{filename}, so we check the first path segment
create policy "Users can upload to own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'user-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view own files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'user-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'user-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. RLS for the files metadata table
alter table files enable row level security;

create policy "Users can view own file records"
on files for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own file records"
on files for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete own file records"
on files for delete
to authenticated
using (auth.uid() = user_id);