-- =====================================================================
-- AhirSetu MVP — Supabase Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- 1. Add community fields to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gam text DEFAULT '',
ADD COLUMN IF NOT EXISTS gotra text DEFAULT '',
ADD COLUMN IF NOT EXISTS district text DEFAULT '',
ADD COLUMN IF NOT EXISTS profession text DEFAULT '';

-- 2. Update the auto-create profile trigger to populate initial meta data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, gam, gotra, district, profession)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'New Member'),
    COALESCE(new.raw_user_meta_data->>'gam', ''),
    COALESCE(new.raw_user_meta_data->>'gotra', ''),
    COALESCE(new.raw_user_meta_data->>'district', ''),
    COALESCE(new.raw_user_meta_data->>'profession', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
