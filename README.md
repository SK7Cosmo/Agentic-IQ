# Agentic IQ

**Learn. Reason. Master Agentic AI.**

An adaptive, voice-first learning platform that teaches Agentic AI concepts through structured lessons, reasoning-based assessments, intelligent misconception detection, and personalized learning recommendations.

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Core Differentiators](#core-differentiators)
5. [Features](#features)
6. [Technology Stack](#technology-stack)
7. [Architecture](#architecture)
8. [Database Schema](#database-schema)
9. [Local Setup](#local-setup)
10. [Environment Variables](#environment-variables)
11. [Supabase Setup](#supabase-setup)
12. [Groq API Setup](#groq-api-setup)
13. [Demo Accounts](#demo-accounts)
14. [Demo Workflow](#demo-workflow)
15. [Vercel Deployment](#vercel-deployment)
16. [Known Limitations](#known-limitations)

---

## Overview

Agentic IQ is a hackathon MVP learning platform purpose-built for teaching Agentic AI concepts. It goes beyond conventional quiz-based learning by using AI to evaluate conceptual reasoning, detect misconceptions in learner explanations, and adapt the learning path based on demonstrated understanding.

---

## Problem Statement

Conventional learning platforms measure whether learners select the correct answer — they do not evaluate whether learners actually understand the concept. A student can score 80% on a quiz while holding fundamental misconceptions that would cause them to fail when applying the knowledge in practice.

---

## Solution

Agentic IQ evaluates **reasoning quality**, not just answer correctness.

1. Learners explain concepts in their own words (via text or voice dictation).
2. Groq AI evaluates conceptual depth, identifies missing elements, and detects misconceptions.
3. The backend updates mastery using weighted logic — reasoning assessments count 70%, MCQ 30%.
4. The system recommends the next appropriate learning activity.

---

## Core Differentiators

| Differentiator | Description |
|---|---|
| **Voice-First Learning** | Explain understanding using speech dictation or text. Compatible with OS dictation, Wispr Flow, and browser dictation. |
| **Intelligent Assessment** | Groq AI evaluates conceptual reasoning — not just multiple-choice correctness. |
| **Adaptive Learning** | Tracks concept-level mastery independently. Detects misconceptions and recommends appropriate next activities. |

---

## Features

### Student Experience
- **Dashboard** — Learning progress, active misconceptions, mastery fingerprint
- **Curriculum** — 6 modules, 36 concepts covering the full Agentic AI landscape
- **Diagnostic Assessment** — 2-step: MCQ + voice-first reasoning question
- **Reasoning Studio** — Submit explanations for Groq AI evaluation
- **Misconception Detection** — Identifies incorrect mental models with clear corrections
- **Mastery Tracking** — Per-concept scoring (0–100) with four levels: Beginner → Developing → Proficient → Mastered
- **AI Tutor** — Contextual chat assistant powered by Groq
- **Learning Roadmap** — Visual curriculum progress view
- **Revision Center** — Spaced repetition for identified misconceptions

### Teacher Experience
- **Classroom Dashboard** — Class-wide mastery, common misconceptions, students needing support
- **Student Roster** — Individual mastery, activity, and intervention signals
- **Student Detail View** — Per-student concept mastery breakdown

### AI & Backend
- **Groq Integration** — Server-side only, uses `openai/gpt-oss-120b`
- **Structured Evaluation** — AI returns validated JSON; backend validates before processing
- **Confidence Checking** — Low-confidence evaluations are retried or marked uncertain
- **Mastery Update Engine** — Backend owns mastery calculation; AI provides evidence only
- **Adaptive Recommendations API** — Generates prioritized learning recommendations

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Next.js Route Handlers, Server Actions |
| Database | Supabase PostgreSQL with RLS |
| Auth | Supabase Auth |
| AI Provider | Groq API (`openai/gpt-oss-120b`) |
| Deployment Target | Vercel (not yet deployed) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App (Vercel)                    │
│                                                             │
│  ┌─────────────┐   ┌──────────────────────────────────────┐ │
│  │   Student   │   │          Route Handlers              │ │
│  │   Teacher   │──▶│  /api/assessment/evaluate            │ │
│  │   Browser   │   │  /api/mastery/update                 │ │
│  └─────────────┘   │  /api/recommendations                │ │
│                    │  /api/tutor/chat                      │ │
│                    │  /api/auth/login|logout               │ │
│                    └────────────┬─────────────────────────┘ │
│                                 │                           │
│             ┌───────────────────┼──────────────────┐        │
│             │                   │                  │        │
│      ┌──────▼──────┐   ┌────────▼───────┐   ┌─────▼──────┐ │
│      │  Supabase   │   │  Groq API      │   │  Mastery   │ │
│      │  PostgreSQL │   │  gpt-oss-120b  │   │  Engine    │ │
│      │  + Auth     │   │  (Server-side) │   │  (Backend) │ │
│      │  + RLS      │   └────────────────┘   └────────────┘ │
│      └─────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

### Assessment Flow

```
Learner submits response
        │
        ▼
POST /api/assessment/evaluate
        │
        ▼
Groq AI evaluates reasoning
        │
        ▼
Validate structured output (score, confidence, misconceptions)
        │
   confidence < 0.5?
   ┌────┴────┐
  YES       NO
   │         │
Retry       Continue
   │         │
   └────┬────┘
        │
   evaluationStatus = uncertain?
   ┌────┴────┐
  YES       NO
   │         │
  Skip       POST /api/mastery/update
  mastery    (backend applies weighted formula)
   │         │
   └────┬────┘
        │
        ▼
Display feedback + misconceptions
Display mastery update
Show recommended next activity
```

### Adaptive Learning Flow

```
GET /api/recommendations
        │
        ▼
Fetch all concepts + learner mastery
        │
        ▼
For each concept:
  score = 0        → type: "new"       priority: 3
  score < 30       → type: "revisit"   priority: 5
  30 ≤ score < 60  → type: "practice"  priority: 4
  score ≥ 80       → type: "fast-track" priority: 1
        │
        ▼
Sort by priority → return top 5
```

---

## Database Schema

```
profiles          (id, email, full_name, role, avatar_url)
modules           (id, title, description, order_index, icon)
concepts          (id, module_id, title, description, order_index, prerequisites, slug)
lessons           (id, concept_id, title, content, reading_time_mins, order_index)
questions         (id, concept_id, type, prompt, options, correct_answer, explanation)
learner_mastery   (id, user_id, concept_id, score, level, last_assessed_at)
assessment_results (id, user_id, concept_title, question_prompt, user_response, score, evaluation)
assessment_attempts (id, user_id, concept_id, question_id, user_response, score, ai_evaluation, status)
revision_schedule (id, user_id, concept_id, due_date, interval_days, status)
classes           (id, teacher_id, name, description)
class_members     (id, class_id, student_id)
```

All tables use Row Level Security (RLS). Students can only access their own data. Teachers can view data for students in their class.

---

## Local Setup

### Prerequisites

- Node.js 20+ (`node --version`)
- A Supabase project (hosted — no local PostgreSQL needed)
- A Groq API account

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/agentic-iq.git
cd agentic-iq

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Groq credentials

# 4. Set up database schema
# Run supabase/migrations/001_initial_schema.sql in Supabase SQL Editor
# Run supabase/migrations/002_assessment_results.sql in Supabase SQL Editor

# 5. Seed curriculum data
# Run supabase/seed.sql in Supabase SQL Editor
# Run supabase/seed_concepts.sql in Supabase SQL Editor

# 6. Provision demo accounts
node scripts/setup-demo-accounts.mjs

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | ✅ |
| `GROQ_API_KEY` | Your Groq API key | ✅ |
| `GROQ_MODEL` | Model ID (default: `openai/gpt-oss-120b`) | Optional |
| `GROQ_BASE_URL` | Groq API base URL | Optional |

> **Security**: `SUPABASE_SERVICE_ROLE_KEY` and `GROQ_API_KEY` are used only in server-side Route Handlers. They are never exposed to the browser.

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable (anon) key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
3. Open the **SQL Editor** and run migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_assessment_results.sql`
4. Run seed data:
   - `supabase/seed.sql`
   - `supabase/seed_concepts.sql`
5. Provision demo accounts:
   ```bash
   node scripts/setup-demo-accounts.mjs
   ```

---

## Groq API Setup

1. Create an account at [console.groq.com](https://console.groq.com)
2. Generate an API key under **API Keys**
3. Add to `.env.local`:
   ```
   GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
   GROQ_MODEL=openai/gpt-oss-120b
   GROQ_BASE_URL=https://api.groq.com/openai/v1
   ```

> **Note**: The Groq free tier has rate limits. The demo is designed to use minimal API requests. Static curriculum content is stored in the database and not regenerated on each request.

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@agenticiq.demo` | `AgenticIQ_Student2026!` |
| Teacher | 0`teacher@agenticiq.demo` | `AgenticIQ_Teacher2026!` |

> These are demo-only credentials. Run `node scripts/setup-demo-accounts.mjs` to create them.
> The login page provides **1-click demo access** buttons for evaluators.

---

## Demo Workflow

A complete 3–5 minute demonstration path:

1. **Open** [http://localhost:3000/login](http://localhost:3000/login)
2. **Click "Student Demo"** — 1-click auto-login as Alex Rivera
3. **Dashboard** — See mastery fingerprint, active misconception, and recommended activity
4. **Click "Start Recommended Activity"** — Opens the diagnostic assessment
5. **Step 1: MCQ** — Select the correct answer distinguishing LLM from AI Agent
6. **Step 2: Reasoning** — Click **"Simulate Voice Input"** to load the demo misconception text
7. **Submit** — Watch Groq AI evaluate the response (live API call, ~3 seconds)
8. **Feedback panel** — See the detected misconception, correct mental model, and mastery update
9. **Return to Dashboard** — Observe updated mastery
10. **Open Teacher Demo** — Click logout, then "Teacher Demo" 1-click login
11. **Teacher Dashboard** — Class-wide mastery, common misconceptions, student roster

---

## Vercel Deployment

**Deployment is not yet configured** — preparation is complete.

When ready:
1. Push to GitHub
2. Import project in [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy

The `vercel.json` uses standard Next.js framework integration. No rewrites or custom configuration are needed.

---

## Known Limitations

| Limitation | Notes |
|---|---|
| Static curriculum content | Lesson content is hardcoded in page components. Not yet seeded per-concept in the database. |
| Demo mastery data | Student dashboard shows pre-seeded data; live mastery updates reflect actual assessments. |
| Groq rate limits | Free tier limits apply. Demo uses 1–2 AI calls per session. |
| No email confirmation bypass | Demo accounts are created with `email_confirm: true` via admin API. |
| Concept graph | Roadmap is implemented as a linear list. React Flow interactive graph is planned. |
| No file upload | Voice input uses text area with OS/external dictation support; no audio transcription API. |

---

## License

MIT — Built for the Agentic AI Hackathon 2026.
