'use client';

import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui';
import type { CompleteBrandData } from '@/types/brand';

interface PreviewHeaderProps {
  brandData: CompleteBrandData;
  onDownloadPDF: () => void;
  isDownloading?: boolean;
}

export function PreviewHeader({ brandData, onDownloadPDF, isDownloading }: PreviewHeaderProps) {
  const primaryColor = brandData.colors.find((c) => c.usage === 'primary')?.hex || '#0066ff';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {brandData.logos[0] && (
            <img
              src={brandData.logos[0].url}
              alt={brandData.brandName}
              className="h-10 w-auto object-contain"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-[#070d59]">
              {brandData.brandName}
            </h1>
            <p className="text-sm text-[#070d59]/60">Brand Guidelines {brandData.year}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Share2 className="h-4 w-4" />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${brandData.brandName} Brand Guidelines`,
                  text: `Check out the brand guidelines for ${brandData.brandName}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            Share
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={onDownloadPDF}
            isLoading={isDownloading}
            style={{ backgroundColor: primaryColor }}
          >
            Download PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
