-- Agentic IQ — Comprehensive Seed Data
-- Run seed.sql FIRST, then this file.
-- Idempotent: uses slug-based unique index to avoid duplicates.
-- Concepts reference modules via subquery on title.

-- Ensure slug column exists
alter table public.concepts add column if not exists slug text;
create unique index if not exists concepts_slug_key on public.concepts (slug);

-- ──────────────────────────────────────────
-- MODULE 1: LLM FOUNDATIONS
-- ──────────────────────────────────────────
insert into public.concepts (module_id, title, description, order_index, prerequisites, slug)
select m.id, c.title, c.description, c.order_index, c.prerequisites::jsonb, c.slug
from public.modules m,
(values
  ('Tokens and Embeddings',
   'Text is split into tokens before LLM processing. Embeddings convert tokens into high-dimensional vectors encoding semantic meaning.',
   1, '[]', 'llm-tokens-embeddings'),
  ('Context Windows',
   'The maximum token sequence an LLM can process in a single pass. Content beyond this limit is dropped — the model cannot see it.',
   2, '[]', 'llm-context-windows'),
  ('Attention Mechanism',
   'Core Transformer computation that dynamically weights the relevance of each token relative to every other token in the sequence.',
   3, '[]', 'llm-attention-mechanism'),
  ('Prompt Engineering',
   'Techniques for crafting instructions that guide LLM behavior: zero-shot, few-shot, chain-of-thought, and structured output prompting.',
   4, '[]', 'llm-prompt-engineering'),
  ('LLM Limitations and Hallucinations',
   'Inherent model constraints: inability to reason reliably over complex tasks, generation of plausible but incorrect outputs (hallucinations), and lack of persistent memory.',
   5, '[]', 'llm-limitations-hallucinations')
) as c(title, description, order_index, prerequisites, slug)
where m.title = 'LLM Foundations'
on conflict (slug) do update
  set description = excluded.description,
      order_index  = excluded.order_index;

-- ──────────────────────────────────────────
-- MODULE 2: AGENT FUNDAMENTALS
-- ──────────────────────────────────────────
insert into public.concepts (module_id, title, description, order_index, prerequisites, slug)
select m.id, c.title, c.description, c.order_index, c.prerequisites::jsonb, c.slug
from public.modules m,
(values
  ('What Is an AI Agent?',
   'Autonomous systems that perceive their environment, reason about goals, select actions, and execute them — going far beyond text generation.',
   1, '[]', 'agent-what-is'),
  ('LLM vs AI Agent',
   'LLMs generate text from prompts. Agents combine LLMs with tool access, memory, and goal-directed execution loops to act upon the world.',
   2, '[]', 'agent-llm-vs-agent'),
  ('Goals and Autonomy',
   'The capacity to operate toward a persistent goal without continuous human intervention, selecting actions based on context and feedback.',
   3, '[]', 'agent-goals-autonomy'),
  ('Tools and Tool Calling',
   'Functions the agent can invoke (web search, code execution, APIs) to gather information or effect real-world changes.',
   4, '[]', 'agent-tools-tool-calling'),
  ('Agent Execution Loop',
   'The perceive → reason → act → observe cycle that agents repeat iteratively until a goal is achieved or a stopping condition is met.',
   5, '[]', 'agent-execution-loop'),
  ('State and Context Management',
   'How agents track conversational state, working memory, and environmental context across multiple reasoning steps.',
   6, '[]', 'agent-state-context')
) as c(title, description, order_index, prerequisites, slug)
where m.title = 'Agent Fundamentals'
on conflict (slug) do update
  set description = excluded.description,
      order_index  = excluded.order_index;

-- ──────────────────────────────────────────
-- MODULE 3: AGENT ARCHITECTURE
-- ──────────────────────────────────────────
insert into public.concepts (module_id, title, description, order_index, prerequisites, slug)
select m.id, c.title, c.description, c.order_index, c.prerequisites::jsonb, c.slug
from public.modules m,
(values
  ('Agent Memory',
   'Short-term (in-context) vs long-term (vector DB) memory. How agents store, retrieve, and use information beyond their context window.',
   1, '[]', 'arch-memory'),
  ('Planning',
   'Decomposing high-level goals into executable steps. Approaches include ReAct, CoT, Plan-and-Execute, and tree-of-thought planning.',
   2, '[]', 'arch-planning'),
  ('Reflection',
   'Self-evaluation: agents critique their own outputs, detect errors, and revise plans based on feedback from tool results or evaluators.',
   3, '[]', 'arch-reflection'),
  ('Retrieval-Augmented Generation',
   'Augmenting LLM responses with dynamically retrieved external knowledge to improve accuracy and reduce hallucinations.',
   4, '[]', 'arch-rag'),
  ('Reasoning and Action',
   'The ReAct pattern: interleaving chain-of-thought reasoning traces with concrete tool-use actions to achieve goals reliably.',
   5, '[]', 'arch-reasoning-action'),
  ('Context Management',
   'Strategies for maintaining relevant context: summarization, memory distillation, sliding windows, and hierarchical recall.',
   6, '[]', 'arch-context-management')
) as c(title, description, order_index, prerequisites, slug)
where m.title = 'Agent Architecture'
on conflict (slug) do update
  set description = excluded.description,
      order_index  = excluded.order_index;

