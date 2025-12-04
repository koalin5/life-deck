import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  autoFocus = false,
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={clsx('relative', className)}>
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>

      {/* Input */}
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={clsx(
          'w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300',
          'text-base text-gray-900 placeholder-gray-400',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
          'hover:border-gray-400',
          'min-h-touch'
        )}
      />

      {/* Clear button */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
