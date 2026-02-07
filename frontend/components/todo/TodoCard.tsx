'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Todo } from '@/lib/types';
import { CheckCircle2, Trash2, Edit3, Calendar, Clock, Tag, AlertTriangle } from 'lucide-react';

export interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  index?: number;
}

const TodoCard = ({ todo, onToggle, onDelete, onEdit, index = 0 }: TodoCardProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(todo.id);
    }, 300);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  // Priority badge styling
  const getPriorityClasses = (priority: string = 'Medium') => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Format due date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString; // Return original string if parsing fails
    }
  };

  // Check if task is overdue
  const isOverdue = todo.isOverdue;

  return (
    <div
      className={cn(
        'w-full group relative glass-premium rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 shadow-md dark:shadow-lg',
        todo.completed && 'opacity-60 bg-muted/20',
        isOverdue && !todo.completed && 'ring-2 ring-red-500/50',
        isDeleting && 'opacity-0 scale-95'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Status Indicator & Title */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={handleToggle}
              className={cn(
                'mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300',
                todo.completed
                  ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20'
                  : 'border-muted-foreground/30 hover:border-primary group-hover:scale-105'
              )}
            >
              {todo.completed && <CheckCircle2 className="w-4 h-4" />}
            </button>
            <div className="min-w-0">
              <h3 className={cn(
                'text-lg font-bold tracking-tight transition-all duration-300',
                todo.completed && 'line-through opacity-50',
                isOverdue && !todo.completed && 'text-red-400'
              )}>
                {todo.title}
                {isOverdue && !todo.completed && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs bg-red-500/20 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    OVERDUE
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="w-8 h-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="w-8 h-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p className={cn(
            'body text-sm mb-4 line-clamp-2 opacity-70 group-hover:opacity-100 transition-opacity',
            todo.completed && 'line-through opacity-40'
          )}>
            {todo.description}
          </p>
        )}

        {/* Priority and Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Priority Badge */}
          {todo.priority && (
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
              getPriorityClasses(todo.priority)
            )}>
              <AlertTriangle className="w-3 h-3" />
              {todo.priority}
            </span>
          )}

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {todo.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Due Date */}
        {todo.dueDate && (
          <div className={cn(
            'flex items-center gap-2 mb-4 text-sm',
            isOverdue && !todo.completed ? 'text-red-400' : 'text-muted-foreground'
          )}>
            <Calendar className="w-4 h-4" />
            <span>Due: {formatDate(todo.dueDate)}</span>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-ui-border/50 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest opacity-50">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {new Date(todo.createdAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { TodoCard };
