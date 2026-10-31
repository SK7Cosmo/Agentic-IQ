'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  HelpCircle,
  Clock,
  LayoutGrid
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
  title: string;
  description: string;
  concepts: Concept[];
}

export default function ModuleContent({ params }: { params: Promise<{ moduleId: string }> }) {
  const moduleId = React.use(params).moduleId;
  const pathname = usePathname();

  // Mock curriculum data for the module
  const moduleData: ModuleData = {
    title: 'LLM Foundations',
    description: 'Understand how large language models work under the hood: tokens, context windows, embeddings, and the limits of model behaviour.',
    concepts: [
      {
        id: 'c1',
        title: 'Tokens and Embeddings',
        description: 'How text is represented as vectors.',
        status: 'mastered',
        lessonsCount: 3,
        timeMins: 15,
      },
      {
        id: 'c2',
        title: 'Context Windows',
        description: 'Sequence limits and memory constraints.',
        status: 'proficient',
        lessonsCount: 2,
        timeMins: 10,
      },
      {
        id: 'c3',
        title: 'Attention Mechanism',
        description: 'How models focus on relevant data.',
        status: 'developing',
        lessonsCount: 4,
        timeMins: 25,
      },
      {
        id: 'c4',
        title: 'Prompt Engineering',
        description: 'Techniques for guided model output.',
        status: 'locked',
        lessonsCount: 3,
        timeMins: 20,
      },
      {
        id: 'c5',
        title: 'Limitations & Hallucinations',
        description: 'Reliability and error detection.',
        status: 'locked',
        lessonsCount: 2,
        timeMins: 15,
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
      case 'proficient': return 'text-electric-indigo bg-electric-indigo/10 border-electric-indigo/20';
      case 'developing': return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      default: return 'text-text-muted bg-soft-neutral border-border-color';
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Module Header */}
      <div className="border-b border-border-color pb-8">
        <div className="flex items-center gap-2 text-electric-indigo font-bold text-xs uppercase tracking-widest mb-3">
          <LayoutGrid className="w-3.5 h-3.5" />
          Module 1
        </div>
        <h1 className="text-4xl font-black text-deep-ink tracking-tight">{moduleData.title}</h1>
        <p className="text-charcoal max-w-2xl text-sm leading-relaxed mt-2">{moduleData.description}</p>
      </div>

      {/* Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {moduleData.concepts.map((concept, index) => (
          <div
            key={concept.id}
            className={`group p-8 rounded-3xl border transition-all ${
              concept.status === 'locked'
                ? 'bg-soft-neutral/50 border-border-color opacity-70'
                : 'bg-white border-border-color hover:border-electric-indigo/40 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(concept.status)}`}>
                {concept.status}
              </div>
              {concept.status === 'locked' ? (
                <Lock className="w-5 h-5 text-text-muted" />
              ) : concept.status === 'mastered' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <span className="text-xs font-bold text-text-muted">Step {index + 1}</span>
              )}
            </div>

            <h3 className="text-lg font-bold text-deep-ink group-hover:text-electric-indigo transition-colors mb-2">
              {concept.title}
            </h3>
            <p className="text-xs text-text-muted line-clamp-2">{concept.description}</p>

            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-text-muted text-[11px] font-bold">
                <BookOpen className="w-4 h-4 text-electric-indigo" />
                {concept.lessonsCount} Lessons
              </div>
              <div className="flex items-center gap-2 text-text-muted text-[11px] font-bold">
                <Clock className="w-4 h-4 text-electric-indigo" />
                {concept.timeMins} min
              </div>
            </div>

            {concept.status !== 'locked' && (
              <Link
                href={`/curriculum/${moduleId}/${concept.id}`}
                className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-soft-neutral hover:bg-electric-indigo hover:text-white text-deep-ink text-xs font-bold transition-all border border-border-color"
              >
                <PlayCircle className="w-4 h-4" />
                Continue Learning
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recommended for Module */}
      <div className="p-8 rounded-3xl bg-white border border-border-color flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-electric-indigo/5 text-electric-indigo flex items-center justify-center border border-electric-indigo/10">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-deep-ink text-sm">Need help with these concepts?</h4>
            <p className="text-xs text-text-muted mt-1">The AI Tutor is ready to explain Foundations topic.</p>
          </div>
        </div>
        <Link
          href="/tutor"
          className="px-6 py-3 rounded-2xl bg-electric-indigo hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
        >
          Open AI Tutor
        </Link>
      </div>
    </div>
  );
}
