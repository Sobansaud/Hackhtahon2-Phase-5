import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * T048: SkeletonCard Component
 * Loading state with sophisticated shimmer animation
 *
 * Zero third-party libraries - uses only Tailwind CSS utilities and native CSS animations
 */

/**
 * SkeletonCard component props
 */
export interface SkeletonCardProps {
  className?: string;
}

/**
 * SkeletonCard component
 *
 * @example
 * ```tsx
 * <SkeletonCard />
 * ```
 *
 * @example
 * ```tsx
 * <div className="space-y-4">
 *   {Array.from({ length: 3 }).map((_, i) => (
 *     <SkeletonCard key={i} />
 *   ))}
 * </div>
 * ```
 */
const SkeletonCard = ({ className }: SkeletonCardProps) => {
  return (
    <div
      className={cn(
        /**
         * T048: SkeletonCard visual specifications from design-system.md
         */
        'card bg-white p-6 h-48 dark:bg-slate-800', // Increased height to accommodate new features
        'border border-slate-100 dark:border-slate-700',
        className
      )}
    >
      <div className="space-y-4">
        {/* Status and Title shimmer */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Checkbox shimmer */}
            <div
              className={cn(
                'mt-1 w-6 h-6 rounded-lg border',
                'bg-slate-100 dark:bg-slate-700',
                'animate-shimmer'
              )}
            />

            {/* Title shimmer */}
            <div
              className={cn(
                'h-6 w-3/4 rounded-lg',
                /**
                 * T048: Shimmer animation (1.5s infinite)
                 * From design-system.md with gradient background
                 */
                'bg-slate-100 dark:bg-slate-700',
                'animate-shimmer'
              )}
            />
          </div>

          {/* Action buttons shimmer */}
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 animate-shimmer" />
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 animate-shimmer" />
          </div>
        </div>

        {/* Description shimmer */}
        <div
          className={cn(
            'h-4 w-full rounded-lg',
            'bg-slate-100 dark:bg-slate-700',
            'animate-shimmer animate-delay-100'
          )}
        />

        {/* Priority and Tags shimmer */}
        <div className="flex flex-wrap gap-2">
          {/* Priority badge shimmer */}
          <div
            className={cn(
              'h-6 w-20 rounded-full',
              'bg-slate-100 dark:bg-slate-700',
              'animate-shimmer animate-delay-150'
            )}
          />

          {/* Tags shimmer */}
          <div className="flex flex-wrap gap-1">
            <div
              className={cn(
                'h-6 w-16 rounded-full',
                'bg-slate-100 dark:bg-slate-700',
                'animate-shimmer animate-delay-200'
              )}
            />
            <div
              className={cn(
                'h-6 w-12 rounded-full',
                'bg-slate-100 dark:bg-slate-700',
                'animate-shimmer animate-delay-250'
              )}
            />
          </div>
        </div>

        {/* Due date shimmer */}
        <div
          className={cn(
            'h-4 w-24 rounded-lg',
            'bg-slate-100 dark:bg-slate-700',
            'animate-shimmer animate-delay-300'
          )}
        />

        {/* Footer info shimmer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div
            className={cn(
              'h-3 w-16 rounded-lg',
              'bg-slate-100 dark:bg-slate-700',
              'animate-shimmer animate-delay-350'
            )}
          />
          <div
            className={cn(
              'h-3 w-12 rounded-lg',
              'bg-slate-100 dark:bg-slate-700',
              'animate-shimmer animate-delay-400'
            )}
          />
        </div>
      </div>
    </div>
  );
};

export { SkeletonCard };
