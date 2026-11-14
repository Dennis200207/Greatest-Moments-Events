# Supabase setup for Greatest Moments Events

The gallery uses Supabase for event folders, photos, and administrator sign-in. The website uses only the public anon/publishable key; Row Level Security protects writes.

## 1. Create a Supabase project
1. Open https://supabase.com/dashboard and sign in or create an account.
2. Choose **New project**, select an organisation, name it `greatest-moments-events`, set a strong database password, and choose a nearby EU region.
3. Wait until the project is ready.

## 2. Create the gallery database and photo bucket
1. In the Supabase project, open **SQL Editor**.
2. Open this repository's `supabase/schema.sql` file.
3. Copy the full SQL into a new SQL query and click **Run**.

This creates the event folders, photo records, admin allow-list, row-level security policies, and the `event-photos` storage bucket.

## 3. Create your private administrator login
1. Open **Authentication → Users**.
2. Choose **Add user** / **Create new user** and enter the email and password you want to use at `/\#/admin`.
3. Confirm the user if the dashboard offers that option.
4. Copy the user's **UID** from the Users table.
5. In **SQL Editor**, run the following query after replacing the placeholder with that UID:

```sql
insert into public.admin_users (user_id)
values ('PASTE-YOUR-AUTH-USER-UUID-HERE');
```

Only user IDs added to `admin_users` can create, edit, publish, or delete gallery events.

## 4. Connect the website to this project
1. In Supabase, open **Project Settings → API** (or the project's **Connect** panel).
2. Copy the **Project URL**.
3. Copy the **anon / publishable public key**. Do not use the `service_role` or secret key.
4. Open the GitHub repository **Settings → Secrets and variables → Actions**.
5. Create these two **Repository secrets**:

| Secret name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your anon / publishable public key |

6. A new push to `main` will rebuild the website with these values. You can also use **Actions → Deploy website to GitHub Pages → Run workflow**.

## 5. Use the gallery
- Public gallery: open the website and choose **Gallery**. Visitors can filter by occasion and toggle locations on/off.
- Admin area: open the website footer's **Admin** link or visit `#/admin` and sign in.
- Create an event folder with a title, occasion, date, location, description, and photos. Uncheck **Visible to visitors** to keep it unpublished.
- Visitors see only published folders. Admins can edit or delete folders.

## Security notes
- Never put the Supabase `service_role` / secret key in the website, a `VITE_*` variable, or a public GitHub file.
- Keep the administrator password private.
- The Supabase public/anon key is designed to be present in browser code; the SQL policies are what prevent visitors from changing the gallery.
