-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User profiles with role support (student or teacher)
create type user_role as enum ('student', 'teacher');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text not null,
  role user_role not null default 'student',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security on profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Curriculum Modules
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  order_index integer not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.modules enable row level security;
create policy "Modules are viewable by everyone" on public.modules for select using (true);

-- Concepts
create table public.concepts (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  description text not null,
  order_index integer not null,
  prerequisites jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.concepts enable row level security;
create policy "Concepts are viewable by everyone" on public.concepts for select using (true);

-- Lessons
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  concept_id uuid references public.concepts(id) on delete cascade not null,
  title text not null,
  content text not null, -- Markdown content
  reading_time_mins integer default 5,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;
create policy "Lessons are viewable by everyone" on public.lessons for select using (true);

-- Questions (MCQ and Open-ended reasoning)
create type question_type as enum ('mcq', 'reasoning', 'scenario');

create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  concept_id uuid references public.concepts(id) on delete cascade not null,
  type question_type not null,
  prompt text not null,
  options jsonb default '[]'::jsonb, -- for MCQ: array of options
  correct_answer text, -- for MCQ or reference answer key
  explanation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.questions enable row level security;
create policy "Questions are viewable by everyone" on public.questions for select using (true);

-- Learner Mastery
create table public.learner_mastery (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concept_id uuid references public.concepts(id) on delete cascade not null,
  score integer default 0 check (score >= 0 and score <= 100),
  level text default 'beginner', -- beginner, developing, proficient, mastered
  last_assessed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, concept_id)
);

alter table public.learner_mastery enable row level security;
create policy "Users can view own mastery" on public.learner_mastery for select using (auth.uid() = user_id);
create policy "Users can insert own mastery" on public.learner_mastery for insert with check (auth.uid() = user_id);
create policy "Users can update own mastery" on public.learner_mastery for update using (auth.uid() = user_id);

-- Assessment Attempts
create table public.assessment_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concept_id uuid references public.concepts(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  user_response text not null,
  is_correct boolean,
  score integer check (score >= 0 and score <= 100),
  ai_evaluation jsonb, -- structured evaluation JSON
  misconceptions jsonb default '[]'::jsonb,
  status text default 'completed', -- completed, skipped, uncertain
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assessment_attempts enable row level security;
create policy "Users can view own assessment attempts" on public.assessment_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own assessment attempts" on public.assessment_attempts for insert with check (auth.uid() = user_id);

-- Revision Schedule (Spaced Repetition)
create table public.revision_schedule (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concept_id uuid references public.concepts(id) on delete cascade not null,
  due_date timestamp with time zone not null,
  interval_days integer default 3,
  status text default 'pending', -- pending, completed, overdue
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.revision_schedule enable row level security;
create policy "Users can view own revision schedule" on public.revision_schedule for select using (auth.uid() = user_id);
create policy "Users can update own revision schedule" on public.revision_schedule for update using (auth.uid() = user_id);
create policy "Users can insert own revision schedule" on public.revision_schedule for insert with check (auth.uid() = user_id);

-- Classes and Class Members (for Teacher dashboard)
create table public.classes (
  id uuid default uuid_generate_v4() primary key,
  teacher_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.classes enable row level security;
create policy "Classes viewable by members or teachers" on public.classes for select using (true);

create table public.class_members (
  id uuid default uuid_generate_v4() primary key,
  class_id uuid references public.classes(id) on delete cascade not null,
  student_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(class_id, student_id)
);

alter table public.class_members enable row level security;
create policy "Class members viewable by everyone" on public.class_members for select using (true);
