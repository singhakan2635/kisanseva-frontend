import { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: LucideIcon;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500 disabled:bg-primary-300 disabled:text-white/70 shadow-sm',
  secondary:
    'bg-white text-primary-800 hover:bg-primary-50 focus:ring-primary-400 disabled:bg-gray-100 disabled:text-gray-400 border-2 border-primary-300',
  outline:
    'bg-transparent text-primary-700 hover:bg-primary-50 focus:ring-primary-400 disabled:text-gray-400 border-2 border-primary-400',
  danger:
    'bg-severity-severe text-white hover:bg-severity-critical focus:ring-red-500 disabled:bg-red-300 shadow-sm',
  accent:
    'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 disabled:bg-accent-300 shadow-sm',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[48px] px-4 py-2 text-base',
  md: 'min-h-[56px] px-5 py-3 text-base',
  lg: 'min-h-[64px] px-8 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2.5 font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed min-w-[48px] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!isLoading && Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      {children}
    </button>
  );
}
