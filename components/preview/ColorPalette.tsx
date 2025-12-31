'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { HexagonPattern, HexagonSwatch } from './HexagonPattern';
import type { ColorData, ColorGuidelines } from '@/types/brand';

interface ColorPaletteProps {
  colors: ColorData[];
  guidelines: ColorGuidelines;
  primaryColor?: string;
  secondaryColor?: string;
}

function HexagonColorSwatch({ color }: { color: ColorData }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if color is light or dark for text contrast
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(color.hex);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? '#070d59' : '#ffffff';

  return (
    <div className="group relative flex flex-col items-center">
      <button
        onClick={copyToClipboard}
        className="relative transition-transform hover:scale-105 focus:outline-none"
        title={`Copy ${color.hex}`}
      >
        <HexagonSwatch color={color.hex} size={100} />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? (
            <Check className="h-5 w-5 drop-shadow-md" style={{ color: textColor }} />
          ) : (
            <Copy className="h-5 w-5 drop-shadow-md" style={{ color: textColor }} />
          )}
        </div>
      </button>
      <div className="mt-3 text-center">
        <p className="text-sm font-semibold text-[#070d59]">{color.name}</p>
        <p className="font-mono text-xs text-[#070d59]/60">{color.hex.toUpperCase()}</p>
      </div>
    </div>
  );
}

function ColorDetails({ color }: { color: ColorData }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <HexagonSwatch color={color.hex} size={80} className="mb-4" />
      <h4 className="mb-3 text-center font-semibold text-[#070d59]">{color.name}</h4>
      <div className="w-full space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-[#070d59]/60">HEX</span>
          <span className="font-mono text-[#070d59]">{color.hex.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#070d59]/60">RGB</span>
          <span className="font-mono text-[#070d59]">
            {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#070d59]/60">CMYK</span>
          <span className="font-mono text-[#070d59]">
            {color.cmyk.c}, {color.cmyk.m}, {color.cmyk.y}, {color.cmyk.k}
          </span>
        </div>
        {color.pantone && (
          <div className="flex justify-between">
            <span className="text-[#070d59]/60">Pantone</span>
            <span className="font-mono text-[#070d59]">{color.pantone}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ColorPalette({
  colors,
  guidelines,
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
}: ColorPaletteProps) {
  const primaryColors = colors.filter((c) => c.usage === 'primary' || c.usage === 'secondary');
  const accentColors = colors.filter((c) => c.usage === 'accent' || c.usage === 'background');

  return (
    <section id="colors" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />

        <div className="relative z-10">
          {/* Section Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold">
              <span style={{ color: secondaryColor }}>Color </span>
              <span style={{ color: primaryColor }}>Palette</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Our colors communicate our brand personality and create visual consistency.
            </p>
          </div>

          {/* Primary Colors with Hexagon Swatches */}
          <div className="mb-10">
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Primary Colors
            </h4>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {primaryColors.map((color, index) => (
                <ColorDetails key={index} color={color} />
              ))}
            </div>
          </div>

          {/* Accent/Secondary Colors */}
          {accentColors.length > 0 && (
            <div className="mb-10">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Accent Colors
              </h4>
              <div className="flex flex-wrap justify-start gap-8">
                {accentColors.map((color, index) => (
                  <HexagonColorSwatch key={index} color={color} />
                ))}
              </div>
            </div>
          )}

          {/* Color Principles */}
          {guidelines.principles.length > 0 && (
            <div className="mb-10 rounded-xl border border-gray-100 bg-white p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Color Principles
              </h4>
              <ul className="grid gap-3 md:grid-cols-2">
                {guidelines.principles.map((principle, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span className="text-sm text-[#070d59]/80">{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Color Combinations */}
          {guidelines.combinations.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-6">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Recommended Combinations
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {guidelines.combinations.map((combo, index) => (
                  <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <h5 className="mb-3 font-medium text-[#070d59]">{combo.name}</h5>
                    <div className="mb-3 flex gap-2">
                      <div className="flex-1 overflow-hidden rounded-lg">
                        <div
                          className="h-12 w-full"
                          style={{ backgroundColor: combo.background }}
                          title="Background"
                        />
                      </div>
                      <div className="overflow-hidden rounded-lg">
                        <div
                          className="h-12 w-12"
                          style={{ backgroundColor: combo.text }}
                          title="Text"
                        />
                      </div>
                      <div className="overflow-hidden rounded-lg">
                        <div
                          className="h-12 w-12"
                          style={{ backgroundColor: combo.accent }}
                          title="Accent"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-[#070d59]/60">{combo.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
