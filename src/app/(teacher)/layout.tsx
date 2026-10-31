'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherNav from '@/components/TeacherNav';
import { Brain, LogOut, User, Shield, Menu, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

function TeacherLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState('Dr. Evelyn Reed');
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUserEmail(user.email ?? '');
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setUserName(data.full_name);
        });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('API logout error:', e);
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase client signout error:', e);
    }
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-warm-ivory text-deep-ink flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border-color bg-white sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-deep-ink text-white flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-deep-ink">Agentic IQ</span>
            <span className="text-[10px] text-text-muted block">Teacher Intelligence</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-soft-neutral text-deep-ink"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-50 p-6 flex flex-col justify-between overflow-y-auto">
          <Suspense fallback={<div className="text-xs text-text-muted">Loading navigation...</div>}>
            <TeacherNav />
          </Suspense>

          <div className="border-t border-border-color pt-4 mt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-soft-neutral text-xs font-bold text-coral"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Studio Sidebar */}
      <aside className="hidden md:flex w-68 border-r border-border-color bg-white flex-col justify-between p-5 shrink-0 min-h-screen sticky top-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-2xl bg-deep-ink text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-deep-ink tracking-tight">Agentic IQ</span>
                <span className="studio-pill bg-soft-neutral text-deep-ink border border-border-color text-[8px] py-0 px-1.5">
                  Teacher
                </span>
              </div>
              <span className="block text-[10px] text-text-muted font-medium">
                Classroom Intelligence
              </span>
            </div>
          </div>

          <div className="px-1">
            <div className="p-2.5 rounded-xl bg-soft-neutral/70 border border-border-color text-[11px] font-semibold text-charcoal">
              Cohort 2026 · Agentic AI
            </div>
          </div>

          <Suspense fallback={<div className="text-xs text-text-muted px-3">Loading...</div>}>
            <TeacherNav />
          </Suspense>
        </div>

        {/* Profile Card & Logout */}
        <div className="border-t border-border-color pt-4">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-soft-neutral/70 border border-border-color">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-deep-ink text-white flex items-center justify-center text-xs font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-deep-ink truncate">{userName}</p>
                <p className="text-[10px] text-text-muted truncate">{userEmail || 'Instructor'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-coral p-1.5 rounded-xl hover:bg-white transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Studio Viewport */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherLayoutInner>{children}</TeacherLayoutInner>;
}