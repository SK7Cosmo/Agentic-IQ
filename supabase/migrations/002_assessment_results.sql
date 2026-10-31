-- Migration: Add assessment_results table (used by /api/assessment/submit)
-- Note: assessment_attempts is more structured for AI evaluations;
-- assessment_results provides simpler persistence for the demo flow.

create table if not exists public.assessment_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  concept_title text not null,
  question_prompt text,
  user_response text not null,
  score integer check (score >= 0 and score <= 100),
  evaluation jsonb,
  assessed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assessment_results enable row level security;

create policy "Users can view own results" on public.assessment_results
  for select using (auth.uid() = user_id);

create policy "Users can insert own results" on public.assessment_results
  for insert with check (auth.uid() = user_id);

-- Add missing index on learner_mastery for performance
create index if not exists idx_learner_mastery_user_id on public.learner_mastery(user_id);
create index if not exists idx_assessment_results_user_id on public.assessment_results(user_id);
create index if not exists idx_revision_schedule_user_due on public.revision_schedule(user_id, due_date);

-- Allow teachers to view mastery data for students in their class
create policy "Teachers can view class student mastery" on public.learner_mastery
  for select using (
    exists (
      select 1 from public.class_members cm
      join public.classes c on cm.class_id = c.id
      where cm.student_id = learner_mastery.user_id
        and c.teacher_id = auth.uid()
    )
    or auth.uid() = user_id
  );
