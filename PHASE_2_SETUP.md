# Phase 2 — Admin dashboard and analytics setup

The Phase 2 frontend adds an admin dashboard, visitor-view statistics, quick draft/publish controls, and bulk-upload progress.

## One-time Supabase step

The website code is ready, but the analytics table must be created in the existing Supabase project:

1. Open Supabase Dashboard → SQL Editor.
2. Open the repository file `supabase/migrations/202611140002_gallery_analytics.sql`.
3. Copy the entire SQL script into a new SQL query and run it.
4. Refresh the website's admin dashboard.

This creates `public.gallery_views` with row-level security:
- Visitors can record a gallery visit or a view of a published event.
- Only authenticated administrators listed in `admin_users` can read view records.
- Deleting an event automatically removes its associated event-view records.
- No IP addresses, names, email addresses, or other visitor identity data are collected.

The same table and policies are also included in `supabase/schema.sql` for new installations.

## What the dashboard shows

- Total events, published events, drafts, and total photos.
- Gallery visits and event opens.
- Per-event view counts.
- Quick Publish / Unpublish actions.

A view is counted once per browser tab session for the gallery and once per event. These are lightweight session-based view counts, not audited unique-visitor analytics.

## Bulk uploads

The existing multi-file picker remains in place. Selected images upload sequentially to Cloudinary, with a progress bar showing completed files. Sequential uploads avoid overwhelming the browser or Cloudinary request path with a large simultaneous batch.
