# AhirSetu — Yaduvanshi Samaj Community Portal Setup Guide

## Architecture Overview
Instead of a complex build step, AhirSetu uses a clean, debuggable multi-page Vanilla HTML/CSS/JS architecture connected directly to Supabase:

```
shared/
  style.css        ← Royal Krishna Navy & Peacock Gold theme + community styles
  config.js        ← your Supabase URL + key, in ONE place
  utils.js         ← auth guard, AhirSetu sidebar injection with Dayro & Directory
login.html         ← Login with AhirSetu spiritual branding
signup.html        ← Signup with Full Name, Native Village (Gam) & Gotra
home.html          ← Samaj Feed with Daily Geeta Shloka, Circulars & Mor Pankh likes
friends.html       ← Gam & Gotra Samaj Directory with District & Gotra filters
dayro.html         ← Cultural Corner & Dayro Video/Audio Hub + Heritage
profile.html       ← Community Profile (Gam, Gotra, District, Profession view & edit)
requests.html      ← Follow & Community connections
chat.html          ← 1-on-1 messaging
schema-mvp.sql     ← SQL migration script to add Gam, Gotra, District, Profession
```

## 1. Supabase Project Setup & Database Migration
1. Go to your Supabase Dashboard: https://supabase.com
2. Navigate to **SQL Editor** → **New query**
3. If setting up fresh: Paste and run `schema.sql`, then paste and run `schema-mvp.sql`.
4. If updating an existing database: Just paste and run `schema-mvp.sql` (it safely adds `gam`, `gotra`, `district`, `profession` columns).
5. In **Storage**: Ensure two public buckets exist: `posts` and `avatars`.
6. In **Authentication** → **Providers**: Ensure `Email` provider is enabled.

## 5. Add your keys
Open `shared/config.js` and replace:
```js
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```
with your actual Project URL and anon key (Project Settings → API). You only do this once, in this one file.

## 6. Test locally
Open `login.html` directly in your browser (not `index.html` — there isn't one anymore). Sign up, and you'll land on `home.html`. Try posting, adding a second test account as a friend, and chatting.

## 7. Optional: self-serve account deletion
The Profile page has a "Delete My Account" button already wired up, but it needs a small server-side function to actually work (deleting a user requires admin privileges that can't safely live in browser code).

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. In your project folder:
   ```
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy delete-account
   ```
3. That's it — the function reads your project's built-in `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`, which Supabase provides automatically to Edge Functions. You don't need to set these yourself.
4. Test the "Delete My Account" button on a throwaway account.

If you skip this step, the button will show a friendly message instead of failing silently — nothing breaks.

## 8. Go live
Same as before — easiest is drag-and-drop:
1. Go to https://app.netlify.com/drop
2. This time, drag the **whole folder** (not just one file) — Netlify needs `shared/`, all the `.html` pages, etc. together.
3. You'll get a live link like `https://random-name.netlify.app`. Bookmark `login.html` as the entry point, or set up a redirect so `/` opens `login.html` (Netlify: add a file named `_redirects` with the line `/  /login.html  200`).

## Adding more pages later
Copy the pattern from any existing page (e.g. `friends.html`):
1. Copy the `<head>` block (loads Supabase JS + shared CSS)
2. Copy the `<div class="app-shell"><div id="sidebarMount"></div><div class="main-panel">...</div></div>` structure
3. At the bottom: `requireAuth()` → `renderSidebar('yourpage', user, profile)` → your page-specific logic
4. Add a nav entry for it in `shared/utils.js` → `renderSidebar()` → the `navItems` array

That's the whole extension pattern — likes/comments, group chats, notifications, or an admin page would all follow it.
