'use client';

import { CheckCircle, Loader2, Circle } from 'lucide-react';
import { Card, Progress } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

interface ProgressDisplayProps {
  currentStep: string;
  message: string;
  percentage: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { id: 'fetch', label: 'Fetching website', status: 'pending' },
  { id: 'colors', label: 'Extracting colors', status: 'pending' },
  { id: 'fonts', label: 'Detecting typography', status: 'pending' },
  { id: 'logos', label: 'Finding logos', status: 'pending' },
  { id: 'content', label: 'Analyzing content', status: 'pending' },
  { id: 'generate', label: 'Generating guidelines', status: 'pending' },
];

export function ProgressDisplay({
  currentStep,
  message,
  percentage,
  steps = defaultSteps,
}: ProgressDisplayProps) {
  // Update step statuses based on percentage
  const getStepStatus = (index: number): 'pending' | 'active' | 'complete' => {
    const stepPercentage = ((index + 1) / steps.length) * 100;
    if (percentage >= stepPercentage) return 'complete';
    if (percentage >= (index / steps.length) * 100) return 'active';
    return 'pending';
  };

  return (
    <Card variant="elevated" padding="lg" className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center">
          <div className="relative">
            <div className="h-16 w-16 animate-pulse rounded-full bg-[#0066ff]/20" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-[#0066ff]" />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold text-[#070d59]">
          {message || 'Processing...'}
        </h2>
        <p className="text-sm text-[#070d59]/60">
          This may take a few minutes
        </p>
      </div>

      <div className="mb-6">
        <Progress value={percentage} max={100} variant="gradient" size="md" />
        <p className="mt-2 text-center text-sm font-medium text-[#070d59]">
          {percentage}% complete
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index);

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2 transition-colors',
                status === 'active' && 'bg-[#0066ff]/5',
                status === 'complete' && 'bg-green-50'
              )}
            >
              {status === 'complete' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status === 'active' ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#0066ff]" />
              ) : (
                <Circle className="h-5 w-5 text-[#070d59]/20" />
              )}
              <span
                className={cn(
                  'text-sm',
                  status === 'complete' && 'text-green-700',
                  status === 'active' && 'font-medium text-[#0066ff]',
                  status === 'pending' && 'text-[#070d59]/40'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
