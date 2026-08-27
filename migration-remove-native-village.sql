-- Native village and gotra are no longer collected or displayed by AhirConnect.
-- Run once in Supabase SQL Editor to remove values already stored in profiles.
UPDATE public.profiles
SET gam = '', gotra = ''
WHERE gam IS DISTINCT FROM '' OR gotra IS DISTINCT FROM '';