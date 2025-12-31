'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'strategy', label: 'Brand Strategy' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'voice', label: 'Voice & Tone' },
  { id: 'logo', label: 'Logo' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
];

interface PreviewNavigationProps {
  primaryColor?: string;
}

export function PreviewNavigation({ primaryColor = '#0066ff' }: PreviewNavigationProps) {
  const [activeSection, setActiveSection] = useState('strategy');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0,
      }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-20 hidden h-fit space-y-1 lg:block">
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#070d59]/40">
        Contents
      </div>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={cn(
            'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
            activeSection === item.id
              ? 'font-medium'
              : 'text-[#070d59]/60 hover:text-[#070d59]'
          )}
          style={{
            backgroundColor: activeSection === item.id ? `${primaryColor}10` : 'transparent',
            color: activeSection === item.id ? primaryColor : undefined,
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
