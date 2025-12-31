'use client';

import { Badge } from '@/components/ui';
import { HexagonPattern } from './HexagonPattern';
import type { BrandStrategy as BrandStrategyType } from '@/types/brand';

interface BrandStrategyProps {
  strategy: BrandStrategyType;
  brandName: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function BrandStrategy({
  strategy,
  brandName,
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
}: BrandStrategyProps) {
  return (
    <section id="strategy" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div
        className="relative flex min-h-[180px] items-center overflow-hidden rounded-2xl px-8 py-12"
        style={{ backgroundColor: secondaryColor }}
      >
        <HexagonPattern color="#ffffff" opacity={0.08} />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-white">Brand </span>
            <span style={{ color: primaryColor }}>Strategy</span>
          </h2>
          <p className="mt-2 text-white/70">
            The foundation of how {brandName} connects with the world.
          </p>
        </div>
      </div>

      {/* Positioning */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Brand Positioning
          </h3>
          <blockquote
            className="mb-8 border-l-4 pl-6 text-xl italic text-[#070d59]"
            style={{ borderColor: primaryColor }}
          >
            "{strategy.positioning.statement}"
          </blockquote>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Target Audience
              </h4>
              <p className="text-[#070d59]/80">{strategy.positioning.targetAudience}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Market Category
              </h4>
              <p className="text-[#070d59]/80">{strategy.positioning.marketCategory}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Competitive Advantage
              </h4>
              <p className="text-[#070d59]/80">{strategy.positioning.competitiveAdvantage}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Reason to Believe
              </h4>
              <p className="text-[#070d59]/80">{strategy.positioning.reasonToBelieve}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
          <HexagonPattern opacity={0.03} color={primaryColor} />
          <div className="relative z-10">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Mission
            </h3>
            <p className="mb-3 text-lg font-medium text-[#070d59]">
              {strategy.mission.statement}
            </p>
            <p className="text-sm text-[#070d59]/70">{strategy.mission.explanation}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
          <HexagonPattern opacity={0.03} color={primaryColor} />
          <div className="relative z-10">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Vision
            </h3>
            <p className="mb-3 text-lg font-medium text-[#070d59]">
              {strategy.vision.statement}
            </p>
            <p className="text-sm text-[#070d59]/60">
              Timeframe: {strategy.vision.timeframe}
            </p>
          </div>
        </div>
      </div>

      {/* Brand Promise */}
      <div className="relative overflow-hidden rounded-2xl p-8 shadow-sm" style={{ backgroundColor: primaryColor }}>
        <HexagonPattern color="#ffffff" opacity={0.1} />
        <div className="relative z-10 text-center">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
            Brand Promise
          </h3>
          <p className="mb-4 text-2xl font-bold text-white">
            {strategy.brandPromise.promise}
          </p>
          <p className="text-white/80">{strategy.brandPromise.delivery}</p>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Brand Personality
          </h3>

          <div className="mb-6 flex flex-wrap gap-3">
            {strategy.personality.map((trait, index) => (
              <Badge key={index} variant="primary" size="md">
                {trait.trait}
              </Badge>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {strategy.personality.map((trait, index) => (
              <div key={index} className="rounded-xl border border-gray-100 bg-white p-5">
                <h4 className="mb-2 font-semibold text-[#070d59]">{trait.trait}</h4>
                <p className="mb-3 text-sm text-[#070d59]/80">{trait.description}</p>
                <div className="flex flex-wrap gap-2">
                  {trait.behaviors.map((behavior, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-[#070d59]/70"
                    >
                      {behavior}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Archetype */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Brand Archetype
          </h3>
          <div className="mb-4 flex items-center gap-4">
            <Badge variant="primary" size="md">
              Primary: {strategy.archetype.primary}
            </Badge>
            <Badge variant="secondary" size="md">
              Secondary: {strategy.archetype.secondary}
            </Badge>
          </div>
          <p className="text-[#070d59]/80">{strategy.archetype.description}</p>
        </div>
      </div>

      {/* Boilerplate */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Company Boilerplate
          </h3>
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <p className="text-[#070d59]">{strategy.boilerplate}</p>
          </div>
          <p className="mt-3 text-xs text-[#070d59]/60">
            Use this text for press releases, formal communications, and about sections.
          </p>
        </div>
      </div>
    </section>
  );
}