-- ──────────────────────────────────────────
-- MODULE 4: AGENT ORCHESTRATION
-- ──────────────────────────────────────────
insert into public.concepts (module_id, title, description, order_index, prerequisites, slug)
select m.id, c.title, c.description, c.order_index, c.prerequisites::jsonb, c.slug
from public.modules m,
(values
  ('Sequential Workflows',
   'Linear chains where each step''s output becomes the next step''s input. Simple, predictable, and easy to debug.',
   1, '[]', 'orch-sequential'),
  ('Conditional Workflows',
   'Dynamic branching where agents choose execution paths based on runtime conditions, outputs, or tool results.',
   2, '[]', 'orch-conditional'),
  ('Routing',
   'Directing tasks to specialized agents based on topic, capability, or context — the foundation of scalable multi-agent systems.',
   3, '[]', 'orch-routing'),
  ('Multi-Agent Systems',
   'Coordination architectures where multiple specialized agents collaborate: supervisor-worker, peer-to-peer, and hierarchical patterns.',
   4, '[]', 'orch-multi-agent'),
  ('Agent Collaboration',
   'Communication protocols, shared memory, and handoff mechanisms that enable productive cooperation between agents.',
   5, '[]', 'orch-collaboration'),
  ('Human-in-the-Loop',
   'Integration of human approval, correction, or oversight at critical decision points within automated agent workflows.',
   6, '[]', 'orch-human-in-the-loop')
) as c(title, description, order_index, prerequisites, slug)
where m.title = 'Agent Orchestration'
on conflict (slug) do update
  set description = excluded.description,
      order_index  = excluded.order_index;

-- ──────────────────────────────────────────
-- MODULE 5: PRODUCTION AGENTS
-- ──────────────────────────────────────────
insert into public.concepts (module_id, title, description, order_index, prerequisites, slug)
select m.id, c.title, c.description, c.order_index, c.prerequisites::jsonb, c.slug
from public.modules m,
(values
  ('Guardrails',
   'Input/output filters, content policies, and behavioral constraints that prevent agents from taking harmful or out-of-scope actions.',
   1, '[]', 'prod-guardrails'),
  ('Security',
   'Prompt injection defense, tool permission scoping, secret management, and preventing adversarial manipulation of agents.',
   2, '[]', 'prod-security'),
  ('Reliability',
   'Designing agents that degrade gracefully: retry logic, fallbacks, timeouts, circuit breakers, and idempotent tool calls.',
   3, '[]', 'prod-reliability'),
  ('Error Handling',
   'Strategies for detecting and recovering from tool failures, model errors, rate limits, and unexpected environment states.',
   4, '[]', 'prod-error-handling'),
  ('Tool Permissions',
   'Principle of least privilege applied to agents: granting only the tool access needed for a specific task and no more.',
   5, '[]', 'prod-tool-permissions'),
  ('Responsible Agent Design',
   'Ethical considerations: fairness, transparency, human oversight, auditability, and preventing unintended consequences.',
   6, '[]', 'prod-responsible-design')
) as c(title, description, order_index, prerequisites, slug)
where m.title = 'Production Agents'
on conflict (slug) do update
  set description = excluded.description,
      order_index  = excluded.order_index;

-- ──────────────────────────────────────────
-- MODULE 6: EVALUATION AND DEPLOYMENT
-- ──────────────────────────────────────────
insert into public.concepts (module_id, title, description, order_index, prerequisites, slug)
select m.id, c.title, c.description, c.order_index, c.prerequisites::jsonb, c.slug
from public.modules m,
(values
  ('Agent Evaluation',
   'Systematic assessment of agent performance: task completion, accuracy, efficiency, safety, and alignment with intended behavior.',
   1, '[]', 'eval-agent-evaluation'),
  ('Tracing and Observability',
   'Logging reasoning traces, tool calls, and intermediate states to understand, debug, and audit agent behavior post-hoc.',
   2, '[]', 'eval-tracing'),
  ('Performance Measurement',
   'Quantitative metrics: success rate, latency, token cost, error rate, and task-specific evaluation benchmarks.',
   3, '[]', 'eval-performance'),
  ('Monitoring',
   'Continuous production surveillance: drift detection, anomaly alerts, cost tracking, and SLA monitoring for deployed agents.',
   4, '[]', 'eval-monitoring'),
  ('Deployment Considerations',
   'Infrastructure choices, serverless vs persistent runtimes, scaling strategies, and environment configuration for production agents.',
   5, '[]', 'eval-deployment'),
  ('Production Readiness',
   'Checklists and processes for safely transitioning agents from development to production: testing, staging, rollout, and rollback.',
   6, '[]', 'eval-production-readiness')
) as c(title, description, order_index, prerequisites, slug)
where m.title = 'Evaluation and Deployment'
on conflict (slug) do update
  set description = excluded.description,
      order_index  = excluded.order_index;