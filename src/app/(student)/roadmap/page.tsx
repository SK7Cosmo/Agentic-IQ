'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Info,
  TrendingUp,
  Layers,
  Activity,
  AlertTriangle,
  Play
} from 'lucide-react';

interface ConstellationNode {
  id: string;
  name: string;
  moduleId: string;
  moduleName: string;
  x: number; // 0-1000 SVG coordinates
  y: number; // 0-500 SVG coordinates
  mastery: number; // 0-100
  state: 'mastered' | 'proficient' | 'developing' | 'beginner' | 'unassessed';
  prereqs: string[];
  description: string;
  drillPrompt: string;
}

const CONSTELLATION_NODES: ConstellationNode[] = [
  // Stage 1: LLM Foundations
  {
    id: 'c-tokens',
    name: 'Tokens & Vocab',
    moduleId: 'module-1',
    moduleName: 'LLM Foundations',
    x: 120,
    y: 180,
    mastery: 95,
    state: 'mastered',
    prereqs: [],
    description: 'BPE tokenization, vocabulary compression, and token boundary artifacts.',
    drillPrompt: 'Explain how byte-pair encoding creates subword units from unknown words.',
  },
  {
    id: 'c-embeddings',
    name: 'Embeddings & Geometry',
    moduleId: 'module-1',
    moduleName: 'LLM Foundations',
    x: 240,
    y: 110,
    mastery: 90,
    state: 'mastered',
    prereqs: ['c-tokens'],
    description: 'High-dimensional vector representations and cosine similarity in semantic manifolds.',
    drillPrompt: 'Why do synonyms cluster in embedding space while antonyms often share close vectors?',
  },
  {
    id: 'c-attention',
    name: 'Attention Mechanics',
    moduleId: 'module-1',
    moduleName: 'LLM Foundations',
    x: 260,
    y: 280,
    mastery: 84,
    state: 'mastered',
    prereqs: ['c-tokens'],
    description: 'Scaled dot-product attention, Queries, Keys, Values, and softmax weight distribution.',
    drillPrompt: 'Describe how multi-head attention allows a token to attend to multiple syntactic relationships.',
  },
  {
    id: 'c-context',
    name: 'Context Boundaries',
    moduleId: 'module-1',
    moduleName: 'LLM Foundations',
    x: 380,
    y: 200,
    mastery: 75,
    state: 'proficient',
    prereqs: ['c-attention', 'c-embeddings'],
    description: 'Hard token limits, KV-cache consumption, and attention degradation over long sequences.',
    drillPrompt: 'Why does needle-in-a-haystack retrieval degrade in the middle of large context windows?',
  },

  // Stage 2: Agent Fundamentals
  {
    id: 'c-tools',
    name: 'Tool Protocols',
    moduleId: 'module-2',
    moduleName: 'Agent Fundamentals',
    x: 500,
    y: 130,
    mastery: 72,
    state: 'proficient',
    prereqs: ['c-context'],
    description: 'Structured JSON schema definitions, function call parsing, and execution harnesses.',
    drillPrompt: 'Why does an agent require schema-constrained tool arguments rather than freeform text?',
  },
  {
    id: 'c-react',
    name: 'ReAct Reasoning Loop',
    moduleId: 'module-2',
    moduleName: 'Agent Fundamentals',
    x: 520,
    y: 310,
    mastery: 68,
    state: 'proficient',
    prereqs: ['c-context'],
    description: 'Interleaving Thought, Action, and Observation cycles to solve non-trivial objectives.',
    drillPrompt: 'Explain how explicit thought generation prevents an agent from committing premature tool actions.',
  },
  {
    id: 'c-autonomy',
    name: 'Autonomous Decision Gates',
    moduleId: 'module-2',
    moduleName: 'Agent Fundamentals',
    x: 650,
    y: 220,
    mastery: 58,
    state: 'developing',
    prereqs: ['c-tools', 'c-react'],
    description: 'Self-termination checks, hallucination rollback, and confidence thresholds.',
    drillPrompt: 'How does an agent determine it has reached a terminal goal state without infinite looping?',
  },

  // Stage 3 & 4: Architecture & Orchestration
  {
    id: 'c-memory',
    name: 'Vector Memory Stores',
    moduleId: 'module-3',
    moduleName: 'Agent Architecture',
    x: 770,
    y: 120,
    mastery: 45,
    state: 'developing',
    prereqs: ['c-autonomy'],
    description: 'Episodic memory, hierarchical summarization, and vector retrieval augmenting context.',
    drillPrompt: 'Differentiate between working memory inside context versus episodic long-term vector stores.',
  },
  {
    id: 'c-swarms',
    name: 'Multi-Agent Swarms',
    moduleId: 'module-4',
    moduleName: 'Agent Orchestration',
    x: 790,
    y: 320,
    mastery: 38,
    state: 'beginner',
    prereqs: ['c-autonomy'],
    description: 'Supervisor-worker topologies, consensus protocols, and task handoffs.',
    drillPrompt: 'Why do multi-agent swarms without hierarchical routing suffer from cascading communication noise?',
  },
  {
    id: 'c-benchmarks',
    name: 'Trajectory Auditing',
    moduleId: 'module-6',
    moduleName: 'Evaluation & Benchmarks',
    x: 920,
    y: 220,
    mastery: 25,
    state: 'beginner',
    prereqs: ['c-memory', 'c-swarms'],
    description: 'SWE-bench evaluation, tool call precision, and step-level hallucination penalties.',
    drillPrompt: 'Explain why evaluating an agent on final output alone fails to measure reasoning efficiency.',
  },
];

