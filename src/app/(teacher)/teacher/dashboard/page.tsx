'use client';

import Link from 'next/link';
import {
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  Search,
  ArrowUpRight,
  Shield,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function TeacherDashboard() {
  const classStats = {
    totalStudents: 24,
    averageMastery: 71,
    activeMisconceptionsCount: 3,
  };

  const students = [
    { id: 'student-1', name: 'Alex Rivera', email: 'student@agenticiq.demo', mastery: 68, status: 'On Track', struggles: 'Agent execution loops' },
    { id: 'student-2', name: 'Jordan Lee', email: 'jordan@agenticiq.demo', mastery: 84, status: 'Advanced', struggles: 'None' },
    { id: 'student-3', name: 'Taylor Smith', email: 'taylor@agenticiq.demo', mastery: 52, status: 'Needs Support', struggles: 'Tool calling vs RAG' },
    { id: 'student-4', name: 'Morgan Chen', email: 'morgan@agenticiq.demo', mastery: 77, status: 'On Track', struggles: 'Multi-agent handoffs' },
  ];

  const commonMisconceptions = [
    {
      concept: 'AI Agents',
      statement: 'An AI agent is simply an LLM with access to the internet.',
      affectedStudents: 8,
      severity: 'High',
    },
    {
      concept: 'Agent Memory',
      statement: 'Chat history in a single prompt constitutes persistent long-term agent memory.',
      affectedStudents: 5,
      severity: 'Medium',
    },
    {
      concept: 'Conditional Routing',
      statement: 'Agents pick execution paths stochastically rather than deterministically from tool observations.',
      affectedStudents: 4,
      severity: 'Medium',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-color pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="studio-pill bg-deep-ink text-white text-[9px]">
              Instructor View
            </span>
            <span className="text-xs font-mono font-bold text-text-muted">COHORT 2026 · AGENTIC AI</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-deep-ink tracking-tight mt-1">
            Classroom Intelligence Center
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Track cohort cognitive trajectory, diagnose class-wide misconceptions, and assign targeted drills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/teacher/students"
            className="px-4 py-2.5 rounded-xl bg-deep-ink hover:bg-charcoal text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>View All 24 Learners</span>
          </Link>
        </div>
      </div>

      {/* Cohort Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="studio-card rounded-2xl p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Enrolled Cohort</span>
            <Users className="w-4 h-4 text-electric-indigo" />
          </div>
          <div className="text-3xl font-black text-deep-ink font-mono">{classStats.totalStudents}</div>
          <p className="text-[11px] text-text-muted">Active students in studio</p>
        </div>

        <div className="studio-card rounded-2xl p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Class Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono">{classStats.averageMastery}%</div>
          <p className="text-[11px] text-emerald-700 font-medium">+4.2% cognitive gain this week</p>
        </div>

        <div className="studio-card rounded-2xl p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Misconceptions</span>
            <AlertTriangle className="w-4 h-4 text-coral" />
          </div>
          <div className="text-3xl font-black text-coral font-mono">{classStats.activeMisconceptionsCount}</div>
          <p className="text-[11px] text-coral font-medium">Cognitive intervention recommended</p>
        </div>
      </div>

      {/* Cohort Misconception Radar */}
      <div className="studio-card rounded-3xl p-7 bg-white space-y-5">
        <div className="flex items-center justify-between border-b border-border-color pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-deep-ink text-sm">Class-Wide Misconception Radar</h3>
              <p className="text-[11px] text-text-muted">Flawed mental models recurring in voice reasoning submissions</p>
            </div>
          </div>
          <span className="studio-pill bg-coral/10 text-coral border border-coral/20 text-[9px]">
            Cohort Action
          </span>
        </div>

        <div className="space-y-3">
          {commonMisconceptions.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-soft-neutral/50 border border-border-color flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-electric-indigo uppercase">
                    {item.concept}
                  </span>
                  <span className="studio-pill bg-coral/10 text-coral border border-coral/20 text-[8px] py-0">
                    {item.affectedStudents} students impacted
                  </span>
                </div>
                <p className="text-xs text-deep-ink font-semibold">&ldquo;{item.statement}&rdquo;</p>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-white hover:bg-soft-neutral border border-border-color text-xs font-bold text-deep-ink transition-all shrink-0"
              >
                Broadcast Studio Drill
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Student Performance Directory */}
      <div className="studio-card rounded-3xl p-7 bg-white space-y-5">
        <div className="flex items-center justify-between border-b border-border-color pb-3">
          <div>
            <h3 className="font-bold text-deep-ink text-sm">Individual Learner Performance</h3>
            <p className="text-[11px] text-text-muted">Cognitive calibration by student</p>
          </div>
          <Link
            href="/teacher/students"
            className="text-xs font-bold text-electric-indigo hover:underline flex items-center gap-1"
          >
            <span>Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Learner</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Mastery</th>
                <th className="pb-3">Attention Area</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-soft-neutral/30 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-deep-ink">
                    <div>{student.name}</div>
                    <div className="text-[10px] text-text-muted font-normal">{student.email}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`studio-pill text-[9px] ${
                        student.status === 'Advanced'
                          ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                          : student.status === 'Needs Support'
                          ? 'bg-coral/10 text-coral border border-coral/20'
                          : 'bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-deep-ink">{student.mastery}%</td>
                  <td className="py-3.5 text-text-muted">{student.struggles}</td>
                  <td className="py-3.5 text-right pr-2">
                    <Link
                      href={`/teacher/students/${student.id}`}
                      className="px-3 py-1.5 rounded-lg bg-soft-neutral hover:bg-neutral-200 text-deep-ink font-bold text-[11px] transition-all"
                    >
                      Audit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}