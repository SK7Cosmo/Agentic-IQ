'use client';

import { use, Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  Shield,
  Activity,
  ArrowRight
} from 'lucide-react';

interface StudentProfile {
  name: string;
  email: string;
  mastery: number;
  status: 'Advanced' | 'On Track' | 'Needs Support';
  archetype: string;
  lastActive: string;
  conceptsCompleted: number;
  totalConcepts: number;
  cognitivePillars: { name: string; score: number }[];
  misconceptions: { concept: string; statement: string; severity: 'High' | 'Medium' | 'Low' }[];
  recentActivity: { type: 'assessment' | 'lesson' | 'drill'; description: string; date: string; score?: number }[];
}

const studentProfiles: Record<string, StudentProfile> = {
  'student-1': {
    name: 'Alex Rivera',
    email: 'student@agenticiq.demo',
    mastery: 68,
    status: 'On Track',
    archetype: 'Deliberate Builder',
    lastActive: '2 hours ago',
    conceptsCompleted: 12,
    totalConcepts: 24,
    cognitivePillars: [
      { name: 'Conceptual Foundations', score: 82 },
      { name: 'Implementation Fluency', score: 71 },
      { name: 'Failure & Self-Correction', score: 58 },
      { name: 'Trade-off Analysis', score: 64 },
      { name: 'Tool & Schema Design', score: 65 },
    ],
    misconceptions: [
      {
        concept: 'Agent Execution Loops',
        statement: 'A ReAct loop automatically halts when a tool throws a network exception without needing an explicit error catch observation.',
        severity: 'High',
      },
      {
        concept: 'Episodic Memory',
        statement: 'Appending the entire raw chat history into the active prompt is equivalent to long-term vector indexing.',
        severity: 'Medium',
      },
    ],
    recentActivity: [
      { type: 'assessment', description: 'Voice Diagnostic: ReAct Loop Self-Correction', date: '2 hours ago', score: 78 },
      { type: 'lesson', description: 'Studied: Context Windows & KV-Cache Allocation', date: '1 day ago' },
      { type: 'assessment', description: 'Reasoning Lab: Scaled Dot-Product Attention Matrices', date: '2 days ago', score: 64 },
      { type: 'drill', description: 'Cognitive Flash Drill: JSON Schema Validation Errors', date: '3 days ago', score: 85 },
    ],
  },
  'student-2': {
    name: 'Jordan Lee',
    email: 'jordan@agenticiq.demo',
    mastery: 84,
    status: 'Advanced',
    archetype: 'Rapid Explorer',
    lastActive: '1 day ago',
    conceptsCompleted: 19,
    totalConcepts: 24,
    cognitivePillars: [
      { name: 'Conceptual Foundations', score: 92 },
      { name: 'Implementation Fluency', score: 88 },
      { name: 'Failure & Self-Correction', score: 80 },
      { name: 'Trade-off Analysis', score: 79 },
      { name: 'Tool & Schema Design', score: 81 },
    ],
    misconceptions: [],
    recentActivity: [
      { type: 'lesson', description: 'Completed: Multi-Agent Orchestration & Blackboard Protocols', date: '1 day ago' },
      { type: 'assessment', description: 'Voice Diagnostic: Tree-of-Thought Rollout Backtracking', date: '3 days ago', score: 92 },
      { type: 'drill', description: 'Cognitive Flash Drill: MicroVM Sandbox Network Egress', date: '4 days ago', score: 95 },
    ],
  },
  'student-3': {
    name: 'Taylor Smith',
    email: 'taylor@agenticiq.demo',
    mastery: 52,
    status: 'Needs Support',
    archetype: 'Theoretical Thinker',
    lastActive: '3 days ago',
    conceptsCompleted: 8,
    totalConcepts: 24,
    cognitivePillars: [
      { name: 'Conceptual Foundations', score: 68 },
      { name: 'Implementation Fluency', score: 45 },
      { name: 'Failure & Self-Correction', score: 40 },
      { name: 'Trade-off Analysis', score: 55 },
      { name: 'Tool & Schema Design', score: 52 },
    ],
    misconceptions: [
      {
        concept: 'Tool Calling vs RAG',
        statement: 'RAG retrieval is fundamentally the same mechanism as executing an arbitrary tool call in an autonomous loop.',
        severity: 'High',
      },
      {
        concept: 'Self-Attention',
        statement: 'Attention projection matrices are computed once per document rather than per token sequence.',
        severity: 'High',
      },
      {
        concept: 'Context Windows',
        statement: 'LLMs automatically retain memories from past sessions without persistent database storage.',
        severity: 'Medium',
      },
    ],
    recentActivity: [
      { type: 'assessment', description: 'Voice Diagnostic: Tool Schema Argument Validation', date: '3 days ago', score: 45 },
      { type: 'lesson', description: 'Studied: Prompt Injection Defenses & Reader Models', date: '4 days ago' },
    ],
  },
};

