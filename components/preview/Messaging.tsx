'use client';

import { Badge } from '@/components/ui';
import { HexagonPattern } from './HexagonPattern';
import type { MessagingFrameworks } from '@/types/brand';

interface MessagingProps {
  messaging: MessagingFrameworks;
  primaryColor?: string;
  secondaryColor?: string;
}

export function Messaging({
  messaging,
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
}: MessagingProps) {
  return (
    <section id="messaging" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div
        className="relative flex min-h-[180px] items-center overflow-hidden rounded-2xl px-8 py-12"
        style={{ backgroundColor: secondaryColor }}
      >
        <HexagonPattern color="#ffffff" opacity={0.08} />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-white">Brand </span>
            <span style={{ color: primaryColor }}>Messaging</span>
          </h2>
          <p className="mt-2 text-white/70">
            The core messages and frameworks that drive our communication.
          </p>
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Brand Pillars
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {messaging.pillars.map((pillar, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {index + 1}
                </div>
                <h4 className="mb-2 text-lg font-semibold text-[#070d59]">
                  {pillar.name}
                </h4>
                <p className="mb-4 text-sm text-[#070d59]/70">{pillar.description}</p>
                <div className="space-y-2">
                  {pillar.proofPoints.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-[#070d59]/80"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Value Propositions
          </h3>
          <div className="space-y-4">
            {messaging.valuePropositions.map((vp, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <Badge variant="secondary" size="sm" className="mb-3">
                  {vp.audience}
                </Badge>
                <h4
                  className="mb-2 text-xl font-semibold"
                  style={{ color: secondaryColor }}
                >
                  {vp.headline}
                </h4>
                <p className="text-[#070d59]/70">{vp.subheadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Messages */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Key Messages
          </h3>
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Context
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Audience
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messaging.keyMessages.map((msg, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-[#070d59]">
                      {msg.message}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#070d59]/70">
                      {msg.context}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#070d59]/70">
                      {msg.audience}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Elevator Pitches */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <HexagonPattern color="#ffffff" opacity={0.1} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white/80">
            Elevator Pitches
          </h3>
          <div className="space-y-4">
            {Object.entries(messaging.elevatorPitches).map(([duration, pitch]) => (
              <div key={duration} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <Badge
                  variant="secondary"
                  size="sm"
                  className="mb-3 border-white/30 bg-white/20 text-white"
                >
                  {duration.replace('second', ' seconds')}
                </Badge>
                <p className="text-white leading-relaxed">{pitch}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
