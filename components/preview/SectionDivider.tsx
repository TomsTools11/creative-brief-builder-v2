'use client';

import { HexagonPattern } from './HexagonPattern';

interface SectionDividerProps {
  title: string;
  subtitle?: string;
  primaryColor?: string;
  accentColor?: string;
}

export function SectionDivider({
  title,
  subtitle,
  primaryColor = '#070d59',
  accentColor = '#0066ff',
}: SectionDividerProps) {
  return (
    <div
      className="relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-2xl px-8 py-16"
      style={{ backgroundColor: primaryColor }}
    >
      <HexagonPattern color="#ffffff" opacity={0.08} />
      <div className="relative z-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-white">{title.split(' ')[0]} </span>
          <span style={{ color: accentColor }}>{title.split(' ').slice(1).join(' ')}</span>
        </h2>
        {subtitle && (
          <p className="mt-3 text-lg text-white/70">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
