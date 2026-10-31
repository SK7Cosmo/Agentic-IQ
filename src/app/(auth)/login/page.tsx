'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Shield,
  User,
  Lock,
  Loader2,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.role === 'teacher') {
        window.location.href = '/teacher/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.role === 'teacher') {
        window.location.href = '/teacher/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message + ' — Ensure demo accounts are seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory text-deep-ink flex flex-col justify-center items-center p-6 relative selection:bg-electric-indigo/20 selection:text-electric-indigo">
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Studio Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo mb-2 shadow-2xs">
            <Brain className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-deep-ink">Agentic IQ</h1>
            <span className="studio-pill bg-electric-indigo/10 text-electric-indigo border border-electric-indigo/20 text-[8px] py-0">
              Studio
            </span>
          </div>
          <p className="text-xs text-text-muted font-medium">
            Learn. Reason. Master Agentic AI.
          </p>
        </div>

        {/* Studio Auth Card */}
        <div className="studio-card-elevated rounded-3xl p-8 bg-white space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-coral/10 border border-coral/20 rounded-xl text-coral text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-deep-ink uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@agenticiq.demo"
                  className="w-full bg-soft-neutral/50 border border-border-color rounded-xl px-4 py-3 pl-10 text-xs md:text-sm text-deep-ink placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-electric-indigo/20 focus:border-electric-indigo transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-deep-ink uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-soft-neutral/50 border border-border-color rounded-xl px-4 py-3 pl-10 text-xs md:text-sm text-deep-ink placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-electric-indigo/20 focus:border-electric-indigo transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-electric-indigo hover:bg-electric-indigo-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Evaluator Access */}
          <div className="pt-5 border-t border-border-color space-y-3">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">
              Evaluator Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('student@agenticiq.demo', 'AgenticIQ_Student2026!')}
                className="bg-soft-neutral/60 hover:bg-soft-neutral border border-border-color rounded-xl p-3 text-left transition-all group disabled:opacity-50"
              >
                <div className="text-xs font-bold text-electric-indigo group-hover:text-electric-indigo-dark flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Student Demo</span>
                </div>
                <div className="text-[10px] text-text-muted truncate mt-0.5">1-click access</div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('teacher@agenticiq.demo', 'AgenticIQ_Teacher2026!')}
                className="bg-soft-neutral/60 hover:bg-soft-neutral border border-border-color rounded-xl p-3 text-left transition-all group disabled:opacity-50"
              >
                <div className="text-xs font-bold text-deep-ink group-hover:text-electric-indigo flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Teacher Demo</span>
                </div>
                <div className="text-[10px] text-text-muted truncate mt-0.5">1-click access</div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-muted">
          Agentic IQ &bull; The Learning Intelligence Studio
        </p>
      </div>
    </div>
  );
}