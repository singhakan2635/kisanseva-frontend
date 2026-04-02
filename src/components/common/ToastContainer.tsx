import { useToast } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { ToastType } from '@/contexts/ToastContext';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<ToastType, LucideIcon> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', text: 'text-emerald-800' },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', text: 'text-red-800' },
  info: { bg: 'bg-primary-50', border: 'border-primary-200', icon: 'text-primary-500', text: 'text-primary-800' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', text: 'text-amber-800' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        const colors = colorMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${colors.bg} ${colors.border} ${
              toast.exiting ? 'animate-toast-exit' : 'animate-toast-enter'
            }`}
            role="alert"
          >
            <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${colors.text}`}>{toast.title}</p>
              {toast.message && (
                <p className={`text-sm mt-0.5 ${colors.text} opacity-80`}>{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
