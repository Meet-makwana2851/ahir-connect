# AhirConnect (multi-page edition) — Setup Guide

## What changed from the single-file version
Instead of one giant `index.html`, the app is now split into separate pages, sharing common code:

```
shared/
  style.css        ← all styling, used by every page
  config.js         ← your Supabase URL + key, in ONE place
  utils.js          ← auth guard, sidebar injection, small helpers
login.html
signup.html
home.html           ← feed
friends.html        ← find friends / send requests
requests.html        ← accept / decline requests
chat.html
profile.html         ← bio + delete account
supabase-functions/
  delete-account/index.ts   ← optional, see step 7
schema.sql            ← your database structure (same as before)
```

Each page loads `shared/config.js` and `shared/utils.js`, calls `requireAuth()` to check the user is logged in (redirecting to `login.html` if not), then `renderSidebar('pagename', user, profile)` to draw the nav. This means:
- Editing styling = edit `shared/style.css` once, every page updates.
- Adding a new page later = copy the pattern from any existing page.
- Updating your Supabase keys = edit `shared/config.js` once.

## 1–4: Same Supabase project setup as before
If you already set up Supabase for the single-file version, **skip to step 5** — you can reuse the same project.

If starting fresh:
1. Create a project at https://supabase.com
2. SQL Editor → paste `schema.sql` → Run
3. Storage → create two **public** buckets: `posts` and `avatars`
4. Authentication → Providers → make sure **Email** is enabled (this is what fixes the "Email signups are disabled" error). Also decide on **Confirm email** (off = faster testing, on = safer for public launch).

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
