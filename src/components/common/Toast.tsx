import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

export function Toast({
  message,
  variant = 'info',
  position = 'bottom',
  duration = 3000,
  onClose,
  isVisible,
}: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }[variant];

  return (
    <div
      className={clsx(
        'fixed left-1/2 -translate-x-1/2 z-50',
        'px-6 py-4 rounded-lg shadow-elevated',
        'flex items-center gap-3 min-w-[320px] max-w-md',
        'animate-fade-in',
        {
          'top-6': position === 'top',
          'bottom-24': position === 'bottom', // Above bottom nav
        },
        {
          'bg-green-50 text-green-900 border border-green-200': variant === 'success',
          'bg-red-50 text-red-900 border border-red-200': variant === 'error',
          'bg-blue-50 text-blue-900 border border-blue-200': variant === 'info',
        }
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast hook for easy usage
export function useToast() {
  const [toast, setToast] = React.useState<{
    message: string;
    variant: ToastVariant;
    isVisible: boolean;
  } | null>(null);

  const show = (message: string, variant: ToastVariant = 'info') => {
    setToast({ message, variant, isVisible: true });
  };

  const hide = () => {
    setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
  };

  return {
    toast,
    showToast: show,
    hideToast: hide,
  };
}
