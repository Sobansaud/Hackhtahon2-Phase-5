'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * T073-T077: Toast Component with Context/Hook
 * Toast notifications with entrance/exit animations and auto-dismissal
 *
 * Zero third-party libraries - uses only Tailwind CSS utilities and native CSS transitions
 */

/**
 * Toast type from design-system.md
 */
export type ToastType = 'success' | 'error' | 'info';

/**
 * Toast entity
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Default 3000ms
}

/**
 * Toast context interface
 */
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

/**
 * Toast Context
 */
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProvider component
 * Manages toast state with auto-dismissal
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration
    if (newToast.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useToast hook
 *
 * @example
 * ```tsx
 * const { addToast, removeToast } = useToast();
 * addToast({ type: 'success', message: 'Todo created successfully!' });
 * ```
 */
export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/**
 * ToastComponent props
 */
interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

/**
 * T073-T076: Toast Component
 * Variants (success, error, info) with color schemes per design-system.md
 * Entrance: translate-y-8 to 0, opacity 0 to 1 (300ms ease-out-cubic)
 * Exit: opacity 1 to 0 (200ms ease-in)
 */
function ToastComponent({ toast, onRemove }: ToastComponentProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    if (isExiting) {
      // Wait for exit animation (200ms)
      setTimeout(() => {
        onRemove(toast.id);
      }, 200);
    }
  }, [isExiting, toast.id, onRemove]);

  const handleDismiss = () => {
    setIsExiting(true);
  };

  /**
   * T074: Toast variants with color schemes from design-system.md
   */
  const variantClasses: Record<ToastType, string> = {
    // Success: emerald colors
    success:
      'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-100',
    // Error: rose colors
    error:
      'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-100',
    // Info: slate colors
    info:
      'bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100',
  };

  /**
   * Icon based on toast type
   * SVG stroke-based (2px stroke, 24x24)
   */
  const icons = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-rose-600 dark:text-rose-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-slate-500 dark:text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        /**
         * T073: Layout - rounded-xl p-4 shadow-lg glass
         * Flex row: icon (left), text (center), dismiss button (right)
         * Position: Bottom-center, 24px from edge
         */
        'flex items-center gap-3 rounded-xl p-4 shadow-lg glass',
        // T074: Variant classes
        variantClasses[toast.type],
        // T075-T076: Entrance/exit animations
        isExiting
          ? 'animate-[toastExit_200ms_ease-in]'
          : 'animate-[toastEnter_300ms_ease-out]'
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="flex-shrink-0">{icons[toast.type]}</div>

      {/* Message */}
      <p className="flex-1 text-base font-medium">{toast.message}</p>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Dismiss notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
