/* =====================================================================
   AhirConnect — Supabase config
   Paste your Project URL + anon key here ONCE. Every page loads this file,
   so you never have to touch keys again after this.
   Get these from: Supabase Dashboard → Project Settings → API
===================================================================== */
const SUPABASE_URL = "https://vffnygebcscupjnnflvd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZm55Z2ViY3NjdXBqbm5mbHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDg0OTgsImV4cCI6MjEwMjM4NDQ5OH0.vPX_x3Kxb0tJLfyGwlaCO-gQwo_N-jpJI7ocW6YgtyE";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
