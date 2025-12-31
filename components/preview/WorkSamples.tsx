'use client';

import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { HexagonPattern } from './HexagonPattern';

interface WorkSamplesProps {
  websiteUrl: string;
  brandName: string;
  primaryColor?: string;
  secondaryColor?: string;
  screenshotUrl?: string;
}

export function WorkSamples({
  websiteUrl,
  brandName,
  primaryColor = '#0066ff',
  secondaryColor = '#070d59',
  screenshotUrl,
}: WorkSamplesProps) {
  // Generate a placeholder screenshot URL using a screenshot service
  const placeholderScreenshot = `https://image.thum.io/get/width/1200/crop/800/noanimate/${websiteUrl}`;
  const screenshot = screenshotUrl || placeholderScreenshot;

  return (
    <section id="work-samples" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm">
        <HexagonPattern opacity={0.03} color={primaryColor} />

        <div className="relative z-10">
          {/* Section Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold">
              <span style={{ color: secondaryColor }}>Work </span>
              <span style={{ color: primaryColor }}>Samples</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Examples of the brand in action across digital touchpoints.
            </p>
          </div>

          {/* Website Preview */}
          <div className="mb-8">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Website
            </h4>

            {/* Desktop Browser Frame */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 flex flex-1 items-center gap-2 rounded-md bg-white px-3 py-1 text-xs text-gray-600">
                  <Monitor className="h-3 w-3" />
                  <span className="truncate">{websiteUrl}</span>
                </div>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit
                </a>
              </div>

              {/* Screenshot */}
              <div className="relative aspect-video bg-gray-50">
                <img
                  src={screenshot}
                  alt={`${brandName} website screenshot`}
                  className="h-full w-full object-cover object-top"
                  onError={(e) => {
                    // Fallback to a gradient placeholder
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div class="text-center">
                          <div class="mb-2 text-4xl">🌐</div>
                          <p class="text-sm text-gray-500">Website Preview</p>
                          <p class="text-xs text-gray-400">${websiteUrl}</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Device Mockups */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tablet Frame */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Tablet className="h-4 w-4" />
                Tablet
              </h4>
              <div className="mx-auto max-w-[400px] overflow-hidden rounded-2xl border-8 border-gray-800 bg-gray-800 shadow-xl">
                <div className="aspect-[4/3] bg-white">
                  <img
                    src={screenshot}
                    alt={`${brandName} tablet view`}
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Frame */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Smartphone className="h-4 w-4" />
                Mobile
              </h4>
              <div className="mx-auto max-w-[200px] overflow-hidden rounded-3xl border-8 border-gray-800 bg-gray-800 shadow-xl">
                {/* Notch */}
                <div className="relative">
                  <div className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 rounded-b-xl bg-gray-800" />
                </div>
                <div className="aspect-[9/16] bg-white">
                  <img
                    src={screenshot}
                    alt={`${brandName} mobile view`}
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Digital Guidelines
            </h4>
            <ul className="grid gap-3 text-sm md:grid-cols-2">
              <li className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-[#070d59]/80">
                  Maintain consistent spacing and padding across all digital touchpoints
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-[#070d59]/80">
                  Use the primary color palette for key interactive elements
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-[#070d59]/80">
                  Ensure accessibility with proper color contrast ratios
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-[#070d59]/80">
                  Follow typography hierarchy for clear content structure
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
