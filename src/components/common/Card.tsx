import type { ReactNode } from 'react';

type CardVariant = 'default' | 'flat' | 'elevated' | 'outlined' | 'status';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  variant?: CardVariant;
  statusColor?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white/80 backdrop-blur-sm shadow-lg shadow-earth-200/50 border border-earth-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
  flat:
    'bg-white/80 backdrop-blur-sm border border-earth-100',
  elevated:
    'bg-white/80 backdrop-blur-sm shadow-xl shadow-earth-200/60 border border-earth-100 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300',
  outlined:
    'bg-white/80 backdrop-blur-sm border-2 border-earth-200 hover:border-primary-300 transition-all duration-300',
  status:
    'bg-white/80 backdrop-blur-sm shadow-lg shadow-earth-200/50 border border-earth-100 hover:shadow-xl transition-all duration-300',
};

export function Card({
  title,
  subtitle,
  children,
  footer,
  className = '',
  variant = 'default',
  statusColor,
  noPadding = false,
  onClick,
}: CardProps) {
  const statusBorder = variant === 'status' && statusColor ? `border-l-4 ${statusColor}` : '';

  return (
    <div
      className={`rounded-2xl overflow-hidden ${variantClasses[variant]} ${statusBorder} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {(title || subtitle) && (
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-earth-100">
          {title && <h3 className="text-lg font-semibold text-earth-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-base text-earth-500">{subtitle}</p>}
        </div>
      )}

      <div className={noPadding ? '' : 'px-5 py-5 sm:px-6 sm:py-6'}>{children}</div>

      {footer && (
        <div className="px-5 py-4 sm:px-6 bg-earth-50/80 border-t border-earth-100">{footer}</div>
      )}
    </div>
  );
}
