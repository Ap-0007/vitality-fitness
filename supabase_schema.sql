-- Fitness Tracker Database Schema

-- Users table (profile data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_step_goal INTEGER DEFAULT 10000,
  weight_goal NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'Cardio', 'Weightlifting', 'Flexibility'
  name TEXT,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout sets (for Weightlifting)
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  weight NUMERIC,
  reps INTEGER,
  order_index INTEGER DEFAULT 0
);

-- Biometrics tracking
CREATE TABLE IF NOT EXISTS public.biometrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  weight NUMERIC,
  sleep_hours NUMERIC,
  steps INTEGER,
  avg_heart_rate INTEGER,
  UNIQUE(user_id, date)
);

-- Nutrition tracking
CREATE TABLE IF NOT EXISTS public.nutrition (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  meal_name TEXT,
  calories_in INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sets" ON public.workout_sets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workouts WHERE id = workout_id AND user_id = auth.uid())
);

CREATE POLICY "Users can manage own biometrics" ON public.biometrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own nutrition" ON public.nutrition FOR ALL USING (auth.uid() = user_id);
