import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * T024-T027: Modal Component
 * Flagship UI modal with backdrop blur, glassmorphism, and entrance animation
 *
 * Zero third-party libraries - uses only Tailwind CSS utilities and native CSS transitions
 */

/**
 * Modal component props
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

/**
 * Modal component
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={handleClose} title="Add Todo">
 *   <Modal.Content>
 *     <form>...</form>
 *   </Modal.Content>
 * </Modal>
 * ```
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'md',
      showCloseButton = true,
    },
    ref
  ) => {
    const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Handle escape key press
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen && !isAnimatingOut) {
          handleClose();
        }
      };

      if (isOpen) {
        window.addEventListener('keydown', handleEscape);
      }

      return () => {
        window.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen, isAnimatingOut]);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    // Handle close with animation
    const handleClose = () => {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsAnimatingOut(false);
        onClose();
      }, 200); // Wait for exit animation (200ms)
    };

    // Don't render if not open and not animating out
    if (!isOpen && !isAnimatingOut) return null;

    /**
     * Size classes for modal content
     */
    const sizeClasses: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    /**
     * T025: Modal backdrop
     * bg-slate-900/50 backdrop-blur-md per design-system.md
     * Fade animation: 200ms ease-out-cubic
     */
    const backdropClasses = cn(
      'fixed inset-0 z-50',
      // T025: Backdrop with blur
      'bg-slate-900/50 backdrop-blur-md',
      // Fade animation
      isAnimatingOut
        ? 'animate-[fadeOut_200ms_ease-in]'
        : 'animate-[fadeIn_200ms_ease-out]',
      'transition-all duration-200'
    );

    /**
     * T026: Modal content styling
     * rounded-2xl, shadow-xl/2xl, glassmorphism per design-system.md
     */
    const contentClasses = cn(
      'relative z-10 w-full mx-4',
      // T026: Content styling
      'bg-white rounded-2xl shadow-xl dark:bg-slate-800 dark:shadow-2xl',
      // Glassmorphism effect
      'border border-slate-100 dark:border-slate-700',
      sizeClasses[size],
      // T027: Entrance animation - scale 0.95→1, opacity 0→1, 300ms ease-out-cubic
      isAnimatingOut
        ? 'animate-[scaleOut_200ms_ease-in]'
        : 'animate-[scaleIn_300ms_ease-out]'
    );

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* T025: Modal backdrop with blur */}
        <div
          className={backdropClasses}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* T026: Modal content with glassmorphism */}
        <div ref={ref || contentRef} className={contentClasses} role="document">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-slate-100 px-8 pt-8 pb-4 dark:border-slate-700">
              <h2
                id="modal-title"
                className="text-2xl font-bold text-slate-900 dark:text-slate-50"
              >
                {title}
              </h2>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={handleClose}
                  className={cn(
                    'rounded-xl p-2 transition-all duration-300 ease-out-cubic',
                    'hover:bg-slate-100 dark:hover:bg-slate-700',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                    'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                  )}
                  aria-label="Close modal"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-8 py-6">{children}</div>
        </div>

        {/* Add animation keyframes via style for entrance/exit */}
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes scaleOut {
            from {
              opacity: 1;
              transform: scale(1);
            }
            to {
              opacity: 0;
              transform: scale(0.95);
            }
          }
        `}</style>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
