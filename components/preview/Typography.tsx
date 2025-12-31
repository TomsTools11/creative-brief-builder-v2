'use client';

import { HexagonPattern } from './HexagonPattern';
import type { FontData, TypographyGuidelines } from '@/types/brand';

interface TypographyProps {
  fonts: FontData[];
  guidelines: TypographyGuidelines;
  primaryColor?: string;
  secondaryColor?: string;
}

export function Typography({
  fonts,
  guidelines,
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
}: TypographyProps) {
  return (
    <section id="typography" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />

        <div className="relative z-10">
          {/* Section Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold">
              <span style={{ color: secondaryColor }}>Typo</span>
              <span style={{ color: primaryColor }}>graphy</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Typography creates hierarchy and establishes our brand voice in visual form.
            </p>
          </div>

          {/* Primary Typeface */}
          <div className="mb-8">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Primary Typeface
            </h4>
            <div
              className="overflow-hidden rounded-xl p-6"
              style={{ backgroundColor: secondaryColor }}
            >
              <div
                className="mb-4 text-5xl font-bold text-white"
                style={{ fontFamily: guidelines.primaryTypeface.name }}
              >
                {guidelines.primaryTypeface.name}
              </div>
              <p className="mb-4 text-white/80">{guidelines.primaryTypeface.characteristics}</p>
              <div className="mb-4">
                <span className="text-sm font-medium text-white/60">Usage: </span>
                <span className="text-sm text-white">{guidelines.primaryTypeface.usage}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {guidelines.primaryTypeface.weights.map((weight) => (
                  <span
                    key={weight}
                    className="rounded-full bg-white/20 px-3 py-1 text-sm text-white"
                    style={{ fontWeight: weight }}
                  >
                    {weight}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Typeface */}
          <div className="mb-8">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Secondary Typeface
            </h4>
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <div
                className="mb-4 text-4xl font-semibold text-[#070d59]"
                style={{ fontFamily: guidelines.secondaryTypeface.name }}
              >
                {guidelines.secondaryTypeface.name}
              </div>
              <p className="mb-4 text-[#070d59]/80">{guidelines.secondaryTypeface.characteristics}</p>
              <div>
                <span className="text-sm font-medium text-[#070d59]/60">Usage: </span>
                <span className="text-sm text-[#070d59]">{guidelines.secondaryTypeface.usage}</span>
              </div>
            </div>
          </div>

          {/* Type Scale Preview */}
          <div className="mb-8">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Type Scale
            </h4>
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-5xl font-bold text-[#070d59]">Heading 1</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {guidelines.hierarchy.h1.size} / {guidelines.hierarchy.h1.weight} / {guidelines.hierarchy.h1.lineHeight}
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-4xl font-bold text-[#070d59]">Heading 2</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {guidelines.hierarchy.h2.size} / {guidelines.hierarchy.h2.weight} / {guidelines.hierarchy.h2.lineHeight}
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-3xl font-semibold text-[#070d59]">Heading 3</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {guidelines.hierarchy.h3.size} / {guidelines.hierarchy.h3.weight} / {guidelines.hierarchy.h3.lineHeight}
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-2xl font-semibold text-[#070d59]">Heading 4</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {guidelines.hierarchy.h4.size} / {guidelines.hierarchy.h4.weight} / {guidelines.hierarchy.h4.lineHeight}
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-base text-[#070d59]">
                    Body text is used for all standard paragraph content. It should be clear, readable, and maintain comfortable line length for optimal readability.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {guidelines.hierarchy.body.size} / {guidelines.hierarchy.body.weight} / {guidelines.hierarchy.body.lineHeight}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#070d59]/70">
                    Small text for captions, footnotes, and supporting information.
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {guidelines.hierarchy.small.size} / {guidelines.hierarchy.small.weight} / {guidelines.hierarchy.small.lineHeight}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Type Hierarchy Table */}
          <div className="mb-8">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Type Hierarchy
            </h4>
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Line Height
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Usage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(guidelines.hierarchy).map(([level, spec]) => (
                    <tr key={level} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-[#070d59]">
                        {level.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-[#070d59]/70">
                        {spec.size}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-[#070d59]/70">
                        {spec.weight}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-[#070d59]/70">
                        {spec.lineHeight}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#070d59]/70">
                        {spec.usage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Typography Guidelines */}
          {guidelines.guidelines.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Guidelines
              </h4>
              <ul className="grid gap-3 md:grid-cols-2">
                {guidelines.guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span className="text-sm text-[#070d59]/80">{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
