'use client';

import Link from 'next/link';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Shield,
  BookOpen,
  Award,
  Bot,
  Compass,
  Mic,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Workflow,
  Network,
  Activity,
  Check
} from 'lucide-react';

const MODULES_ATLAS = [
  {
    step: '01',
    title: 'LLM Foundations',
    tag: 'Core Physics',
    desc: 'Tokens, high-dimensional embeddings, self-attention mechanics, and context boundaries.',
    concepts: 6,
    icon: Cpu,
  },
  {
    step: '02',
    title: 'Agent Fundamentals',
    tag: 'Reasoning Loops',
    desc: 'The ReAct cycle, tool usage protocols, grounding, and decision autonomy.',
    concepts: 6,
    icon: Brain,
  },
  {
    step: '03',
    title: 'Agent Architecture',
    tag: 'State & Memory',
    desc: 'Hierarchical vector memory, cyclical state graphs, reflection, and cognitive rollback.',
    concepts: 6,
    icon: Layers,
  },
  {
    step: '04',
    title: 'Agent Orchestration',
    tag: 'Multi-Agent',
    desc: 'Supervisor swarms, broadcast consensus, dynamic routing, and task decomposition.',
    concepts: 6,
    icon: Workflow,
  },
  {
    step: '05',
    title: 'Production Agents',
    tag: 'Reliability',
    desc: 'Self-healing, guardrails, tool execution sandboxes, and token budget governance.',
    concepts: 6,
    icon: Shield,
  },
  {
    step: '06',
    title: 'Evaluation & Benchmarks',
    tag: 'Verification',
    desc: 'Trajectory auditing, SWE-bench and GAIA analysis, and hallucination reduction.',
    concepts: 6,
    icon: Activity,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-ivory text-deep-ink flex flex-col justify-between selection:bg-electric-indigo/20 selection:text-electric-indigo">
      {/* Studio Header */}
      <header className="border-b border-border-color bg-warm-ivory/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-deep-ink">Agentic IQ</span>
                <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20">
                  Studio
                </span>
              </div>
              <span className="block text-[11px] text-text-muted font-medium">
                The Learning Intelligence Studio
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a href="#atlas" className="hover:text-deep-ink transition-colors">
              Learning Atlas
            </a>
            <a href="#reasoning" className="hover:text-deep-ink transition-colors">
              Reasoning Studio
            </a>
            <a href="#fingerprint" className="hover:text-deep-ink transition-colors">
              Mastery Fingerprint
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-deep-ink hover:bg-charcoal text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 group"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-soft-neutral border border-border-color text-deep-ink text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-electric-indigo animate-pulse" />
            <span>A Voice-First Cognitive Learning Platform</span>
            <span className="text-text-muted">·</span>
            <span className="text-electric-indigo font-bold">Groq AI Reasoning Engine</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-deep-ink leading-[1.08]">
              Learn. Reason. Master <br />
              <span className="font-editorial italic font-normal text-electric-indigo">
                Agentic Artificial Intelligence
              </span>
              .
            </h1>
            <p className="text-lg md:text-xl text-charcoal font-normal leading-relaxed max-w-2xl mx-auto pt-2">
              Step beyond memorizing syntax. Agentic IQ measures your conceptual reasoning through voice
              dialogue, diagnoses flawed mental models, and charts your trajectory toward autonomous AI mastery.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2.5 group"
            >
              <span>Explore Student Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/teacher/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-soft-neutral text-deep-ink font-bold text-sm transition-all border border-border-color shadow-2xs flex items-center justify-center gap-2.5"
            >
              <Shield className="w-4 h-4 text-electric-indigo" />
              <span>Teacher Intelligence Center</span>
            </Link>
          </div>

          {/* Live Studio Teaser Card */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="studio-card-elevated rounded-3xl p-8 md:p-10 text-left relative overflow-hidden bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-color pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center">
                    <Mic className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-deep-ink text-base">The Reasoning Studio</h3>
                    <p className="text-xs text-text-muted">
                      Active Evaluation · Verbal Explanation & Misconception Analysis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="studio-pill bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    Voice Dictation Active
                  </span>
                  <span className="studio-pill bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    Groq 70B Evaluator
                  </span>
                </div>
              </div>

              {/* Sample Cognitive Diagnostic Dialogue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Cognitive Prompt
                  </span>
                  <div className="p-4 rounded-2xl bg-soft-neutral/70 border border-border-color text-xs text-charcoal leading-relaxed font-medium">
                    &ldquo;Explain why giving an LLM access to external search APIs is not by itself sufficient to constitute an autonomous agent.&rdquo;
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-border-color text-xs text-deep-ink space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-electric-indigo uppercase">
                        Learner Spoken Voice Input
                      </span>
                      <span className="text-[10px] text-text-muted">Wispr / Web Speech</span>
                    </div>
                    <p className="italic text-charcoal">
                      &ldquo;An LLM with search just fetches text. An agent must maintain a state loop, decide whether to re-query based on intermediate output, and handle errors autonomously.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    AI Diagnostic Evaluation Report
                  </span>
                  <div className="p-4 rounded-2xl bg-electric-indigo/5 border border-electric-indigo/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-electric-indigo">
                        Proficient (Score: 88%)
                      </span>
                      <span className="text-[10px] font-medium text-text-muted">Confidence: 94%</span>
                    </div>
                    <p className="text-xs text-charcoal leading-relaxed">
                      Correctly distinguishes between passive tool calls and closed-loop agentic control cycles.
                    </p>
                    <div className="pt-2 border-t border-electric-indigo/10 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">Mastery Update:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +14 pts on Agent Fundamentals
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: The Learning Atlas */}
        <section id="atlas" className="border-t border-border-color py-20 bg-soft-neutral/40">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="studio-pill bg-deep-ink text-white">Curriculum Journey</span>
              <h2 className="text-3xl md:text-5xl font-black text-deep-ink tracking-tight">
                The Learning Atlas
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Six interconnected milestones bridging the gap between raw transformer token generation
                and self-healing, multi-agent production swarms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MODULES_ATLAS.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.step}
                    className="studio-card rounded-2xl p-7 flex flex-col justify-between hover:border-electric-indigo/40 transition-all group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-text-muted">
                          STAGE {mod.step}
                        </span>
                        <span className="studio-pill bg-soft-neutral text-deep-ink border border-border-color">
                          {mod.tag}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-electric-indigo/10 text-electric-indigo flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-deep-ink group-hover:text-electric-indigo transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed">{mod.desc}</p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border-color flex items-center justify-between text-xs font-semibold text-text-muted">
                      <span>{mod.concepts} Concepts</span>
                      <Link
                        href="/login"
                        className="text-electric-indigo font-bold flex items-center gap-1 group-hover:underline"
                      >
                        Explore Module →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section: Distinctive Differentiators */}
        <section id="fingerprint" className="py-20 border-t border-border-color bg-white">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-4">
              <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20">
                Cognitive Fingerprint
              </span>
              <h2 className="text-3xl font-black text-deep-ink tracking-tight">
                Not Quizzes. <br />
                <span className="font-editorial italic font-normal text-electric-indigo">
                  Mental Model Verification
                </span>
                .
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Conventional platforms ask multiple-choice questions that can be guessed. Agentic IQ requires
                learners to explain causal relationships, detecting faulty reasoning before bad habits solidify in production code.
              </p>
            </div>

            <div className="studio-card rounded-2xl p-6 space-y-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-deep-ink text-sm">Misconception Detection</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Automatically identifies 20+ common mental fallacies such as confusing context-window retention with long-term memory or assuming search API calls imply agent autonomy.
              </p>
            </div>

            <div className="studio-card rounded-2xl p-6 space-y-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-deep-ink text-sm">Adaptive Concept Constellation</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Dynamically prioritizes review drills based on Ebbinghaus spaced repetition schedules and prerequisite mastery gates.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-color py-8 bg-warm-ivory text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-electric-indigo" />
            <span className="font-bold text-deep-ink">Agentic IQ</span>
            <span>— The Learning Intelligence Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Groq GPT-OSS & Supabase</span>
            <Link href="/login" className="hover:text-deep-ink font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
