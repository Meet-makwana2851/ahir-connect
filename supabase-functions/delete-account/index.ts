// Supabase Edge Function: delete-account
// Deletes the currently logged-in user's auth account.
// Their profile/posts/friendships/messages cascade-delete automatically
// (see schema.sql — all foreign keys use ON DELETE CASCADE).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response('Missing Authorization header', { status: 401 });

    // Client scoped to the calling user, just to verify who they are
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return new Response('Not authenticated', { status: 401 });

    // Admin client (service role) — only usable inside this server-side function, never in the browser
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { error: delErr } = await adminClient.auth.admin.deleteUser(user.id);
    if (delErr) return new Response(delErr.message, { status: 500 });

    return new Response('Account deleted', { status: 200 });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
});
