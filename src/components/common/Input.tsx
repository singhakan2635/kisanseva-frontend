import { type InputHTMLAttributes, forwardRef } from 'react';

type InputVariant = 'default' | 'phone';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  wrapperClassName?: string;
  variant?: InputVariant;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, wrapperClassName = '', className = '', id, variant = 'default', hint, ...rest }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    const baseInputClasses = `w-full min-h-[56px] px-4 py-3 border-2 rounded-2xl text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-earth-400 ${
      error
        ? 'border-severity-severe focus:ring-severity-severe focus:border-severity-severe bg-red-50/30'
        : 'border-earth-300 hover:border-primary-400 bg-white'
    }`;

    return (
      <div className={wrapperClassName}>
        <label
          htmlFor={inputId}
          className="block text-base font-semibold text-earth-800 mb-1.5"
        >
          {label}
        </label>

        {variant === 'phone' ? (
          <div className="flex">
            <span className="inline-flex items-center min-h-[56px] px-4 text-lg font-medium text-earth-700 bg-earth-100 border-2 border-r-0 border-earth-300 rounded-l-2xl select-none">
              +91
            </span>
            <input
              ref={ref}
              id={inputId}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className={`${baseInputClasses} rounded-l-none ${className}`}
              {...rest}
            />
          </div>
        ) : (
          <input
            ref={ref}
            id={inputId}
            className={`${baseInputClasses} ${className}`}
            {...rest}
          />
        )}

        {hint && !error && (
          <p className="mt-1.5 text-sm text-earth-500">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm font-medium text-severity-severe" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