const CONNECTIONS: [string, string][] = [
  ['c-tokens', 'c-embeddings'],
  ['c-tokens', 'c-attention'],
  ['c-embeddings', 'c-context'],
  ['c-attention', 'c-context'],
  ['c-context', 'c-tools'],
  ['c-context', 'c-react'],
  ['c-tools', 'c-autonomy'],
  ['c-react', 'c-autonomy'],
  ['c-autonomy', 'c-memory'],
  ['c-autonomy', 'c-swarms'],
  ['c-memory', 'c-benchmarks'],
  ['c-swarms', 'c-benchmarks'],
];

export default function ConceptConstellationPage() {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode>(CONSTELLATION_NODES[4]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredNodes = activeFilter === 'all'
    ? CONSTELLATION_NODES
    : CONSTELLATION_NODES.filter((n) => n.moduleId === activeFilter);

  const getNodeStateStyle = (state: ConstellationNode['state']) => {
    switch (state) {
      case 'mastered':
        return {
          fill: '#10b981',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-700',
          border: 'border-emerald-500/30',
          label: 'Mastered',
        };
      case 'proficient':
        return {
          fill: '#4f46e5',
          bg: 'bg-electric-indigo/10',
          text: 'text-electric-indigo',
          border: 'border-electric-indigo/30',
          label: 'Proficient',
        };
      case 'developing':
        return {
          fill: '#f59e0b',
          bg: 'bg-amber-500/10',
          text: 'text-amber-700',
          border: 'border-amber-500/30',
          label: 'Developing',
        };
      default:
        return {
          fill: '#ef4444',
          bg: 'bg-coral/10',
          text: 'text-coral',
          border: 'border-coral/30',
          label: 'Beginner',
        };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border-color pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[9px]">
              Signature Knowledge Graph
            </span>
            <span className="text-xs font-mono font-bold text-text-muted">6 MODULES · 36 CONCEPTS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-deep-ink tracking-tight mt-1">
            The Concept Constellation
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Explore interconnected cognitive nodes and prerequisite paths. Click any concept to review causal models and launch reasoning drills.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-border-color text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered
          </span>
          <span className="flex items-center gap-1.5 text-electric-indigo font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-electric-indigo" /> Proficient
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Developing
          </span>
          <span className="flex items-center gap-1.5 text-coral font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-coral" /> Beginner
          </span>
        </div>
      </div>

      {/* Main Interactive Graph & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Constellation SVG Canvas */}
        <div className="lg:col-span-8 studio-card rounded-3xl p-6 bg-white overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Constellation Map View
            </span>
            <span className="text-[11px] text-text-muted">
              Select node to inspect prerequisite chain
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 1000 440"
              className="w-full min-w-[700px] h-auto select-none"
            >
              {/* Prerequisite Connection Lines */}
              {CONNECTIONS.map(([srcId, tgtId], idx) => {
                const src = CONSTELLATION_NODES.find((n) => n.id === srcId);
                const tgt = CONSTELLATION_NODES.find((n) => n.id === tgtId);
                if (!src || !tgt) return null;

                const isConnectedToSelected =
                  selectedNode.id === src.id || selectedNode.id === tgt.id;

                return (
                  <line
                    key={idx}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isConnectedToSelected ? '#4f46e5' : '#e6e0d4'}
                    strokeWidth={isConnectedToSelected ? '2.5' : '1.5'}
                    strokeDasharray={isConnectedToSelected ? 'none' : '4,4'}
                    className="transition-all"
                  />
                );
              })}

              {/* Concept Nodes */}
              {CONSTELLATION_NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const stateStyle = getNodeStateStyle(node.state);

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Glow Halo on Selection */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="24"
                        fill="rgba(79, 70, 229, 0.15)"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? '14' : '11'}
                      fill={isSelected ? '#4f46e5' : stateStyle.fill}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="transition-all drop-shadow-xs"
                    />

                    {/* Node Label */}
                    <text
                      x={node.x}
                      y={node.y + 24}
                      textAnchor="middle"
                      className={`text-[11px] font-sans transition-all ${
                        isSelected
                          ? 'font-black fill-deep-ink'
                          : 'font-semibold fill-charcoal group-hover:fill-electric-indigo'
                      }`}
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Concept Inspector Drawer */}
        <div className="lg:col-span-4 studio-card-elevated rounded-3xl p-7 bg-white space-y-6">
          <div className="space-y-2 border-b border-border-color pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-electric-indigo uppercase">
                {selectedNode.moduleName}
              </span>
              <span
                className={`studio-pill ${getNodeStateStyle(selectedNode.state).bg} ${
                  getNodeStateStyle(selectedNode.state).text
                } border ${getNodeStateStyle(selectedNode.state).border}`}
              >
                {selectedNode.state}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-deep-ink leading-tight">
              {selectedNode.name}
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          {/* Mastery Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-text-muted">Mastery Calibration</span>
              <span className="font-mono font-bold text-electric-indigo">
                {selectedNode.mastery}%
              </span>
            </div>
            <div className="w-full bg-soft-neutral h-2 rounded-full overflow-hidden border border-border-color">
              <div
                className="bg-electric-indigo h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedNode.mastery}%` }}
              />
            </div>
          </div>

          {/* Socratic Reasoning Drill Prompt */}
          <div className="p-4 rounded-2xl bg-electric-indigo/5 border border-electric-indigo/15 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-electric-indigo">
              Reasoning Probe
            </span>
            <p className="text-xs text-deep-ink font-medium leading-relaxed italic">
              &ldquo;{selectedNode.drillPrompt}&rdquo;
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <Link
              href="/assessment/diagnostic"
              className="w-full py-3.5 px-4 rounded-xl bg-electric-indigo hover:bg-electric-indigo-dark text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Launch Reasoning Studio Drill</span>
            </Link>

            <Link
              href={`/curriculum/${selectedNode.moduleId}`}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-soft-neutral text-deep-ink text-xs font-bold transition-all border border-border-color shadow-2xs flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-electric-indigo" />
              <span>Review Lesson Module</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
