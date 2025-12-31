'use client';

import { useState, useCallback } from 'react';
import { UrlInputForm, ProgressDisplay } from '@/components/forms';
import { PreviewContainer } from '@/components/preview';
import { Button } from '@/components/ui';
import type { AnalysisResult } from '@/types/analysis';
import type { CompleteBrandData } from '@/types/brand';
import { ArrowLeft, RefreshCw } from 'lucide-react';

type AppStep = 'input' | 'analyzing' | 'generating' | 'preview';

interface ProgressState {
  message: string;
  percentage: number;
}

export default function Home() {
  const [step, setStep] = useState<AppStep>('input');
  const [progress, setProgress] = useState<ProgressState>({ message: '', percentage: 0 });
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [brandData, setBrandData] = useState<CompleteBrandData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (url: string) => {
    setStep('analyzing');
    setError(null);
    setProgress({ message: 'Starting analysis...', percentage: 0 });

    try {
      // Use streaming endpoint for real-time progress
      const response = await fetch('/api/analyze-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      let analysisResult: AnalysisResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('event:')) {
            const eventType = line.replace('event:', '').trim();
            const dataLine = lines[lines.indexOf(line) + 1];

            if (dataLine?.startsWith('data:')) {
              const data = JSON.parse(dataLine.replace('data:', '').trim());

              if (eventType === 'progress') {
                setProgress({
                  message: data.message,
                  percentage: Math.round((data.step / 6) * 50), // First half is analysis
                });
              } else if (eventType === 'complete') {
                analysisResult = data;
              } else if (eventType === 'error') {
                throw new Error(data.error);
              }
            }
          }
        }
      }

      if (!analysisResult) {
        throw new Error('No analysis result received');
      }

      setAnalysisData(analysisResult);

      // Now generate brand guidelines
      await handleGenerate(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('input');
    }
  }, []);

  const handleGenerate = useCallback(async (analysis: AnalysisResult) => {
    setStep('generating');
    setProgress({ message: 'Generating brand guidelines...', percentage: 50 });

    try {
      const response = await fetch('/api/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisData: analysis }),
      });

      if (!response.ok) {
        throw new Error('Failed to start generation');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      let brandResult: CompleteBrandData | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('event:')) {
            const eventType = line.replace('event:', '').trim();
            const dataLine = lines[lines.indexOf(line) + 1];

            if (dataLine?.startsWith('data:')) {
              const data = JSON.parse(dataLine.replace('data:', '').trim());

              if (eventType === 'progress') {
                setProgress({
                  message: data.message,
                  percentage: 50 + Math.round((data.step / 7) * 50), // Second half is generation
                });
              } else if (eventType === 'complete') {
                brandResult = data;
              } else if (eventType === 'error') {
                throw new Error(data.error);
              }
            }
          }
        }
      }

      if (!brandResult) {
        throw new Error('No brand data received');
      }

      setBrandData(brandResult);
      setStep('preview');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('input');
    }
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!brandData) return;

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandData.brandName.replace(/[^a-z0-9]/gi, '-')}-brand-guidelines.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  }, [brandData]);

  const handleReset = () => {
    setStep('input');
    setProgress({ message: '', percentage: 0 });
    setAnalysisData(null);
    setBrandData(null);
    setError(null);
  };

  // Preview step - show the full preview
  if (step === 'preview' && brandData) {
    return (
      <div className="relative">
        <div className="fixed left-4 top-4 z-50">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={handleReset}
          >
            New Brief
          </Button>
        </div>
        <PreviewContainer brandData={brandData} onDownloadPDF={handleDownloadPDF} />
      </div>
    );
  }

  // Input and progress steps
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-[#f1f3f8]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066ff]">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-lg font-semibold text-[#070d59]">
              Creative Brief Builder
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-[#070d59] md:text-5xl">
            Generate Brand Guidelines
            <br />
            <span className="text-[#0066ff]">in Minutes</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#070d59]/60">
            Enter any website URL and our AI will analyze it to create a comprehensive
            brand guidelines document — complete with colors, typography, messaging, and more.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-auto mb-8 max-w-2xl rounded-lg bg-red-50 p-4 text-center text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={handleReset}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Form or Progress */}
        {step === 'input' && (
          <UrlInputForm onSubmit={handleAnalyze} />
        )}

        {(step === 'analyzing' || step === 'generating') && (
          <ProgressDisplay
            currentStep={step}
            message={progress.message}
            percentage={progress.percentage}
            steps={[
              { id: 'fetch', label: 'Fetching website content', status: 'pending' },
              { id: 'colors', label: 'Extracting color palette', status: 'pending' },
              { id: 'fonts', label: 'Detecting typography', status: 'pending' },
              { id: 'logos', label: 'Finding brand assets', status: 'pending' },
              { id: 'content', label: 'Analyzing messaging', status: 'pending' },
              { id: 'strategy', label: 'Creating brand strategy', status: 'pending' },
              { id: 'messaging', label: 'Building messaging framework', status: 'pending' },
              { id: 'voice', label: 'Defining voice & tone', status: 'pending' },
              { id: 'visual', label: 'Finalizing visual guidelines', status: 'pending' },
            ]}
          />
        )}

        {/* Features */}
        {step === 'input' && (
          <div className="mt-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-[#070d59]">
              What You'll Get
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Brand Strategy',
                  description: 'Positioning, mission, vision, and personality traits tailored to your brand',
                },
                {
                  title: 'Messaging Framework',
                  description: 'Value propositions, key messages, and elevator pitches for every audience',
                },
                {
                  title: 'Visual Guidelines',
                  description: 'Color palette, typography, and logo usage rules extracted from your site',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-6 shadow-xl shadow-[#070d59]/5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0066ff]/10 text-xl font-bold text-[#0066ff]">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#070d59]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#070d59]/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-[#070d59]/50">
          <p>Powered by Claude AI. Built with Next.js.</p>
        </div>
      </footer>
    </main>
  );
}
