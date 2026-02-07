import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Sparkles, Search, CheckCircle2, Inbox } from 'lucide-react';

export type EmptyStateType = 'no-todos' | 'no-results' | 'all-complete';

export interface EmptyStateProps {
  type: EmptyStateType;
  title: string;
  description: string;
  cta?: {
    text: string;
    action: () => void;
  };
  className?: string;
}

const EmptyState = ({
  type = 'no-todos',
  title,
  description,
  cta,
  className,
}: EmptyStateProps) => {
  const getIcon = () => {
    switch (type) {
      case 'all-complete':
        return <CheckCircle2 className="w-12 h-12 text-primary" />;
      case 'no-results':
        return <Search className="w-12 h-12 text-muted-foreground" />;
      default:
        return <Inbox className="w-12 h-12 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-20 px-6 text-center animate-welcome',
      className
    )}>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 rounded-[2rem] glass-premium flex items-center justify-center border border-white/20 animate-float">
          {getIcon()}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h2 className="h3 mb-3">{title}</h2>
      <p className="body max-w-sm mb-10 opacity-70">
        {description}
      </p>

      {cta && (
        <Button
          variant="primary"
          size="lg"
          onClick={cta.action}
          className="px-8 h-12 rounded-2xl font-bold shadow-xl shadow-primary/20"
        >
          {cta.text}
        </Button>
      )}
    </div>
  );
};

export { EmptyState };
