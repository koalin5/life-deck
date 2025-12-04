import React from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-medium rounded-lg transition-all duration-200',
        'touch-manipulation focus-visible-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Variant styles
        {
          // Primary
          'bg-accent text-white hover:bg-accent-dark active:scale-95':
            variant === 'primary' && !disabled,

          // Secondary
          'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95':
            variant === 'secondary' && !disabled,

          // Ghost
          'bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95':
            variant === 'ghost' && !disabled,

          // Danger
          'bg-red-500 text-white hover:bg-red-600 active:scale-95':
            variant === 'danger' && !disabled,
        },

        // Size styles
        {
          'text-sm px-3 py-2 min-h-[36px]': size === 'sm',
          'text-base px-4 py-2.5 min-h-touch': size === 'md',
          'text-lg px-6 py-3 min-h-[52px]': size === 'lg',
        },

        // Full width
        fullWidth && 'w-full',

        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
