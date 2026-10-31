'use client';

import Link from 'next/link';
import { Users, Search, ArrowUpRight, AlertTriangle, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

const students = [
  {
    id: 'student-1',
    name: 'Alex Rivera',
    email: 'student@agenticiq.demo',
    mastery: 68,
    status: 'On Track',
    struggles: 'Agent execution loops',
    lastActive: '2 hours ago',
    conceptsCompleted: 12,
    totalConcepts: 20,
    misconceptions: 2,
  },
  {
    id: 'student-2',
    name: 'Jordan Lee',
    email: 'jordan@agenticiq.demo',
    mastery: 84,
    status: 'Advanced',
    struggles: 'None',
    lastActive: '1 day ago',
    conceptsCompleted: 17,
    totalConcepts: 20,
    misconceptions: 0,
  },
  {
    id: 'student-3',
    name: 'Taylor Smith',
    email: 'taylor@agenticiq.demo',
    mastery: 52,
    status: 'Needs Support',
    struggles: 'Tool calling vs RAG',
    lastActive: '3 days ago',
    conceptsCompleted: 8,
    totalConcepts: 20,
    misconceptions: 4,
  },
  {
    id: 'student-4',
    name: 'Morgan Chen',
    email: 'morgan@agenticiq.demo',
    mastery: 77,
    status: 'On Track',
    struggles: 'Multi-agent handoffs',
    lastActive: '5 hours ago',
    conceptsCompleted: 14,
    totalConcepts: 20,
    misconceptions: 1,
  },
  {
    id: 'student-5',
    name: 'Riley Park',
    email: 'riley@agenticiq.demo',
    mastery: 91,
    status: 'Advanced',
    struggles: 'None',
    lastActive: '30 min ago',
    conceptsCompleted: 19,
    totalConcepts: 20,
    misconceptions: 0,
  },
  {
    id: 'student-6',
    name: 'Casey Thompson',
    email: 'casey@agenticiq.demo',
    mastery: 39,
    status: 'Needs Support',
    struggles: 'Attention mechanisms',
    lastActive: '1 week ago',
    conceptsCompleted: 5,
    totalConcepts: 20,
    misconceptions: 6,
  },
];

const statusColor: Record<string, string> = {
  'Advanced': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'On Track': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  'Needs Support': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

export default function StudentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            Student Roster
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            View individual student mastery, activity, and intervention signals.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          AI & Agentic Systems — Cohort 2026
        </div>
      </div>

      {/* Class Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Students</div>
          <div className="text-2xl font-black text-white">{students.length}</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Average Mastery</div>
          <div className="text-2xl font-black text-white">
            {Math.round(students.reduce((a, s) => a + s.mastery, 0) / students.length)}%
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Advanced</div>
          <div className="text-2xl font-black text-emerald-400">
            {students.filter((s) => s.status === 'Advanced').length}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Needs Support</div>
          <div className="text-2xl font-black text-amber-400">
            {students.filter((s) => s.status === 'Needs Support').length}
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200">All Students</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search students..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3">Student</th>
                <th className="pb-3">Mastery</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Concepts</th>
                <th className="pb-3">Misconceptions</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-slate-200">{student.name}</div>
                    <div className="text-[10px] text-slate-500">{student.email}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{student.mastery}%</span>
                      <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${student.mastery}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusColor[student.status]}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400">
                    {student.conceptsCompleted}/{student.totalConcepts}
                  </td>
                  <td className="py-3.5">
                    {student.misconceptions > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {student.misconceptions}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        None
                      </span>
                    )}
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {student.lastActive}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/teacher/students/${student.id}`}
                      className="text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
