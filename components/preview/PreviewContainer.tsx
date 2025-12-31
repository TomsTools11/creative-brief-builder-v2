'use client';

import { useState } from 'react';
import { PreviewHeader } from './PreviewHeader';
import { PreviewNavigation } from './PreviewNavigation';
import { BrandStrategy } from './BrandStrategy';
import { Messaging } from './Messaging';
import { VoiceTone } from './VoiceTone';
import { LogoGuidelines } from './LogoGuidelines';
import { ColorPalette } from './ColorPalette';
import { Typography } from './Typography';
import { ButtonStyles } from './ButtonStyles';
import { WorkSamples } from './WorkSamples';
import { HexagonPattern } from './HexagonPattern';
import type { CompleteBrandData } from '@/types/brand';

interface PreviewContainerProps {
  brandData: CompleteBrandData;
  onDownloadPDF?: () => Promise<void>;
}

export function PreviewContainer({ brandData, onDownloadPDF }: PreviewContainerProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Extract primary and secondary colors from brand data
  const primaryColor = brandData.colors.find((c) => c.usage === 'primary')?.hex || '#0066ff';
  const secondaryColor = brandData.colors.find((c) => c.usage === 'secondary')?.hex || '#070d59';

  const handleDownload = async () => {
    if (!onDownloadPDF) return;

    setIsDownloading(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PreviewHeader
        brandData={brandData}
        onDownloadPDF={handleDownload}
        isDownloading={isDownloading}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-12">
          {/* Navigation Sidebar */}
          <aside className="w-48 flex-shrink-0">
            <PreviewNavigation primaryColor={primaryColor} />
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1 space-y-16">
            {/* Hero Section */}
            <section
              className="relative overflow-hidden rounded-3xl px-12 py-20 text-center"
              style={{ backgroundColor: secondaryColor }}
            >
              <HexagonPattern color="#ffffff" opacity={0.08} />
              <div className="relative z-10">
                <h1 className="mb-4 text-5xl font-bold md:text-6xl">
                  <span className="text-white">{brandData.brandName.split(' ')[0]} </span>
                  <span style={{ color: primaryColor }}>
                    {brandData.brandName.split(' ').slice(1).join(' ') || 'Brand'}
                  </span>
                </h1>
                {brandData.tagline && (
                  <p className="mb-8 text-xl text-white/70">
                    {brandData.tagline}
                  </p>
                )}
                <p className="text-white/50">
                  Brand Guidelines {brandData.year}
                </p>
              </div>
            </section>

            {/* Brand Strategy */}
            <BrandStrategy
              strategy={brandData.brandStrategy}
              brandName={brandData.brandName}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Messaging */}
            <Messaging
              messaging={brandData.messaging}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Voice & Tone */}
            <VoiceTone
              verbalExpression={brandData.verbalExpression}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Logo Guidelines */}
            <LogoGuidelines
              logos={brandData.logos}
              guidelines={brandData.logoGuidelines}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Color Palette */}
            <ColorPalette
              colors={brandData.colors}
              guidelines={brandData.colorGuidelines}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Typography */}
            <Typography
              fonts={brandData.fonts}
              guidelines={brandData.typographyGuidelines}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Button Styles */}
            <ButtonStyles
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Work Samples */}
            <WorkSamples
              websiteUrl={brandData.url}
              brandName={brandData.brandName}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Footer */}
            <footer
              className="relative overflow-hidden rounded-2xl py-16 text-center"
              style={{ backgroundColor: secondaryColor }}
            >
              <HexagonPattern color="#ffffff" opacity={0.08} />
              <div className="relative z-10">
                <p className="text-sm text-white/80">
                  {brandData.brandName} Brand Guidelines {brandData.year}
                </p>
                <p className="mt-2 text-xs text-white/50">
                  Generated with Creative Brief Builder
                </p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
