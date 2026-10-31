'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  LayoutDashboard,
  Shield,
  Layers,
  Compass,
  Sparkles
} from 'lucide-react';

interface TeacherNavProps {
  onItemClick?: () => void;
}

export default function TeacherNav({ onItemClick }: TeacherNavProps) {
  const pathname = usePathname();

  const navSections = [
    {
      heading: 'Instructor Intelligence',
      items: [
        { label: 'Class Analytics', href: '/teacher/dashboard', icon: LayoutDashboard, tag: 'Live' },
        { label: 'Student Directory', href: '/teacher/students', icon: Users, tag: '24 Learners' },
      ],
    },
    {
      heading: 'Curriculum Inspection',
      items: [
        { label: 'Learning Atlas (Audit)', href: '/curriculum/module-1', icon: Layers, tag: '6 Stages' },
        { label: 'Constellation Graph', href: '/roadmap', icon: Compass, tag: 'Map' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {navSections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {section.heading}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/teacher/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo shadow-xs'
                      : 'text-charcoal hover:text-deep-ink hover:bg-soft-neutral/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-electric-indigo' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.tag && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-electric-indigo text-white'
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
      ))}
    </div>
  );
}
