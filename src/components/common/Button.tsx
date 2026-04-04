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
    'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 disabled:from-primary-300 disabled:to-primary-300 disabled:text-white/70 shadow-md shadow-primary-400/20',
  secondary:
    'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500 disabled:from-secondary-300 disabled:to-secondary-300 disabled:text-white/70 shadow-md shadow-secondary-400/20',
  outline:
    'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-400 disabled:text-gray-400 border-2 border-primary-400 hover:border-primary-500',
  danger:
    'bg-gradient-to-r from-severity-severe to-severity-critical text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 disabled:from-red-300 disabled:to-red-300 shadow-md shadow-red-400/20',
  accent:
    'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 disabled:from-accent-300 disabled:to-accent-300 shadow-md shadow-accent-400/20',
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
      className={`inline-flex items-center justify-center gap-2.5 font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed min-w-[48px] hover:-translate-y-0.5 active:scale-[0.97] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!isLoading && Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      {children}
    </button>
  );
}
