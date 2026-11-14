-- Greatest Moments Events: Cloudinary migration support
-- Run once in Supabase Dashboard > SQL Editor before enabling Cloudinary uploads.
-- Existing Supabase Storage paths are preserved so original files can be removed
-- only after the Cloudinary migration has been verified.

alter table public.event_photos
  add column if not exists cloudinary_public_id text unique;

comment on column public.event_photos.cloudinary_public_id is
  'Cloudinary public_id for the photo; null means the photo is still stored only in Supabase Storage.';
