import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Settings, Search } from 'lucide-react';
import { clsx } from 'clsx';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/home';
  const isOnboarding = location.pathname === '/onboarding';

  // Determine title based on route
  const getTitle = () => {
    if (location.pathname === '/home') return 'Life Deck';
    if (location.pathname === '/search') return 'Search';
    if (location.pathname === '/settings') return 'Settings';
    if (location.pathname.startsWith('/entry')) return 'Entry';
    return 'Life Deck';
  };

  if (isOnboarding) return null;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3 flex-1">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className={clsx('text-xl font-semibold text-gray-900', !isHome && 'ml-0')}>
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {isHome && (
          <>
            <button
              onClick={() => navigate('/search')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
