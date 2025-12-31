'use client';

import { Check, X } from 'lucide-react';
import { HexagonPattern } from './HexagonPattern';
import type { VerbalExpression } from '@/types/brand';

interface VoiceToneProps {
  verbalExpression: VerbalExpression;
  primaryColor?: string;
  secondaryColor?: string;
}

export function VoiceTone({
  verbalExpression,
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
}: VoiceToneProps) {
  return (
    <section id="voice" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div
        className="relative flex min-h-[180px] items-center overflow-hidden rounded-2xl px-8 py-12"
        style={{ backgroundColor: secondaryColor }}
      >
        <HexagonPattern color="#ffffff" opacity={0.08} />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-white">Voice & </span>
            <span style={{ color: primaryColor }}>Tone</span>
          </h2>
          <p className="mt-2 text-white/70">
            How we communicate and express our brand personality.
          </p>
        </div>
      </div>

      {/* We Are / We Are Not - Styled like the example PDF */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-white p-6 shadow-sm">
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <Check className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-800">We Are</h3>
            </div>
            <div className="space-y-4">
              {verbalExpression.voiceTone.map((item, index) => (
                <div key={index} className="rounded-lg border border-green-100 bg-white p-4">
                  <h4 className="mb-1 font-semibold text-[#070d59]">{item.attribute}</h4>
                  <p className="text-sm text-green-700">{item.doExample}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                <X className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-red-800">We Are Not</h3>
            </div>
            <div className="space-y-4">
              {verbalExpression.voiceTone.map((item, index) => (
                <div key={index} className="rounded-lg border border-red-100 bg-white p-4">
                  <h4 className="mb-1 font-semibold text-[#070d59]">{item.attribute}</h4>
                  <p className="text-sm text-red-700">{item.dontExample}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Attributes - Detailed */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Voice Attributes
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {verbalExpression.voiceTone.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-white p-6"
              >
                <h4
                  className="mb-3 text-lg font-semibold"
                  style={{ color: primaryColor }}
                >
                  {item.attribute}
                </h4>
                <p className="mb-4 text-sm text-[#070d59]/70">{item.description}</p>

                <div className="grid gap-3">
                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-green-700">
                      <Check className="h-3 w-3" /> Do
                    </div>
                    <p className="text-sm text-green-800">{item.doExample}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3">
                    <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-red-700">
                      <X className="h-3 w-3" /> Don't
                    </div>
                    <p className="text-sm text-red-800">{item.dontExample}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tone Spectrum */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Tone Spectrum
          </h3>
          <div className="space-y-8">
            {verbalExpression.toneSpectrum.map((spectrum, index) => (
              <div key={index} className="rounded-xl border border-gray-100 bg-white p-6">
                <div className="mb-3 flex justify-between text-sm font-medium">
                  <span className="text-[#070d59]/60">
                    {spectrum.dimension.split(' vs. ')[0] || spectrum.dimension.split('/')[0]}
                  </span>
                  <span className="text-[#070d59]/60">
                    {spectrum.dimension.split(' vs. ')[1] || spectrum.dimension.split('/')[1]}
                  </span>
                </div>
                <div className="relative h-4 rounded-full bg-gradient-to-r from-gray-200 via-gray-100" style={{ background: `linear-gradient(to right, #e5e7eb, ${primaryColor})` }}>
                  <div
                    className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white shadow-lg"
                    style={{ left: `calc(${spectrum.position}% - 12px)`, backgroundColor: primaryColor }}
                  />
                </div>
                <p className="mt-3 text-sm text-[#070d59]/70">{spectrum.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Writing Style */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Writing Style
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Sentence Length
              </h4>
              <p className="text-sm text-[#070d59]">
                {verbalExpression.writingStyle.sentenceLength}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Vocabulary
              </h4>
              <p className="text-sm text-[#070d59]">
                {verbalExpression.writingStyle.vocabulary}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Punctuation
              </h4>
              <p className="text-sm text-[#070d59]">
                {verbalExpression.writingStyle.punctuation}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Formatting
              </h4>
              <p className="text-sm text-[#070d59]">
                {verbalExpression.writingStyle.formatting}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Style Rules */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Style Rules
          </h3>
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Rule
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {verbalExpression.styleRules.map((rule, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-[#070d59]">
                      {rule.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#070d59]/80">
                      {rule.rule}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[#070d59]/70">
                      {rule.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Appositives */}
      {verbalExpression.appositives.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
          <HexagonPattern opacity={0.03} color={primaryColor} />
          <div className="relative z-10">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Brand Appositives
            </h3>
            <p className="mb-6 text-sm text-[#070d59]/70">
              Use these descriptive phrases when referencing the brand in various contexts.
            </p>
            <div className="space-y-3">
              {verbalExpression.appositives.map((appositive, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[#070d59]">"{appositive.phrase}"</p>
                    <p className="mt-1 text-sm text-[#070d59]/60">{appositive.usage}</p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {appositive.tone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
