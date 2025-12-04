import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'px-4 py-2.5 rounded-lg border',
          'text-base text-gray-900 placeholder-gray-400',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 hover:border-gray-400',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'min-h-touch', // Mobile touch target
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx(
          'px-4 py-2.5 rounded-lg border',
          'text-base text-gray-900 placeholder-gray-400',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          'resize-none', // Prevent manual resizing
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 hover:border-gray-400',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
