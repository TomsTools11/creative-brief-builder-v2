'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      showLabel = false,
      size = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const variants = {
      default: 'bg-[#0066ff]',
      gradient: 'bg-gradient-to-r from-[#0066ff] to-[#00ccff]',
    };

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        <div
          className={cn(
            'w-full overflow-hidden rounded-full bg-[#d6e0f0]',
            sizes[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-2 flex justify-between text-sm text-[#070d59]/70">
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
