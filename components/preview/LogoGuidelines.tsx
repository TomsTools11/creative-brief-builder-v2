'use client';

import { XCircle, Check, Maximize2 } from 'lucide-react';
import { HexagonPattern } from './HexagonPattern';
import type { LogoData, LogoGuidelines as LogoGuidelinesType } from '@/types/brand';

interface LogoGuidelinesProps {
  logos: LogoData[];
  guidelines: LogoGuidelinesType;
  primaryColor?: string;
  secondaryColor?: string;
}

export function LogoGuidelines({
  logos,
  guidelines,
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
}: LogoGuidelinesProps) {
  return (
    <section id="logo" className="scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div
        className="relative flex min-h-[180px] items-center overflow-hidden rounded-2xl px-8 py-12"
        style={{ backgroundColor: secondaryColor }}
      >
        <HexagonPattern color="#ffffff" opacity={0.08} />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-white">Logo </span>
            <span style={{ color: primaryColor }}>Guidelines</span>
          </h2>
          <p className="mt-2 text-white/70">
            Proper usage and application of our brand mark.
          </p>
        </div>
      </div>

      {/* Logo Display */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Logo Variants
          </h3>
          {logos.length > 0 && (
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {logos.slice(0, 4).map((logo, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center rounded-xl p-8 ${
                    logo.variant === 'reversed'
                      ? ''
                      : 'border border-gray-100 bg-white'
                  }`}
                  style={{
                    backgroundColor: logo.variant === 'reversed' ? secondaryColor : undefined,
                  }}
                >
                  <img
                    src={logo.url}
                    alt={logo.alt || `Logo variant ${index + 1}`}
                    className="max-h-24 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Logo Versions */}
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Version Usage
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            {guidelines.versions.map((version, index) => (
              <div key={index} className="rounded-xl border border-gray-100 bg-white p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4" style={{ color: primaryColor }} />
                  <h5 className="font-medium text-[#070d59]">{version.name}</h5>
                </div>
                <p className="mb-2 text-sm text-[#070d59]/70">{version.usage}</p>
                <span className="text-xs text-[#070d59]/50">
                  Background: {version.background}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Space */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Clear Space & Minimum Size
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Clear Space Visualization */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Clear Space
              </h4>
              <div className="flex items-center justify-center py-8">
                <div
                  className="relative inline-block border-2 border-dashed p-8"
                  style={{ borderColor: primaryColor }}
                >
                  {logos[0] && (
                    <img
                      src={logos[0].url}
                      alt="Logo with clear space"
                      className="h-16 w-auto"
                    />
                  )}
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium"
                    style={{ color: primaryColor }}
                  >
                    <Maximize2 className="mr-1 inline h-3 w-3" />
                    Clear space
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-[#070d59]/80">{guidelines.clearSpace.rule}</p>
            </div>

            {/* Minimum Size */}
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Minimum Size
              </h4>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex items-end gap-8">
                  {/* Large size */}
                  <div className="flex flex-col items-center">
                    {logos[0] && (
                      <img
                        src={logos[0].url}
                        alt="Logo large"
                        className="mb-2 h-16 w-auto"
                      />
                    )}
                    <span className="text-xs text-green-600">Recommended</span>
                  </div>
                  {/* Minimum size */}
                  <div className="flex flex-col items-center">
                    {logos[0] && (
                      <img
                        src={logos[0].url}
                        alt="Logo minimum"
                        className="mb-2 h-8 w-auto"
                      />
                    )}
                    <span className="text-xs text-yellow-600">Minimum</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-[#070d59]/80">
                Minimum size: {guidelines.clearSpace.minimumSize}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Placement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />
        <div className="relative z-10">
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Placement Guidelines
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Preferred Locations
              </h4>
              <ul className="space-y-2">
                {guidelines.placement.preferred.map((location, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-[#070d59]/70"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    {location}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Co-branding
              </h4>
              <p className="text-sm text-[#070d59]/70">{guidelines.placement.cobranding}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Don'ts */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-white p-8 shadow-sm">
        <div className="relative z-10">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-600">
            <XCircle className="h-4 w-4" /> Logo Don'ts
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {guidelines.donts.map((dont, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-white p-4"
              >
                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <span className="text-sm text-red-700">{dont}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
