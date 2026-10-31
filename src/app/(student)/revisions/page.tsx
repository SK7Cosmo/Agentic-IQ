'use client';

import Link from 'next/link';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';

const misconceptions = [
  {
    id: '1',
    concept: 'AI Agents',
    statement: 'An AI agent is simply an LLM with access to the internet.',
    correction:
      'Tool access alone does not make a system an agent. Agentic behavior also requires goal-directed decision making, internal state maintenance, and context-based action selection loops.',
    detectedAt: '2 days ago',
    reviewStatus: 'pending',
    assessmentLink: '/assessment/diagnostic',
  },
  {
    id: '2',
    concept: 'Context Windows',
    statement: 'Once text is in the context window, the model remembers it forever across sessions.',
    correction:
      'Context windows represent ephemeral forward-pass memory with a hard token boundary. Information outside that bound is dropped. Long conversations require episodic vector stores or summary rollups.',
    detectedAt: '5 days ago',
    reviewStatus: 'pending',
    assessmentLink: '/assessment/diagnostic',
  },
  {
    id: '3',
    concept: 'Attention Heads',
    statement: 'Self-attention calculates token similarity sequentially one word at a time.',
    correction:
      'Self-attention operates across all token combinations in parallel using Query-Key matrix multiplication, scaling, and softmax normalization.',
    detectedAt: '1 week ago',
    reviewStatus: 'resolved',
    assessmentLink: '/assessment/diagnostic',
  },
];

export default function RevisionsPage() {
  const pending = misconceptions.filter((m) => m.reviewStatus === 'pending');
  const resolved = misconceptions.filter((m) => m.reviewStatus === 'resolved');

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[9px]">
              Spaced Repetition
            </span>
            <span className="text-xs font-mono font-bold text-text-muted">MEMORY DECAY REMEDIATION</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-deep-ink tracking-tight mt-1">
            Cognitive Revision Queue
          </h1>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Address detected misconceptions before they solidify in production workflows. Spaced recall drills cement verified mental models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/assessment/diagnostic"
            className="px-5 py-2.5 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Launch Quick Drill</span>
          </Link>
        </div>
      </div>

      {/* Queue Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="studio-card rounded-2xl p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Remediation</span>
            <AlertTriangle className="w-4 h-4 text-coral" />
          </div>
          <div className="text-3xl font-black text-coral font-mono">{pending.length}</div>
          <p className="text-[11px] text-text-muted">Misconceptions awaiting verbal verification</p>
        </div>

        <div className="studio-card rounded-2xl p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Remediated & Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">{resolved.length}</div>
          <p className="text-[11px] text-text-muted">Mental models successfully calibrated</p>
        </div>
      </div>

      {/* Pending Drills Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-deep-ink flex items-center gap-2">
          <span>Active Cognitive Drills</span>
          <span className="studio-pill bg-coral/10 text-coral border border-coral/20 text-[9px]">
            {pending.length} Due
          </span>
        </h2>

        <div className="space-y-4">
          {pending.map((m) => (
            <div
              key={m.id}
              className="studio-card-elevated rounded-2xl p-6 md:p-8 bg-white space-y-4 border-l-4 border-l-coral"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-electric-indigo uppercase">
                  Concept: {m.concept}
                </span>
                <span className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> Flagged {m.detectedAt}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-coral/5 border border-coral/15 space-y-1">
                <span className="text-[10px] font-bold uppercase text-coral">Flawed Assumption:</span>
                <p className="text-xs md:text-sm font-semibold text-deep-ink">&ldquo;{m.statement}&rdquo;</p>
              </div>

              <div className="p-4 rounded-xl bg-soft-neutral/60 border border-border-color space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-700">Correct Scientific Model:</span>
                <p className="text-xs md:text-sm text-charcoal leading-relaxed">{m.correction}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href={m.assessmentLink}
                  className="px-5 py-2.5 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Re-test in Reasoning Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolved Concepts */}
      {resolved.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border-color">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">
            Calibrated Concepts ({resolved.length})
          </h2>
          <div className="space-y-3">
            {resolved.map((m) => (
              <div
                key={m.id}
                className="studio-card rounded-xl p-5 bg-white flex items-center justify-between opacity-80"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-deep-ink">{m.concept}</h4>
                    <p className="text-[11px] text-text-muted line-clamp-1">{m.correction}</p>
                  </div>
                </div>
                <span className="studio-pill bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px] shrink-0">
                  Calibrated
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
