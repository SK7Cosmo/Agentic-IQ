'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Award,
  Bot,
  RotateCcw,
  Layers,
  Sparkles
} from 'lucide-react';

interface StudentNavProps {
  onItemClick?: () => void;
}

export default function StudentNav({ onItemClick }: StudentNavProps) {
  const pathname = usePathname();

  const navSections = [
    {
      heading: 'Intelligence Center',
      items: [
        { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard, tag: 'Live' },
        { label: 'Learning Atlas', href: '/curriculum/module-1', icon: Layers, tag: '6 Stages' },
        { label: 'Concept Constellation', href: '/roadmap', icon: Compass, tag: 'Graph' },
      ],
    },
    {
      heading: 'Cognitive Evaluation',
      items: [
        { label: 'Reasoning Studio', href: '/assessment/diagnostic', icon: Award, tag: 'Voice AI' },
        { label: 'Studio Tutor', href: '/tutor', icon: Bot, tag: 'Socratic' },
        { label: 'Revision Drills', href: '/revisions', icon: RotateCcw, tag: 'Spaced' },
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
              const isActive = pathname.startsWith(item.href);
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
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-electric-indigo' : 'text-text-muted'}`}
                    />
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
