'use client';

import { ArrowRight } from 'lucide-react';
import { HexagonPattern } from './HexagonPattern';

interface ButtonStylesProps {
  primaryColor?: string;
  secondaryColor?: string;
}

export function ButtonStyles({
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
}: ButtonStylesProps) {
  return (
    <section id="button-styles" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />

        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold">
              <span style={{ color: secondaryColor }}>Button </span>
              <span style={{ color: primaryColor }}>Styles</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Consistent button styling ensures a cohesive user experience across all touchpoints.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Primary Button */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Primary
              </h4>
              <div className="flex flex-col gap-4">
                <button
                  className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Use for primary calls-to-action. Solid fill with brand accent color.
              </p>
            </div>

            {/* Secondary Button */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Secondary
              </h4>
              <div className="flex flex-col gap-4">
                <button
                  className="flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all hover:bg-gray-50"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  className="flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all hover:bg-gray-50"
                  style={{ borderColor: secondaryColor, color: secondaryColor }}
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Use for secondary actions. Outline style with brand colors.
              </p>
            </div>

            {/* Tertiary Button */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Tertiary
              </h4>
              <div className="flex flex-col gap-4">
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:underline"
                  style={{ color: primaryColor }}
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:underline"
                  style={{ color: secondaryColor }}
                >
                  See All
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Use for tertiary actions and inline links. Text only with arrow indicator.
              </p>
            </div>
          </div>

          {/* Button Specifications */}
          <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Specifications
            </h4>
            <div className="grid gap-4 text-sm md:grid-cols-4">
              <div>
                <p className="font-medium text-gray-900">Border Radius</p>
                <p className="text-gray-500">Full (pill shape)</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Padding</p>
                <p className="text-gray-500">12px 24px</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Font Weight</p>
                <p className="text-gray-500">Semibold (600)</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Icon Size</p>
                <p className="text-gray-500">16px with 8px gap</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
