import { Inbox, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: EmptyStateProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl mb-3">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600 mb-0.5">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
        {actionLabel && onAction && (
          <Button variant="outline" size="sm" onClick={onAction} className="mt-3">
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
      <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl mb-5">
        <Icon className="w-8 h-8 text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
