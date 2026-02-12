-- ============================================
-- Servizi Secondari - Database Migration
-- Run this in the Supabase SQL Editor
-- ============================================

-- 0. Clean up all existing policies first (idempotent)
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  -- Services
  DROP POLICY IF EXISTS "Users can view own services" ON public.services;
  DROP POLICY IF EXISTS "Admins and operators can view all services" ON public.services;
  DROP POLICY IF EXISTS "Users can create own services" ON public.services;
  DROP POLICY IF EXISTS "Users can update own services" ON public.services;
  DROP POLICY IF EXISTS "Admins can update any service" ON public.services;
  DROP POLICY IF EXISTS "Users can delete own services" ON public.services;
  DROP POLICY IF EXISTS "Admins can delete any service" ON public.services;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own secondary services" ON public.secondary_services;
  DROP POLICY IF EXISTS "Admins and operators can view all secondary services" ON public.secondary_services;
  DROP POLICY IF EXISTS "Users can create own secondary services" ON public.secondary_services;
  DROP POLICY IF EXISTS "Users can update own secondary services" ON public.secondary_services;
  DROP POLICY IF EXISTS "Admins can update any secondary service" ON public.secondary_services;
  DROP POLICY IF EXISTS "Users can delete own secondary services" ON public.secondary_services;
  DROP POLICY IF EXISTS "Admins can delete any secondary service" ON public.secondary_services;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own event services" ON public.event_services;
  DROP POLICY IF EXISTS "Admins and operators can view all event services" ON public.event_services;
  DROP POLICY IF EXISTS "Users can create own event services" ON public.event_services;
  DROP POLICY IF EXISTS "Users can update own event services" ON public.event_services;
  DROP POLICY IF EXISTS "Admins can update any event service" ON public.event_services;
  DROP POLICY IF EXISTS "Users can delete own event services" ON public.event_services;
  DROP POLICY IF EXISTS "Admins can delete any event service" ON public.event_services;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'operator', 'user')),
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Services table (parent — shared fields only)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('sport', 'secondary')),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'completed', 'cancelled')),
  service_date DATE,
  kilometers NUMERIC(10, 2) DEFAULT 0,
  price NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add service_date if table already exists (idempotent)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS service_date DATE;

-- Drop the old JSONB data column if it exists (from previous schema)
ALTER TABLE public.services DROP COLUMN IF EXISTS data;

-- 4. Secondary services child table (1:1 with services)
CREATE TABLE IF NOT EXISTS public.secondary_services (
  service_id UUID PRIMARY KEY REFERENCES public.services(id) ON DELETE CASCADE,
  service_date DATE,
  patient_name TEXT NOT NULL DEFAULT '',
  phone_number TEXT,
  service_type TEXT NOT NULL DEFAULT '',
  arrival_time TEXT,
  departure_time TEXT,
  pickup_address TEXT NOT NULL DEFAULT '',
  pickup_type TEXT,
  pickup_time TEXT,
  dropoff_address TEXT NOT NULL DEFAULT '',
  dropoff_type TEXT,
  dropoff_time TEXT,
  vehicle TEXT,
  equipment TEXT[] DEFAULT '{}',
  position TEXT,
  difficulties TEXT[] DEFAULT '{}',
  additional_notes TEXT
);

-- 5. Event services child table (1:1 with services)
CREATE TABLE IF NOT EXISTS public.event_services (
  service_id UUID PRIMARY KEY REFERENCES public.services(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT '',
  event_name TEXT NOT NULL DEFAULT '',
  event_date DATE,
  start_time TEXT,
  end_time TEXT,
  arrival_time TEXT,
  departure_time TEXT,
  organizer_name TEXT NOT NULL DEFAULT '',
  organizer_contact TEXT,
  vehicle TEXT,
  equipment TEXT[] DEFAULT '{}',
  notes TEXT
);

-- 6. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_services_user_id ON public.services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_type ON public.services(type);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_service_date ON public.services(service_date);

-- Backfill service_date from child tables for existing rows
UPDATE public.services s
SET service_date = COALESCE(
  (SELECT ss.service_date FROM public.secondary_services ss WHERE ss.service_id = s.id),
  (SELECT es.event_date FROM public.event_services es WHERE es.service_id = s.id)
)
WHERE s.service_date IS NULL;

-- 7. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 8. Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secondary_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_services ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile, admins can read all
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Services (parent): users can CRUD their own, admins/operators can see all
DROP POLICY IF EXISTS "Users can view own services" ON public.services;
CREATE POLICY "Users can view own services"
  ON public.services FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins and operators can view all services" ON public.services;
CREATE POLICY "Admins and operators can view all services"
  ON public.services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

DROP POLICY IF EXISTS "Users can create own services" ON public.services;
CREATE POLICY "Users can create own services"
  ON public.services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own services" ON public.services;
CREATE POLICY "Users can update own services"
  ON public.services FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any service" ON public.services;
CREATE POLICY "Admins can update any service"
  ON public.services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can delete own services" ON public.services;
CREATE POLICY "Users can delete own services"
  ON public.services FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete any service" ON public.services;
CREATE POLICY "Admins can delete any service"
  ON public.services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Secondary services: access mirrors the parent service ownership
DROP POLICY IF EXISTS "Users can view own secondary services" ON public.secondary_services;
CREATE POLICY "Users can view own secondary services"
  ON public.secondary_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = secondary_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins and operators can view all secondary services" ON public.secondary_services;
CREATE POLICY "Admins and operators can view all secondary services"
  ON public.secondary_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

DROP POLICY IF EXISTS "Users can create own secondary services" ON public.secondary_services;
CREATE POLICY "Users can create own secondary services"
  ON public.secondary_services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = secondary_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own secondary services" ON public.secondary_services;
CREATE POLICY "Users can update own secondary services"
  ON public.secondary_services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = secondary_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update any secondary service" ON public.secondary_services;
CREATE POLICY "Admins can update any secondary service"
  ON public.secondary_services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can delete own secondary services" ON public.secondary_services;
CREATE POLICY "Users can delete own secondary services"
  ON public.secondary_services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = secondary_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can delete any secondary service" ON public.secondary_services;
CREATE POLICY "Admins can delete any secondary service"
  ON public.secondary_services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Event services: access mirrors the parent service ownership
DROP POLICY IF EXISTS "Users can view own event services" ON public.event_services;
CREATE POLICY "Users can view own event services"
  ON public.event_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = event_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins and operators can view all event services" ON public.event_services;
CREATE POLICY "Admins and operators can view all event services"
  ON public.event_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'operator')
    )
  );

DROP POLICY IF EXISTS "Users can create own event services" ON public.event_services;
CREATE POLICY "Users can create own event services"
  ON public.event_services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = event_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own event services" ON public.event_services;
CREATE POLICY "Users can update own event services"
  ON public.event_services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = event_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update any event service" ON public.event_services;
CREATE POLICY "Admins can update any event service"
  ON public.event_services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can delete own event services" ON public.event_services;
CREATE POLICY "Users can delete own event services"
  ON public.event_services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.services
      WHERE services.id = event_services.service_id AND services.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can delete any event service" ON public.event_services;
CREATE POLICY "Admins can delete any event service"
  ON public.event_services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.services TO authenticated;
GRANT ALL ON public.secondary_services TO authenticated;
GRANT ALL ON public.event_services TO authenticated;

-- Allow the service role to bypass RLS (used by API routes)
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.services TO service_role;
GRANT ALL ON public.secondary_services TO service_role;
GRANT ALL ON public.event_services TO service_role;
