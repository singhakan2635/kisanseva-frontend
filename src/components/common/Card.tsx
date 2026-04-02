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
    'bg-white/80 backdrop-blur-sm shadow-sm border border-white/40 hover:shadow-md transition-all duration-200',
  flat:
    'bg-white/50 border border-gray-100/60',
  elevated:
    'bg-white/90 backdrop-blur-sm shadow-md border border-white/50 hover:shadow-lg transition-all duration-200',
  outlined:
    'bg-white/60 border border-gray-200 hover:border-primary-200 transition-all duration-200',
  status:
    'bg-white/80 backdrop-blur-sm shadow-sm border border-white/40 hover:shadow-md transition-all duration-200',
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
      className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${statusBorder} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {(title || subtitle) && (
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100/50">
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      <div className={noPadding ? '' : 'px-4 py-4 sm:px-6 sm:py-5'}>{children}</div>

      {footer && (
        <div className="px-4 py-3 sm:px-6 bg-white/50 border-t border-gray-100/50">{footer}</div>
      )}
    </div>
  );
}
