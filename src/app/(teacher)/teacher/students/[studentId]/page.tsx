'use client';

import { use, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle2, TrendingUp, Clock, BookOpen, Award } from 'lucide-react';

const studentProfiles: Record<string, {
  name: string;
  email: string;
  mastery: number;
  status: string;
  lastActive: string;
  conceptsCompleted: number;
  totalConcepts: number;
  misconceptions: { concept: string; statement: string }[];
  recentActivity: { type: string; description: string; date: string }[];
}> = {
  'student-1': {
    name: 'Alex Rivera',
    email: 'student@agenticiq.demo',
    mastery: 68,
    status: 'On Track',
    lastActive: '2 hours ago',
    conceptsCompleted: 12,
    totalConcepts: 20,
    misconceptions: [
      { concept: 'AI Agents', statement: 'An AI agent is simply an LLM with access to the internet.' },
      { concept: 'Agent Memory', statement: 'Chat history is sufficient for long-term agent memory.' },
    ],
    recentActivity: [
      { type: 'assessment', description: 'Completed Reasoning Assessment on LLM vs AI Agent', date: '2 hours ago' },
      { type: 'lesson', description: 'Completed lesson: Context Windows', date: '1 day ago' },
      { type: 'assessment', description: 'Completed Reasoning Assessment on Tokens & Embeddings', date: '2 days ago' },
    ],
  },
  'student-2': {
    name: 'Jordan Lee',
    email: 'jordan@agenticiq.demo',
    mastery: 84,
    status: 'Advanced',
    lastActive: '1 day ago',
    conceptsCompleted: 17,
    totalConcepts: 20,
    misconceptions: [],
    recentActivity: [
      { type: 'lesson', description: 'Completed lesson: Multi-Agent Coordination Patterns', date: '1 day ago' },
      { type: 'assessment', description: 'Scored 92/100 on Attention Mechanism', date: '3 days ago' },
    ],
  },
  'student-3': {
    name: 'Taylor Smith',
    email: 'taylor@agenticiq.demo',
    mastery: 52,
    status: 'Needs Support',
    lastActive: '3 days ago',
    conceptsCompleted: 8,
    totalConcepts: 20,
    misconceptions: [
      { concept: 'Tool Use', statement: 'RAG is the same thing as tool calling in agent systems.' },
      { concept: 'Attention', statement: 'Attention scores are computed once and reused for efficiency.' },
      { concept: 'Context Windows', statement: 'The model can recall text from previous sessions automatically.' },
      { concept: 'Embeddings', statement: 'Embeddings are just one-hot encoded word vectors.' },
    ],
    recentActivity: [
      { type: 'assessment', description: 'Scored 45/100 on Tool Calling vs RAG', date: '3 days ago' },
      { type: 'lesson', description: 'Started lesson: Prompt Engineering Basics', date: '4 days ago' },
    ],
  },
};

function StudentDetail({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = use(params);
  const student = studentProfiles[studentId];

  if (!student) {
    return (
      <div className="space-y-6">
        <Link href="/teacher/students" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-bold text-white">Student not found</h2>
          <p className="text-slate-400 text-sm mt-2">No detailed profile exists for this student ID.</p>
        </div>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    'Advanced': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'On Track': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    'Needs Support': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  };

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link href="/teacher/students" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Link>

      {/* Profile Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-xl font-black">
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{student.name}</h1>
              <p className="text-slate-400 text-sm">{student.email}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-xl text-xs font-bold ${statusColor[student.status]}`}>
            {student.status}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Mastery
          </div>
          <div className="text-3xl font-black text-white">{student.mastery}%</div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${student.mastery}%` }} />
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Concepts
          </div>
          <div className="text-3xl font-black text-white">{student.conceptsCompleted}<span className="text-slate-500 text-lg font-medium">/{student.totalConcepts}</span></div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Misconceptions
          </div>
          <div className={`text-3xl font-black ${student.misconceptions.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {student.misconceptions.length}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last Active
          </div>
          <div className="text-sm font-bold text-slate-300 mt-1">{student.lastActive}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Misconceptions */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Detected Misconceptions
          </h3>
          {student.misconceptions.length === 0 ? (
            <div className="flex items-center gap-3 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              No misconceptions detected — great reasoning!
            </div>
          ) : (
            <div className="space-y-3">
              {student.misconceptions.map((m, i) => (
                <div key={i} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">{m.concept}</div>
                  <p className="text-xs text-slate-300 italic">"{m.statement}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {student.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activity.type === 'assessment' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                <div className="flex-1">
                  <p className="text-slate-300">{activity.description}</p>
                  <p className="text-slate-500 mt-0.5">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm p-8">Loading student profile...</div>}>
      <StudentDetail params={params} />
    </Suspense>
  );
}
