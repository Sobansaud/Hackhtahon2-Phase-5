import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * T020-T023: Input Component
 * Flagship UI input with focus glow, inner shadow, and error state
 *
 * Zero third-party libraries - uses only Tailwind CSS utilities and native CSS transitions
 */

/**
 * Input component props
 * Extends standard HTML input attributes with custom props
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input component
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errorMessage}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   label="Password"
 *   type="password"
 *   helperText="Must be at least 8 characters"
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, helperText, leftIcon, rightIcon, disabled, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className="w-full group">
        {/* Label */}
        {label && (
          <label
            className={cn(
              'block text-sm font-medium mb-2 transition-all duration-200 ease-out-cubic transform-gpu',
              // subtle float/scale when input focused
              'group-focus-within:-translate-y-0.5 group-focus-within:scale-95',
              hasError
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-700 dark:text-slate-300 group-focus-within:text-primary'
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper for icons */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            type={type}
            className={cn(
              /**
               * T020: Base input component with TypeScript interface
               */
              'flex w-full rounded-xl border px-4 py-2 text-base transition-all duration-300 ease-out-cubic',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Typography
              'text-slate-900 bg-white dark:text-slate-100 dark:bg-slate-800',
              // T021: Focus glow - ring-2 ring-indigo-500/20
              'focus:outline-none focus:ring-2',
              hasError
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20',
              // T022: Inner shadow for depth - inset shadow for visual recession
              'shadow-[inset_0_2px_4px_0_rgb(0_0_0_/_0.05)] focus:shadow-none',
              'dark:shadow-[inset_0_2px_4px_0_rgb(0_0_0_/_0.3)]',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* T023: Error state - rose-500 border and ring with clear messaging */}
        {hasError && (
          <p
            id={`${props.id}-error`}
            className="mt-2 text-sm text-rose-600 dark:text-rose-400 transition-colors duration-300 ease-out-cubic"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !hasError && (
          <p
            id={`${props.id}-helper`}
            className="mt-2 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300 ease-out-cubic"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
