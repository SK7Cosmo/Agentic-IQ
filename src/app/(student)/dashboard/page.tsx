'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import {
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Award,
  Bot,
  Play,
  RotateCcw,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  Activity,
  ShieldAlert
} from 'lucide-react';

interface ModuleScore {
  name: string;
  code: string;
  score: number; // 0-100
  level: string;
}

const MODULE_SCORES: ModuleScore[] = [
  { name: 'LLM Foundations', code: 'M1', score: 86, level: 'Mastered' },
  { name: 'Agent Fundamentals', code: 'M2', score: 72, level: 'Proficient' },
  { name: 'Agent Architecture', code: 'M3', score: 65, level: 'Developing' },
  { name: 'Agent Orchestration', code: 'M4', score: 54, level: 'Developing' },
  { name: 'Production Agents', code: 'M5', score: 48, level: 'Beginner' },
  { name: 'Evaluation & Benchmarks', code: 'M6', score: 42, level: 'Beginner' },
];

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState('Alex');
  const [activeModuleHover, setActiveModuleHover] = useState<ModuleScore | null>(null);

  useEffect(() => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
              if (data?.full_name) {
                setStudentName(data.full_name.split(' ')[0] || data.full_name);
              }
            });
        }
      });
    } catch {
      // Fallback
    }
  }, []);

  const overallMastery = Math.round(
    MODULE_SCORES.reduce((acc, m) => acc + m.score, 0) / MODULE_SCORES.length
  );

  // SVG Radar computation for Mastery Fingerprint
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const totalAxes = MODULE_SCORES.length;

  const getCoordinates = (index: number, valuePercent: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (radius * valuePercent) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = MODULE_SCORES.map((m, i) => {
    const { x, y } = getCoordinates(i, m.score);
    return `${x},${y}`;
  }).join(' ');

  const ringLevels = [25, 50, 75, 100];

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border-color pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Cognitive Studio</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-deep-ink tracking-tight">
            Learning Command Center
          </h1>
          <p className="text-sm text-text-muted">
            Welcome back, <span className="font-bold text-deep-ink">{studentName}</span>. Your reasoning model is currently calibrated at{' '}
            <span className="font-bold text-electric-indigo">{overallMastery}% aggregate mastery</span> across 6 core modules.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/assessment/diagnostic"
            className="px-5 py-3 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Launch Reasoning Studio</span>
          </Link>
          <Link
            href="/roadmap"
            className="px-5 py-3 rounded-xl bg-white hover:bg-soft-neutral text-deep-ink text-xs font-bold transition-all border border-border-color shadow-2xs flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-electric-indigo" />
            <span>Concept Constellation</span>
          </Link>
        </div>
      </div>

      {/* Primary Row: The Mastery Fingerprint & Priority Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Signature Visualization: The Mastery Fingerprint */}
        <div className="lg:col-span-7 studio-card rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border-color pb-4">
            <div>
              <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[9px]">
                Signature Assessment
              </span>
              <h2 className="text-xl font-bold text-deep-ink mt-1">The Mastery Fingerprint</h2>
              <p className="text-xs text-text-muted">
                Multi-axial reasoning depth map across Agentic AI domains
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-text-muted block">Overall</span>
              <span className="text-3xl font-black text-electric-indigo font-mono">
                {overallMastery}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG Radar */}
            <div className="md:col-span-7 flex justify-center py-2">
              <svg width={size} height={size} className="overflow-visible">
                {/* Background Concentric Rings */}
                {ringLevels.map((lvl) => (
                  <circle
                    key={lvl}
                    cx={center}
                    cy={center}
                    r={(radius * lvl) / 100}
                    fill="none"
                    stroke="#e6e0d4"
                    strokeDasharray={lvl === 100 ? 'none' : '3,3'}
                    strokeWidth="1"
                  />
                ))}

                {/* Axes */}
                {MODULE_SCORES.map((_, i) => {
                  const { x, y } = getCoordinates(i, 100);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="#e6e0d4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Filled Radar Polygon */}
                <polygon
                  points={polygonPoints}
                  fill="rgba(79, 70, 229, 0.18)"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />

                {/* Interactive Vertex Nodes */}
                {MODULE_SCORES.map((m, i) => {
                  const { x, y } = getCoordinates(i, m.score);
                  const isHovered = activeModuleHover?.code === m.code;
                  return (
                    <g
                      key={m.code}
                      onMouseEnter={() => setActiveModuleHover(m)}
                      onMouseLeave={() => setActiveModuleHover(null)}
                      className="cursor-pointer transition-transform"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 7 : 5}
                        fill={isHovered ? '#4f46e5' : '#ffffff'}
                        stroke="#4f46e5"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Dimension Breakdown List */}
            <div className="md:col-span-5 space-y-2.5">
              {MODULE_SCORES.map((mod) => (
                <div
                  key={mod.code}
                  onMouseEnter={() => setActiveModuleHover(mod)}
                  onMouseLeave={() => setActiveModuleHover(null)}
                  className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    activeModuleHover?.code === mod.code
                      ? 'bg-electric-indigo/5 border-electric-indigo/30'
                      : 'bg-soft-neutral/50 border-border-color hover:border-border-color/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-deep-ink">{mod.name}</span>
                    <span className="font-mono font-bold text-electric-indigo">{mod.score}%</span>
                  </div>
                  <div className="w-full bg-border-color h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-electric-indigo h-full rounded-full transition-all duration-500"
                      style={{ width: `${mod.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Recommended Action & Cognitive Calibration */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recommended Next Step Card */}
          <div className="studio-card-elevated rounded-3xl p-7 bg-white relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between">
              <span className="studio-pill bg-amber-500/10 text-amber-800 border border-amber-500/20">
                Recommended Drill
              </span>
              <span className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> 8 min reasoning
              </span>
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-electric-indigo uppercase">
                Stage 02 · Agent Fundamentals
              </span>
              <h3 className="text-xl font-bold text-deep-ink mt-1">
                Tool Autonomy vs Passive API Calls
              </h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                Explain the difference between a function execution and an agent loop that dynamically determines its own next action sequence based on tool observations.
              </p>
            </div>

            <Link
              href="/assessment/diagnostic"
              className="w-full py-3.5 px-4 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Voice Assessment</span>
            </Link>
          </div>

          {/* Quick Revision Queue Status */}
          <div className="studio-card rounded-3xl p-6 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-electric-indigo" />
                <h4 className="font-bold text-sm text-deep-ink">Spaced Repetition Due</h4>
              </div>
              <span className="studio-pill bg-soft-neutral text-deep-ink border border-border-color">
                2 Concepts Due
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Your memory decay threshold for <strong className="text-deep-ink">Attention Mechanism</strong> and <strong className="text-deep-ink">ReAct Planning</strong> is expiring today.
            </p>
            <Link
              href="/revisions"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-electric-indigo hover:underline pt-1"
            >
              <span>Review spaced queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Row: Misconceptions Detected vs Confirmed Mental Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Misconception Alert Radar */}
        <div className="studio-card rounded-3xl p-7 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-border-color pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-deep-ink text-sm">Misconception Radar</h3>
                <p className="text-[11px] text-text-muted">Detected flawed assumptions flagged for correction</p>
              </div>
            </div>
            <span className="studio-pill bg-coral/10 text-coral border border-coral/20 text-[9px]">
              Attention Needed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-coral/5 border border-coral/15 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-coral">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>AI Agent ≠ LLM + Search Tools</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-deep-ink">Common Flaw:</strong> Assuming that adding an API call to an LLM creates an agent.
            </p>
            <div className="text-xs bg-white/80 p-3 rounded-xl border border-coral/10 text-deep-ink">
              <span className="font-bold text-electric-indigo block mb-0.5">Correct Mental Model:</span>
              Agentic behavior requires goal-directed decision loops, state tracking, and autonomous self-correction based on environmental feedback.
            </div>
          </div>
        </div>

        {/* Solidified Concepts */}
        <div className="studio-card rounded-3xl p-7 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-border-color pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-deep-ink text-sm">Solidified Reasoning</h3>
                <p className="text-[11px] text-text-muted">Concepts verified with high confidence</p>
              </div>
            </div>
            <span className="studio-pill bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px]">
              Verified
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-soft-neutral/50 border border-border-color flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-deep-ink">Tokens & High-Dimensional Vectors</h4>
                <p className="text-[11px] text-text-muted">Embedding space geometry and cosine similarity</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700">92%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-soft-neutral/50 border border-border-color flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-deep-ink">Context Window Truncation</h4>
                <p className="text-[11px] text-text-muted">Attention limits vs external memory stores</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700">88%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
