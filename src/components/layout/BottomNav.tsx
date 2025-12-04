import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-nav">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 px-4 py-2',
                'transition-colors duration-200 min-w-[80px]',
                isActive ? 'text-accent' : 'text-gray-600 hover:text-gray-900'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
