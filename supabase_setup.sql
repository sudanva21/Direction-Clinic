-- Supabase Setup Script for Clinic Management System

-- 1. Create Profiles Table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'receptionist')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_number TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in-consultation', 'completed', 'billed')),
  assigned_doctor TEXT,
  symptoms TEXT,
  prescription TEXT,
  bill_amount DECIMAL(10, 2),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Token Generation Function (RPC)
-- This function generates the next token number for the current day (e.g., T001, T002)
CREATE OR REPLACE FUNCTION public.get_next_token_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_count INTEGER;
  next_token TEXT;
BEGIN
  -- Count patients registered today
  SELECT COUNT(*) INTO today_count
  FROM public.patients
  WHERE visit_date = CURRENT_DATE;
  
  -- Increment and format (e.g., T + 001)
  next_token := 'T' || LPAD((today_count + 1)::TEXT, 3, '0');
  
  RETURN next_token;
END;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Patients: Authenticated users can read and manage all patients (Clinic staff)
CREATE POLICY "Clinic staff can manage all patients" 
ON public.patients FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Trigger for Automatic Profile Creation (Optional but helpful)
-- This automatically creates a profile entry when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'New User'), COALESCE(new.raw_user_meta_data->>'role', 'receptionist'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Note: To set up initial users, you can use the Supabase Auth UI or the Auth.signUp method in the app.
-- Ensure the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.
