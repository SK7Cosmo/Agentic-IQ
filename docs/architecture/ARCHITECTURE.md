# Agentic IQ — Technical Architecture & System Design

**The Socratic Learning Intelligence Studio for Agentic AI Systems**

---

## 1. System Overview

Agentic IQ is an adaptive, voice-first learning intelligence platform built to teach production Agentic AI architectures. Unlike conventional learning systems that rely on superficial multiple-choice quizzes, Agentic IQ evaluates **underlying mental models and architectural reasoning quality** using Groq-accelerated LPU inference, native browser Web Speech capabilities, and a 5-pillar cognitive calibration model.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           Client Browser Layer                            │
│  ┌───────────────────────────────┐     ┌───────────────────────────────┐  │
│  │    Student Learning Studio    │     │ Instructor Intelligence Center│  │
│  │ • Command Center              │     │ • Cohort Analytics Radar      │  │
│  │ • Learning Atlas (6 Stages)   │     │ • 6-Learner Roster Table      │  │
│  │ • Concept Constellation Graph │     │ • 5-Pillar Cognitive Audit    │  │
│  │ • Voice Reasoning Studio      │     └───────────────────────────────┘  │
│  │ • Socratic AI Studio Tutor    │                                        │
│  └───────────────────────────────┘                                        │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                     Vercel Edge Proxy (src/proxy.ts)                     │
│  • Edge Session Refresh (Supabase SSR)                                    │
│  • Root URL Auto-Forwarding (/ → /login or /dashboard)                    │
│  • Role-Based Access Control (/teacher/* vs /dashboard)                  │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router (Turbopack)                      │
│                                                                           │
│  ┌──────────────────────────────┐     ┌────────────────────────────────┐  │
│  │       Route Handlers         │     │     Core Engine Services       │  │
│  │  /api/auth/login | logout    │────▶│ • Groq AI Service (LPU API)    │  │
│  │  /api/assessment/evaluate    │     │ • Mastery Calibration Engine   │  │
│  │  /api/assessment/submit      │     │ • Misconception Radar Engine   │  │
│  │  /api/mastery/update         │     │ • Socratic Dialogue Engine     │  │
│  │  /api/recommendations        │     └────────────────┬───────────────┘  │
│  │  /api/tutor/chat             │                      │                  │
│  └──────────────┬───────────────┘                      │                  │
└─────────────────┼──────────────────────────────────────┼──────────────────┘
                  │                                      │
                  ▼                                      ▼
┌───────────────────────────────────┐  ┌────────────────────────────────────┐
│      Supabase Cloud Platform      │  │      Groq LPU Inference Cloud      │
│  • Supabase Auth (SSR Tokens)     │  │  • Llama 3.3 70B Versatile         │
│  • PostgreSQL with Row Security   │  │  • gpt-oss-120b                    │
│  • Profiles, Mastery & Curricula  │  │  • Sub-second JSON completions     │
└───────────────────────────────────┘  └────────────────────────────────────┘
```

---

## 2. Core Architectural Pillars

### 2.1 The Two Dedicated Studio Portals

#### A. Student Learning Studio
1. **Command Center (`/dashboard`)**: Displays real-time cognitive trajectory, average mastery calibration, active misconception warnings, and personalized next-step recommendations.
2. **Learning Atlas (`/curriculum/[moduleId]`)**: 6 stages of progressive systems architecture (LLM Foundations → Agent Fundamentals → Agent Architecture → Orchestration → Production Agents → Evaluation & Benchmarks). Includes 24 deep concepts with analogy breakdowns, production code, key takeaways, and Web Speech audio narration.
3. **Concept Constellation (`/roadmap`)**: Interactive SVG topological dependency graph modeling prerequisites, mastery thresholds, and interactive concept inspector drawers.
4. **Reasoning Studio (`/assessment/diagnostic`)**: Voice-first oral reasoning evaluations where learners articulate architectural trade-offs to AI evaluators.
5. **Studio Tutor (`/tutor`)**: Context-aware Socratic mentor powered by Groq.

#### B. Instructor Intelligence Center
1. **Class Analytics (`/teacher/dashboard`)**: High-level view of cohort progress, average class mastery (69%), and the **Class-Wide Misconception Radar** surfacing flawed mental models across voice submissions with a 1-click "Broadcast Studio Drill" trigger.
2. **Student Directory (`/teacher/students`)**: Unified 6-learner roster with real-time text search, cognitive status filters (*Advanced*, *On Track*, *Needs Support*), and horizontal scroll-safe layout.
3. **Learner Cognitive Audit (`/teacher/students/[studentId]`)**: Comprehensive audit page detailing:
   - **5-Pillar Mastery Fingerprint**:
     - *Conceptual Foundations*
     - *Implementation Fluency*
     - *Failure & Self-Correction*
     - *Trade-off Analysis*
     - *Tool & Schema Design*
   - Specific diagnosed misconceptions with severity badges (*High*, *Medium*, *Low*).
   - Chronological reasoning trajectory history.

---

## 3. Edge Routing & Session Security

Next.js 16 Edge proxying is centralized in [`src/proxy.ts`](file:///c:/SK7%20Officials/SK7%20Codebase/agentic_iq/src/proxy.ts):

```typescript
// Role & Destination Dispatch Logic
const isTeacher = user?.email?.toLowerCase().includes('teacher') || user?.user_metadata?.role === 'teacher';

// 1. Root / Forwarding
if (pathname === '/') {
  redirectUrl.pathname = user ? (isTeacher ? '/teacher/dashboard' : '/dashboard') : '/login';
  return NextResponse.redirect(redirectUrl);
}

// 2. Already Logged-in Forwarding
if (user && pathname === '/login') {
  redirectUrl.pathname = isTeacher ? '/teacher/dashboard' : '/dashboard';
  return NextResponse.redirect(redirectUrl);
}

// 3. Role Boundary Enforcement
if (user && isTeacher && pathname === '/dashboard') {
  redirectUrl.pathname = '/teacher/dashboard';
  return NextResponse.redirect(redirectUrl);
}
if (user && !isTeacher && pathname.startsWith('/teacher')) {
  redirectUrl.pathname = '/dashboard';
  return NextResponse.redirect(redirectUrl);
}
```

---

## 4. Cognitive Evaluation & Mastery Engine

Reasoning evaluation is managed server-side via [`/api/assessment/evaluate`](file:///c:/SK7%20Officials/SK7%20Codebase/agentic_iq/src/app/api/assessment/evaluate/route.ts) with Groq inference:

1. **Structured JSON Validation**:
   - Scores responses on conceptual correctness, depth, and missing elements.
   - Extracts specific flawed assertions into actionable misconception objects.
   - Assesses confidence score ($0.0 \le c \le 1.0$).
2. **Confidence Retries**:
   - If confidence $< 0.50$, the system automatically prompts with a higher-precision disambiguation query.
   - Low confidence evaluations are flagged `uncertain` without penalizing the learner.
3. **Mastery Formula**:
   $$\text{Score}_{\text{new}} = \text{Score}_{\text{prev}} \times (1 - w \cdot c) + \text{Score}_{\text{assessed}} \times (w \cdot c)$$
   Where:
   - $w = 0.70$ for oral reasoning assessments (voice-first).
   - $w = 0.30$ for multiple-choice diagnostic checks.
   - $c = \text{AI confidence weight}$.

---

## 5. Technology Stack Summary

| Layer | Technology | Function |
|---|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Components, Partial Prefetching (PPR), Edge Proxy |
| **Language** | TypeScript (Strict mode) | End-to-end type safety |
| **Styling** | Tailwind CSS v4 | Editorial warm-ivory design system (`bg-warm-ivory`, `electric-indigo`) |
| **Speech** | Web Speech API | Client-side native speech recognition & audio narration synthesis |
| **Database & Auth** | Supabase (PostgreSQL + RLS) | Session token management, user metadata, and persistent profiles |
| **AI Inference** | Groq LPU API (`llama-3.3-70b-versatile`) | Sub-3-second conversational Socratic reasoning evaluations |
| **Deployment** | Vercel Platform | Zero-config edge deployment with automated GitHub CI/CD |

