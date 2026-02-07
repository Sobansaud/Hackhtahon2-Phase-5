import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * T050-T057: Typography Components
 * Flagship UI typography scale with perfect hierarchy, rhythm, and readability
 *
 * Zero third-party libraries - uses only Tailwind CSS utilities
 */

/**
 * T050: Create Typography components (H1, H2, H3, H4, Body, Small, Tiny)
 * From design-system.md with exact specifications
 */

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * H1 - Hero titles: 40px (2.5rem), weight 800, tight tracking
 * T051: Apply heading weights (700-800) with tight letter-spacing
 */
export const H1 = ({ children, className }: HeadingProps) => (
  <h1 className={cn('h1 text-slate-900 dark:text-slate-50', className)}>
    {children}
  </h1>
);

/**
 * H2 - Page titles: 32px (2rem), weight 700, tight tracking
 */
export const H2 = ({ children, className }: HeadingProps) => (
  <h2 className={cn('h2 text-slate-900 dark:text-slate-50', className)}>
    {children}
  </h2>
);

/**
 * H3 - Section headers: 24px (1.5rem), weight 600, tight tracking
 */
export const H3 = ({ children, className }: HeadingProps) => (
  <h3 className={cn('h3 text-slate-900 dark:text-slate-50', className)}>
    {children}
  </h3>
);

/**
 * H4 - Subsection headers: 20px (1.25rem), weight 600, tight tracking
 */
export const H4 = ({ children, className }: HeadingProps) => (
  <h4 className={cn('h4 text-slate-900 dark:text-slate-50', className)}>
    {children}
  </h4>
);

/**
 * Body - Body text: 16px (1rem), weight 400, 1.7 line-height
 * T052: Apply 1.7 line-height to Body and Small typography components
 */
export const Body = ({ children, className }: TextProps) => (
  <p className={cn('body text-slate-900 dark:text-slate-50', className)}>
    {children}
  </p>
);

/**
 * Small - Small text: 14px (0.875rem), weight 400, 1.5 line-height
 */
export const Small = ({ children, className }: TextProps) => (
  <p className={cn('small text-slate-700 dark:text-slate-300', className)}>
    {children}
  </p>
);

/**
 * Tiny - Tiny text: 12px (0.75rem), weight 500, 1.33 line-height
 */
export const Tiny = ({ children, className }: TextProps) => (
  <p className={cn('tiny text-slate-500 dark:text-slate-400', className)}>
    {children}
  </p>
);

/**
 * T053: Apply text opacity hierarchy to secondary/tertiary text
 * Reusable components for opacity variants
 */
export const TextSecondary = ({ children, className }: TextProps) => (
  <p className={cn('body text-secondary', className)}>
    {children}
  </p>
);

export const TextTertiary = ({ children, className }: TextProps) => (
  <p className={cn('body text-tertiary', className)}>
    {children}
  </p>
);
