import * as React from 'react';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

/**
 * T033-T036: ThemeToggle Component
 * Toggle between light and dark themes with smooth transition and icon animation
 *
 * Zero third-party libraries - uses only Tailwind CSS utilities and native CSS transitions
 */

/**
 * ThemeToggle component props
 */
export interface ThemeToggleProps {
  position?: 'header' | 'settings';
  showLabel?: boolean;
  className?: string;
}

/**
 * ThemeToggle component
 *
 * @example
 * ```tsx
 * <ThemeToggle position="header" />
 * ```
 *
 * @example
 * ```tsx
 * <ThemeToggle showLabel />
 * ```
 */
const ThemeToggle = ({ position = 'header', showLabel = false, className }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  /**
   * T036: Theme toggle logic
   * Switch between 'light' and 'dark' with smooth transition
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  /**
   * T034: Sun/Moon icons (stroke-based, 24x24)
   * Sun icon (shown in dark mode)
   */
  const sunIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  /**
   * T034: Moon icon (shown in light mode)
   */
  const moonIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );

  /**
   * T035: Hover animation on icon
   * Subtle fill or path animation on hover
   * Micro-lift (200-300ms) with ease-out-cubic
   */
  const buttonClasses = cn(
    // Base styles
    'inline-flex items-center justify-center',
    // T034: Classes for light theme
    'bg-white border border-slate-200 rounded-xl p-2',
    // T034: Classes for dark theme
    'dark:bg-slate-800 dark:border-slate-700',
    // Hover state
    'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600',
    // T035: Hover micro-lift animation (200-300ms ease-out-cubic)
    'hover:-translate-y-0.5 transition-all duration-300 ease-out-cubic',
    // Focus state
    'focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2',
    // Active state
    'active:translate-y-0 active:shadow-sm',
    // Position-specific adjustments
    position === 'header' ? 'shadow-sm' : '',
    className
  );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={buttonClasses}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Show opposite theme icon */}
      {theme === 'dark' ? sunIcon : moonIcon}

      {/* Optional label */}
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {theme === 'light' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

export { ThemeToggle };
