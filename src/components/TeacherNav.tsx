'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  LayoutDashboard,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface TeacherNavProps {
  onItemClick?: () => void;
}

export default function TeacherNav({ onItemClick }: TeacherNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Class Analytics', href: '/teacher/dashboard', icon: LayoutDashboard, tag: 'Live' },
    { label: 'Student Directory', href: '/teacher/students', icon: Users, tag: 'Cohort' },
  ];

  return (
    <div className="space-y-1.5">
      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
        Intelligence Panels
      </p>
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-deep-ink text-white shadow-xs'
                  : 'text-charcoal hover:text-deep-ink hover:bg-soft-neutral/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-text-muted'}`} />
                <span>{item.label}</span>
              </div>
              {item.tag && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-soft-neutral text-text-muted border border-border-color'
                  }`}
                >
                  {item.tag}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
