-- Agentic IQ — Curriculum seed data
-- Safe to re-run: idempotent upsert on the natural key `title`, using a
-- deterministic unique index so repeated execution never duplicates rows.
-- No new columns are added; the existing migration schema is used as-is.

create unique index if not exists modules_title_key
  on public.modules (title);

-- Six curriculum modules (order_index 1..6).
insert into public.modules (title, description, order_index, icon)
values
  (
    'LLM Foundations',
    'Understand how large language models work under the hood: tokens, context windows, embeddings, prompt engineering, and the limits of model behaviour.',
    1,
    'brain'
  ),
  (
    'Agent Fundamentals',
    'Learn what separates an AI agent from a plain LLM: goals, autonomy, tools, execution loops, and state management.',
    2,
    'circuit-board'
  ),
  (
    'Agent Architecture',
    'Explore the building blocks of agent systems: memory, planning, reflection, retrieval-augmented generation, reasoning vs. action, and context management.',
    3,
    'layout-grid'
  ),
  (
    'Agent Orchestration',
    'Coordinate multiple agents through sequential workflows, conditional routing, multi-agent collaboration, and human-in-the-loop oversight.',
    4,
    'git-merge'
  ),
  (
    'Production Agents',
    'Make agents safe and reliable in production: guardrails, security, error handling, tool permissions, and responsible agent design.',
    5,
    'shield-check'
  ),
  (
    'Evaluation and Deployment',
    'Measure, trace and ship agents: evaluation, observability, performance monitoring, and production-readiness considerations.',
    6,
    'chart-line'
  )
on conflict (title) do update
  set
    description = excluded.description,
    order_index = excluded.order_index,
    icon = excluded.icon;