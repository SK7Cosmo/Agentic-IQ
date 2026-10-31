'use client';

import { use, Suspense } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  Layers,
  BookOpen,
  Compass
} from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  description: string;
  status: 'mastered' | 'proficient' | 'developing' | 'locked';
  lessonsCount: number;
  timeMins: number;
}

interface ModuleData {
  id: string;
  stageNumber: string;
  title: string;
  stage: string;
  description: string;
  totalMins: number;
  concepts: Concept[];
}

export const ATLAS_STAGES = [
  { id: 'module-1', stage: '01', title: 'LLM Foundations', totalTime: '70m' },
  { id: 'module-2', stage: '02', title: 'Agent Fundamentals', totalTime: '85m' },
  { id: 'module-3', stage: '03', title: 'Agent Architecture', totalTime: '90m' },
  { id: 'module-4', stage: '04', title: 'Agent Orchestration', totalTime: '80m' },
  { id: 'module-5', stage: '05', title: 'Production Agents', totalTime: '95m' },
  { id: 'module-6', stage: '06', title: 'Evaluation & Benchmarks', totalTime: '75m' },
];

export const ALL_MODULES_DATA: Record<string, ModuleData> = {
  'module-1': {
    id: 'module-1',
    stageNumber: '01',
    title: 'LLM Foundations',
    stage: 'Stage 01 of 06 · Core Physics',
    description:
      'Understand the underlying physics of Large Language Models: token boundary mechanics, high-dimensional vector embeddings, attention matrices, and context window limits.',
    totalMins: 70,
    concepts: [
      {
        id: 'c1',
        title: 'Tokens and Embeddings',
        description: 'How byte sequences map to high-dimensional semantic vector spaces.',
        status: 'mastered',
        lessonsCount: 3,
        timeMins: 15,
      },
      {
        id: 'c2',
        title: 'Context Windows & KV-Cache',
        description: 'KV-cache allocation, sequence boundaries, and retrieval degradation.',
        status: 'proficient',
        lessonsCount: 2,
        timeMins: 10,
      },
      {
        id: 'c3',
        title: 'Attention Mechanism',
        description: 'Scaled dot-product attention, Queries, Keys, Values, and multi-head routing.',
        status: 'developing',
        lessonsCount: 4,
        timeMins: 25,
      },
      {
        id: 'c4',
        title: 'Hallucinations & Grounding',
        description: 'Why token prediction defaults to fabrication under uncertainty and how to ground it.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
    ],
  },
  'module-2': {
    id: 'module-2',
    stageNumber: '02',
    title: 'Agent Fundamentals',
    stage: 'Stage 02 of 06 · The Autonomous Loop',
    description:
      'Transition from passive text prediction to autonomous execution. Master the ReAct framework, structured tool-calling schemas, plan-and-solve decompositions, and environment halting criteria.',
    totalMins: 85,
    concepts: [
      {
        id: 'c5',
        title: 'The ReAct Loop',
        description: 'Thought, Action, and Observation cycles: interleaving reasoning traces with action execution.',
        status: 'proficient',
        lessonsCount: 4,
        timeMins: 25,
      },
      {
        id: 'c6',
        title: 'Tool Calling & JSON Schemas',
        description: 'Defining strict parameter contracts, parsing tool invocation arguments, and handling schema validation failures.',
        status: 'proficient',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c7',
        title: 'Plan-and-Solve Strategies',
        description: 'Separating high-level task decomposition from low-level execution to prevent reasoning drift.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c8',
        title: 'Environment Feedback & Halting',
        description: 'Defining explicit terminal states, max-step thresholds, and detecting repetitive looping behaviors.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
    ],
  },
  'module-3': {
    id: 'module-3',
    stageNumber: '03',
    title: 'Agent Architecture & Memory',
    stage: 'Stage 03 of 06 · Cognitive Structures',
    description:
      'Engineer persistent cognitive structures. Compare short-term working buffers with episodic vector stores, self-reflection feedback loops, and Tree-of-Thought heuristics.',
    totalMins: 90,
    concepts: [
      {
        id: 'c9',
        title: 'Working vs Episodic Memory',
        description: 'Scratchpads, sliding conversation buffers, and long-term vector-indexed semantic recall.',
        status: 'developing',
        lessonsCount: 4,
        timeMins: 25,
      },
      {
        id: 'c10',
        title: 'Vector RAG & Dynamic Indexing',
        description: 'Embedding generation, hybrid keyword-vector search, chunking boundaries, and reranking.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c11',
        title: 'Self-Reflection & Critique Loops',
        description: 'Reflexion patterns: evaluating intermediate trajectories, diagnosing errors, and updating mental priors.',
        status: 'proficient',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c12',
        title: 'Tree-of-Thought & Rollouts',
        description: 'Branching exploration of multiple reasoning paths with heuristic evaluation and backtracking.',
        status: 'developing',
        lessonsCount: 4,
        timeMins: 25,
      },
    ],
  },
  'module-4': {
    id: 'module-4',
    stageNumber: '04',
    title: 'Agent Orchestration',
    stage: 'Stage 04 of 06 · Multi-Agent Systems',
    description:
      'Coordinate swarms and hierarchies of specialized agents. Implement supervisor-worker topologies, structured hand-offs, adversarial debate, and deadlock resolution.',
    totalMins: 80,
    concepts: [
      {
        id: 'c13',
        title: 'Hierarchical Supervisors',
        description: 'Orchestrator-worker patterns: delegating subgoals to specialized agents and synthesizing final results.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c14',
        title: 'Peer-to-Peer Communication',
        description: 'Direct agent hand-offs, blackboard state sharing, and standardized message protocols.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c15',
        title: 'Consensus & Adversarial Debate',
        description: 'Multi-agent voting, peer verification, and red-team critique to eliminate individual model hallucinations.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c16',
        title: 'Deadlock & Loop Prevention',
        description: 'Detecting infinite ping-pong hand-offs, priority queues, and deterministic arbitration.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
    ],
  },
  'module-5': {
    id: 'module-5',
    stageNumber: '05',
    title: 'Production Engineering & Safety',
    stage: 'Stage 05 of 06 · Reliability & Guardrails',
    description:
      'Deploy autonomous agents safely into the wild. Design hardened execution sandboxes, rate-limit resilience, prompt-injection firewalls, and human-in-the-loop checkpoints.',
    totalMins: 95,
    concepts: [
      {
        id: 'c17',
        title: 'Sandboxed Code Execution',
        description: 'Ephemeral micro-VMs, Docker containers, network isolation, and preventing unauthorized host access.',
        status: 'developing',
        lessonsCount: 4,
        timeMins: 25,
      },
      {
        id: 'c18',
        title: 'Rate Limits & Exponential Backoff',
        description: 'Managing provider quotas, jittered retry strategies, and automatic fallback LLM routing.',
        status: 'proficient',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c19',
        title: 'Prompt Injection Defenses',
        description: 'Indirect prompt injection via tools, instruction sanitization, and dual-LLM security gates.',
        status: 'developing',
        lessonsCount: 4,
        timeMins: 25,
      },
      {
        id: 'c20',
        title: 'Human-in-the-Loop Checkpoints',
        description: 'Approval gates for irreversible actions (financial transfers, database deletes, emails).',
        status: 'proficient',
        lessonsCount: 3,
        timeMins: 25,
      },
    ],
  },
  'module-6': {
    id: 'module-6',
    stageNumber: '06',
    title: 'Evaluation & Benchmarks',
    stage: 'Stage 06 of 06 · Measurement & Observability',
    description:
      'Quantify agent intelligence and reliability. Trace multi-step trajectories with OpenTelemetry, run standardized benchmarks (SWE-bench, GAIA), calibrate LLM judges, and balance token budgets.',
    totalMins: 75,
    concepts: [
      {
        id: 'c21',
        title: 'Trajectory Tracing & Spans',
        description: 'Instrumenting nested agent steps, tool calls, and LLM completions with OpenTelemetry trace trees.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c22',
        title: 'Agent Benchmark Suites',
        description: 'Evaluating on SWE-bench, GAIA, and HumanEval: pass@k metrics, test harnesses, and repeatable evaluations.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c23',
        title: 'LLM-as-a-Judge Calibration',
        description: 'Using stronger models to evaluate complex trajectories: position bias mitigation and rubric design.',
        status: 'developing',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c24',
        title: 'Token & Cost Optimization',
        description: 'Prompt compression, semantic caching, model tiering (fast vs reasoning models), and latency reduction.',
        status: 'mastered',
        lessonsCount: 3,
        timeMins: 15,
      },
    ],
  },
};

function ModuleContent({ params }: { params: Promise<{ moduleId: string }> }) {
  const resolvedParams = use(params);
  const rawModuleId = resolvedParams.moduleId || 'module-1';

  // Normalize moduleId: support 'module-1', 'mod-1', or '1'
  const normalizedId = rawModuleId.startsWith('mod-')
    ? rawModuleId.replace('mod-', 'module-')
    : rawModuleId === '1'
    ? 'module-1'
    : rawModuleId === '2'
    ? 'module-2'
    : rawModuleId === '3'
    ? 'module-3'
    : rawModuleId === '4'
    ? 'module-4'
    : rawModuleId === '5'
    ? 'module-5'
    : rawModuleId === '6'
    ? 'module-6'
    : rawModuleId;

  const moduleData: ModuleData = ALL_MODULES_DATA[normalizedId] || ALL_MODULES_DATA['module-1'];

  const getStatusBadge = (status: Concept['status']) => {
    switch (status) {
      case 'mastered':
        return { label: 'Mastered', style: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/20' };
      case 'proficient':
        return { label: 'Proficient', style: 'text-electric-indigo bg-electric-indigo/10 border-electric-indigo/20' };
      case 'developing':
        return { label: 'Developing', style: 'text-amber-800 bg-amber-500/10 border-amber-500/20' };
      case 'locked':
        return { label: 'Prereq Locked', style: 'text-text-muted bg-soft-neutral border-border-color' };
    }
  };

  const masteredCount = moduleData.concepts.filter((c) => c.status === 'mastered').length;
  const inProgressCount = moduleData.concepts.filter((c) => c.status === 'proficient' || c.status === 'developing').length;
  const lockedCount = moduleData.concepts.filter((c) => c.status === 'locked').length;

  return (
    <div className="space-y-10 pb-16">
      {/* Atlas Journey Ribbon (All 6 Stages) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-electric-indigo" />
            The Learning Atlas · 6 Interconnected Stages
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Click any stage to inspect
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {ATLAS_STAGES.map((stg) => {
            const isCurrent = stg.id === normalizedId;
            return (
              <Link
                key={stg.id}
                href={`/curriculum/${stg.id}`}
                className={`p-3 rounded-2xl border text-xs transition-all relative overflow-hidden group ${
                  isCurrent
                    ? 'bg-electric-indigo text-white border-electric-indigo shadow-md ring-2 ring-electric-indigo/20 font-bold'
                    : 'bg-white border-border-color text-text-muted hover:text-deep-ink hover:bg-soft-neutral/50 hover:border-electric-indigo/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[9px] uppercase tracking-wider font-bold ${
                    isCurrent ? 'text-white/80' : 'text-text-muted'
                  }`}>
                    STAGE {stg.stage}
                  </span>
                  <span className={`text-[9px] font-medium ${
                    isCurrent ? 'text-white/70' : 'text-text-muted'
                  }`}>
                    {stg.totalTime}
                  </span>
                </div>
                <div className={`truncate font-semibold text-xs ${
                  isCurrent ? 'text-white' : 'text-deep-ink group-hover:text-electric-indigo'
                }`}>
                  {stg.title}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Module Overview Banner */}
      <div className="studio-card rounded-3xl p-8 md:p-10 bg-white space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[10px] font-bold">
            {moduleData.stage}
          </span>
          <span className="text-xs text-text-muted">
            {moduleData.concepts.length} Concepts · {moduleData.totalMins} Mins Total
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-deep-ink tracking-tight font-editorial">
          {moduleData.title}
        </h1>
        <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
          {moduleData.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{masteredCount} Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-electric-indigo" />
            <span>{inProgressCount} In Progress</span>
          </div>
          {lockedCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-text-muted" />
              <span>{lockedCount} Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* Concepts Grid for this stage */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-deep-ink font-editorial">
            Curriculum Concepts in Stage {moduleData.stageNumber}
          </h2>
          <span className="text-xs text-text-muted font-medium">
            Select a concept to enter deep study
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moduleData.concepts.map((concept) => {
            const isLocked = concept.status === 'locked';
            const badge = getStatusBadge(concept.status);

            return (
              <div
                key={concept.id}
                className={`studio-card rounded-2xl p-7 flex flex-col justify-between transition-all ${
                  isLocked ? 'opacity-60 bg-soft-neutral/30' : 'bg-white hover:border-electric-indigo/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`studio-pill ${badge.style} border text-[9px]`}>
                      {badge.label}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-text-muted font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{concept.timeMins} mins</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-deep-ink">{concept.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border-color flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">
                    {concept.lessonsCount} lessons
                  </span>

                  {isLocked ? (
                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Prereqs required
                    </span>
                  ) : (
                    <Link
                      href={`/curriculum/${moduleData.id}/${concept.id}`}
                      className="px-4 py-2 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                    >
                      <span>Study Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  return (
    <Suspense fallback={<div className="p-10 text-xs text-text-muted">Loading Learning Atlas stage...</div>}>
      <ModuleContent params={params} />
    </Suspense>
  );
}
