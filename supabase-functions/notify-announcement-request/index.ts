import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response('Not authenticated', { status: 401, headers: corsHeaders });
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) return new Response('Not authenticated', { status: 401, headers: corsHeaders });

    const { request_id } = await req.json();
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: request, error: requestError } = await adminClient
      .from('announcement_requests')
      .select('name, email, query, created_at')
      .eq('id', request_id)
      .eq('user_id', user.id)
      .single();
    if (requestError || !request) return new Response('Request not found', { status: 404, headers: corsHeaders });

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AhirConnect <onboarding@resend.dev>',
        to: ['ahirconnect.contact@gmail.com'],
        reply_to: request.email,
        subject: 'New AhirConnect announcement request',
        text: `Name: ${request.name}\nEmail: ${request.email}\n\nQuery:\n${request.query}`,
      }),
    });
    if (!resendResponse.ok) return new Response(await resendResponse.text(), { status: 502, headers: corsHeaders });
    return new Response('Notification sent', { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(String(error), { status: 500, headers: corsHeaders });
  }
});