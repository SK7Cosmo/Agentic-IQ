'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Filter,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  mastery: number;
  status: 'Advanced' | 'On Track' | 'Needs Support';
  struggles: string;
  lastActive: string;
  conceptsCompleted: number;
  totalConcepts: number;
  misconceptions: number;
  archetype: string;
}

const students: StudentRosterItem[] = [
  {
    id: 'student-1',
    name: 'Alex Rivera',
    email: 'student@agenticiq.demo',
    mastery: 68,
    status: 'On Track',
    struggles: 'Agent execution loops & ReAct backtracking',
    lastActive: '2 hours ago',
    conceptsCompleted: 12,
    totalConcepts: 24,
    misconceptions: 2,
    archetype: 'Deliberate Builder',
  },
  {
    id: 'student-2',
    name: 'Jordan Lee',
    email: 'jordan@agenticiq.demo',
    mastery: 84,
    status: 'Advanced',
    struggles: 'None · Ready for multi-agent swarms',
    lastActive: '1 day ago',
    conceptsCompleted: 19,
    totalConcepts: 24,
    misconceptions: 0,
    archetype: 'Rapid Explorer',
  },
  {
    id: 'student-3',
    name: 'Taylor Smith',
    email: 'taylor@agenticiq.demo',
    mastery: 52,
    status: 'Needs Support',
    struggles: 'Tool calling schemas vs Vector RAG',
    lastActive: '3 days ago',
    conceptsCompleted: 8,
    totalConcepts: 24,
    misconceptions: 4,
    archetype: 'Theoretical Thinker',
  },
  {
    id: 'student-4',
    name: 'Morgan Chen',
    email: 'morgan@agenticiq.demo',
    mastery: 77,
    status: 'On Track',
    struggles: 'Multi-agent handoff protocols & blackboards',
    lastActive: '5 hours ago',
    conceptsCompleted: 15,
    totalConcepts: 24,
    misconceptions: 1,
    archetype: 'Deliberate Builder',
  },
  {
    id: 'student-5',
    name: 'Riley Park',
    email: 'riley@agenticiq.demo',
    mastery: 91,
    status: 'Advanced',
    struggles: 'None · Calibrated across all 6 stages',
    lastActive: '30 mins ago',
    conceptsCompleted: 22,
    totalConcepts: 24,
    misconceptions: 0,
    archetype: 'Systems Architect',
  },
  {
    id: 'student-6',
    name: 'Casey Thompson',
    email: 'casey@agenticiq.demo',
    mastery: 39,
    status: 'Needs Support',
    struggles: 'Self-attention matrices & token bounds',
    lastActive: '1 week ago',
    conceptsCompleted: 5,
    totalConcepts: 24,
    misconceptions: 5,
    archetype: 'Needs Intervention',
  },
];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Advanced' | 'On Track' | 'Needs Support'>('All');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.struggles.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const avgMastery = Math.round(students.reduce((a, s) => a + s.mastery, 0) / students.length);

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-color pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="studio-pill bg-deep-ink text-white text-[9px] font-bold">
              Cohort Intelligence
            </span>
            <span className="text-xs font-mono font-bold text-text-muted">
              STUDENT DIRECTORY · COHORT 2026
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-deep-ink tracking-tight font-editorial mt-1">
            Student Intelligence Roster
          </h1>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            Audit individual cognitive trajectories, monitor active misconceptions from voice reasoning diagnostics, and trigger targeted interventions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/teacher/dashboard"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-soft-neutral border border-border-color text-deep-ink text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
          >
            <span>← Back to Analytics Overview</span>
          </Link>
        </div>
      </div>

      {/* Cohort Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="studio-card rounded-2xl p-5 bg-white space-y-1">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Learners</div>
          <div className="text-2xl font-black text-deep-ink font-mono">{students.length}</div>
          <p className="text-[10px] text-text-muted">Active enrollments</p>
        </div>

        <div className="studio-card rounded-2xl p-5 bg-white space-y-1">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Cohort Avg Mastery</div>
          <div className="text-2xl font-black text-emerald-700 font-mono">{avgMastery}%</div>
          <p className="text-[10px] text-emerald-700 font-medium">+4.2% this week</p>
        </div>

        <div className="studio-card rounded-2xl p-5 bg-white space-y-1">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Advanced Mastery</div>
          <div className="text-2xl font-black text-electric-indigo font-mono">
            {students.filter((s) => s.status === 'Advanced').length}
          </div>
          <p className="text-[10px] text-electric-indigo font-medium">Ready for production</p>
        </div>

        <div className="studio-card rounded-2xl p-5 bg-white space-y-1">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Need Support</div>
          <div className="text-2xl font-black text-coral font-mono">
            {students.filter((s) => s.status === 'Needs Support').length}
          </div>
          <p className="text-[10px] text-coral font-medium">Interventions scheduled</p>
        </div>
      </div>

      {/* Student Directory Studio Card */}
      <div className="studio-card rounded-3xl p-7 bg-white space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border-color pb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by learner name, email, or attention topic..."
              className="w-full bg-soft-neutral/50 border border-border-color rounded-xl pl-10 pr-4 py-2.5 text-xs text-deep-ink placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-electric-indigo/20 focus:border-electric-indigo transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Advanced', 'On Track', 'Needs Support'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === filter
                    ? 'bg-deep-ink text-white shadow-2xs'
                    : 'bg-soft-neutral/60 hover:bg-soft-neutral text-text-muted hover:text-deep-ink'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-color text-text-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Learner</th>
                <th className="pb-3">Cognitive Status</th>
                <th className="pb-3">Mastery</th>
                <th className="pb-3">Learning Atlas Progress</th>
                <th className="pb-3">Active Misconceptions</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-muted text-xs">
                    No learners match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const initials = student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('');

                  return (
                    <tr key={student.id} className="hover:bg-soft-neutral/30 transition-colors">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo font-bold flex items-center justify-center shrink-0 text-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-deep-ink text-xs">{student.name}</div>
                            <div className="text-[10px] text-text-muted">{student.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
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
                        <div className="text-[10px] text-text-muted mt-0.5">{student.archetype}</div>
                      </td>

                      <td className="py-4">
                        <div className="space-y-1.5 w-28">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-deep-ink">
                            <span>{student.mastery}%</span>
                          </div>
                          <div className="w-full bg-soft-neutral rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
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
                      </td>

                      <td className="py-4 text-text-muted">
                        <div className="font-semibold text-deep-ink text-xs">
                          {student.conceptsCompleted} / {student.totalConcepts} concepts
                        </div>
                        <div className="text-[10px] text-text-muted">Across 6 stages</div>
                      </td>

                      <td className="py-4">
                        {student.misconceptions > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-coral font-bold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{student.misconceptions} flagged</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Calibrated</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-text-muted text-xs">
                          <Clock className="w-3.5 h-3.5 text-text-muted" />
                          <span>{student.lastActive}</span>
                        </span>
                      </td>

                      <td className="py-4 text-right pr-2">
                        <Link
                          href={`/teacher/students/${student.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-soft-neutral hover:bg-neutral-200 text-deep-ink font-bold text-xs transition-all inline-flex items-center gap-1 border border-border-color shadow-2xs"
                        >
                          <span>Audit</span>
                          <ArrowRight className="w-3 h-3 text-electric-indigo" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
