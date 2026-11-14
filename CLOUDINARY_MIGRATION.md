# Cloudinary migration setup

Cloudinary stores and delivers event images. Supabase remains responsible for authentication and event/photo records.

## 1. Add the database field

Run `supabase/migrations/202611140001_cloudinary_support.sql` in Supabase SQL Editor.

## 2. Deploy the Edge Function

Deploy `supabase/functions/cloudinary-admin/index.ts` as an Edge Function named `cloudinary-admin`.

## 3. Add Edge Function secrets

In Supabase Dashboard → Edge Functions → Secrets, add:

- `CLOUDINARY_CLOUD_NAME` = `hify8rfj`
- `CLOUDINARY_API_KEY` = your Cloudinary API Key
- `CLOUDINARY_API_SECRET` = your Cloudinary API Secret

Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions automatically. Never add the Cloudinary API Secret to GitHub, Vite environment variables, or browser code.

## Safety

- The function checks the caller's Supabase session and the `admin_users` allow-list.
- Upload signatures are generated server-side.
- The migration keeps original Supabase Storage paths so originals can be retained until verification.
- Do not empty or delete the existing `event-photos` bucket until all photos have been checked.
