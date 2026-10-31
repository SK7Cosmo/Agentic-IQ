'use client';

import { Suspense, use } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  Layers,
  ArrowRight,
  Award,
  Sparkles,
  Bot
} from 'lucide-react';
import Link from 'next/link';

interface Concept {
  id: string;
  title: string;
  description: string;
  status: 'mastered' | 'proficient' | 'developing' | 'locked';
  lessonsCount: number;
  timeMins: number;
}

interface ModuleData {
  title: string;
  stage: string;
  description: string;
  concepts: Concept[];
}

const ATLAS_STAGES = [
  { id: 'module-1', stage: '01', title: 'LLM Foundations' },
  { id: 'module-2', stage: '02', title: 'Agent Fundamentals' },
  { id: 'module-3', stage: '03', title: 'Agent Architecture' },
  { id: 'module-4', stage: '04', title: 'Agent Orchestration' },
  { id: 'module-5', stage: '05', title: 'Production Agents' },
  { id: 'module-6', stage: '06', title: 'Evaluation & Benchmarks' },
];

function ModuleContent({ params }: { params: Promise<{ moduleId: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.moduleId;

  const moduleData: ModuleData = {
    title: 'LLM Foundations',
    stage: 'Stage 01 of 06',
    description: 'Understand the underlying physics of Large Language Models: token boundary mechanics, high-dimensional vector embeddings, attention matrices, and context window limits.',
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
        title: 'Context Windows',
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
        status: 'locked',
        lessonsCount: 3,
        timeMins: 20,
      },
    ],
  };

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

  return (
    <div className="space-y-10 pb-16">
      {/* Atlas Journey Ribbon */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          The Learning Atlas · 6 Interconnected Stages
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {ATLAS_STAGES.map((stg) => {
            const isCurrent = stg.id === moduleId;
            return (
              <Link
                key={stg.id}
                href={`/curriculum/${stg.id}`}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-electric-indigo/10 border-electric-indigo text-deep-ink font-bold shadow-2xs'
                    : 'bg-white border-border-color text-text-muted hover:text-deep-ink hover:bg-soft-neutral/50'
                }`}
              >
                <div className="font-mono text-[9px] text-text-muted">STAGE {stg.stage}</div>
                <div className="truncate">{stg.title}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Module Overview Banner */}
      <div className="studio-card rounded-3xl p-8 md:p-10 bg-white space-y-4">
        <div className="flex items-center gap-2">
          <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[9px]">
            {moduleData.stage}
          </span>
          <span className="text-xs text-text-muted">4 Concepts · 70 Mins Total</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-deep-ink tracking-tight">
          {moduleData.title}
        </h1>
        <p className="text-sm text-text-muted leading-relaxed max-w-3xl">
          {moduleData.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>1 Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-electric-indigo" />
            <span>2 In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-text-muted" />
            <span>1 Locked</span>
          </div>
        </div>
      </div>

      {/* Concepts Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-deep-ink">Curriculum Concepts</h2>
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
                      href={`/curriculum/${moduleId}/${concept.id}`}
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