function StudentDetail({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const student = studentProfiles[studentId] || studentProfiles['student-1'];

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb Nav */}
      <div>
        <Link
          href="/teacher/students"
          className="inline-flex items-center gap-2 text-text-muted hover:text-deep-ink font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-electric-indigo" />
          <span>Back to Student Intelligence Roster</span>
        </Link>
      </div>

      {/* Student Studio Header Card */}
      <div className="studio-card rounded-3xl p-8 bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border-color pb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-electric-indigo/10 border border-electric-indigo/20 flex items-center justify-center text-electric-indigo text-2xl font-black font-mono shadow-2xs">
              {initials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-deep-ink tracking-tight font-editorial">
                  {student.name}
                </h1>
                <span
                  className={`studio-pill text-[9px] font-bold ${
                    student.status === 'Advanced'
                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                      : student.status === 'Needs Support'
                      ? 'bg-coral/10 text-coral border border-coral/20'
                      : 'bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20'
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-text-muted font-mono">{student.email}</p>
              <div className="flex items-center gap-2 text-xs text-text-muted pt-0.5">
                <span className="font-semibold text-deep-ink">Cognitive Archetype:</span>
                <span className="studio-pill bg-soft-neutral border border-border-color text-text-muted text-[10px]">
                  {student.archetype}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-border-color">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Last Active</span>
            <span className="text-xs font-mono font-bold text-deep-ink flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              {student.lastActive}
            </span>
          </div>
        </div>

        {/* 4 Metric Callout Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-soft-neutral/50 border border-border-color space-y-1">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Overall Mastery</div>
            <div className="text-2xl font-black text-deep-ink font-mono">{student.mastery}%</div>
            <div className="w-full bg-border-color rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className={`h-full rounded-full ${
                  student.mastery >= 80
                    ? 'bg-emerald-600'
                    : student.mastery >= 60
                    ? 'bg-electric-indigo'
                    : 'bg-coral'
                }`}
                style={{ width: `${student.mastery}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-soft-neutral/50 border border-border-color space-y-1">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Atlas Concepts</div>
            <div className="text-2xl font-black text-deep-ink font-mono">
              {student.conceptsCompleted}
              <span className="text-xs text-text-muted font-normal font-sans"> / {student.totalConcepts}</span>
            </div>
            <p className="text-[10px] text-text-muted">Across 6 Stages</p>
          </div>

          <div className="p-4 rounded-2xl bg-soft-neutral/50 border border-border-color space-y-1">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Misconceptions</div>
            <div
              className={`text-2xl font-black font-mono ${
                student.misconceptions.length > 0 ? 'text-coral' : 'text-emerald-700'
              }`}
            >
              {student.misconceptions.length}
            </div>
            <p className="text-[10px] text-text-muted">
              {student.misconceptions.length > 0 ? 'Action required' : 'Fully calibrated'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-soft-neutral/50 border border-border-color space-y-1">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Reasoning Drills</div>
            <div className="text-2xl font-black text-deep-ink font-mono">
              {student.recentActivity.filter((a) => a.type === 'assessment' || a.type === 'drill').length}
            </div>
            <p className="text-[10px] text-text-muted">Voice submissions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cognitive Pillar Calibration Breakdown */}
        <div className="studio-card rounded-3xl p-7 bg-white space-y-5">
          <div className="flex items-center justify-between border-b border-border-color pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-electric-indigo" />
              <h3 className="font-bold text-deep-ink text-sm">Mastery Fingerprint Breakdown</h3>
            </div>
            <span className="text-[10px] font-mono text-text-muted">5 Pillars</span>
          </div>

          <div className="space-y-4">
            {student.cognitivePillars.map((pillar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-deep-ink">{pillar.name}</span>
                  <span className="font-mono font-bold text-deep-ink">{pillar.score}%</span>
                </div>
                <div className="w-full bg-soft-neutral rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pillar.score >= 80
                        ? 'bg-emerald-600'
                        : pillar.score >= 60
                        ? 'bg-electric-indigo'
                        : 'bg-coral'
                    }`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detected Misconceptions Card */}
        <div className="studio-card rounded-3xl p-7 bg-white space-y-5">
          <div className="flex items-center justify-between border-b border-border-color pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-coral" />
              <h3 className="font-bold text-deep-ink text-sm">Diagnosed Fallacies & Misconceptions</h3>
            </div>
            <span className="studio-pill bg-coral/10 text-coral border border-coral/20 text-[9px]">
              {student.misconceptions.length} Flagged
            </span>
          </div>

          {student.misconceptions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-800 text-sm">Optimal Mental Models</h4>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                No recurring architectural misconceptions detected across recent voice diagnostics.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {student.misconceptions.map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider">
                      {m.concept}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20">
                      {m.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-deep-ink leading-relaxed italic">
                    &ldquo;{m.statement}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="studio-card rounded-3xl p-7 bg-white space-y-5">
        <div className="flex items-center justify-between border-b border-border-color pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-electric-indigo" />
            <h3 className="font-bold text-deep-ink text-sm">Recent Reasoning Trajectory</h3>
          </div>
          <span className="text-xs text-text-muted">Chronological audit log</span>
        </div>

        <div className="space-y-3">
          {student.recentActivity.map((act, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-soft-neutral/40 border border-border-color flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    act.type === 'assessment'
                      ? 'bg-electric-indigo'
                      : act.type === 'drill'
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-deep-ink">{act.description}</p>
                  <p className="text-[10px] text-text-muted flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{act.date}</span>
                  </p>
                </div>
              </div>

              {act.score !== undefined && (
                <div className="flex items-center gap-2 sm:self-center self-start pl-5 sm:pl-0">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Score</span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-border-color text-deep-ink">
                    {act.score}/100
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10 text-xs text-text-muted">Loading learner cognitive audit...</div>}>
      <StudentDetail params={params} />
    </Suspense>
  );
}
