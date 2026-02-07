'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * Theme type definition
 * - 'light': Explicit light theme preference
 * - 'dark': Explicit dark theme preference
 * - 'system': Follow system preference
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme context interface
 * Provides theme state and setter function
 */
interface ThemeContextType {
  /** Current resolved theme ('light' or 'dark') */
  theme: 'light' | 'dark';
  /** Set theme preference ('light', 'dark', or 'system') */
  setTheme: (theme: Theme) => void;
}

/**
 * Theme context for global theme state management
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component properties
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider - Client component that manages theme state
 *
 * Theme detection priority:
 * 1. localStorage saved preference (if exists)
 * 2. System preference (prefers-color-scheme)
 * 3. Fallback to 'light'
 *
 * @param props - Component props
 * @returns Theme context provider
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Priority 1: Check localStorage for saved preference
    const stored = localStorage.getItem('theme') as Theme | null;

    // Priority 2: Get system preference
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    // Resolve theme: stored → system → fallback
    const resolved = stored === 'system' ? system : (stored || system);

    setThemeState(resolved);

    // Apply dark class to html element for Tailwind dark mode
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, []);

  /**
   * Set theme preference and persist to localStorage
   * @param newTheme - Theme preference to set
   */
  const setTheme = (newTheme: Theme) => {
    // Save to localStorage for persistence across sessions
    localStorage.setItem('theme', newTheme);

    // Resolve final theme
    const resolved =
      newTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : newTheme;

    setThemeState(resolved);

    // Apply to DOM for Tailwind dark mode
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  };



  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme hook
 *
 * Provides access to theme state and setter function
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme();
 * console.log(theme); // 'light' | 'dark'
 * setTheme('dark'); // Switch to dark mode
 * ```
 *
 * @throws Error if used outside ThemeProvider
 * @returns Theme context value
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
