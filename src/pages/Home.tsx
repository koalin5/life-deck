import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid3x3, List } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useApp } from '../contexts/AppContext';
import { CategoryCard } from '../components/folders/CategoryCard';
import { QuickCaptureModal } from '../components/capture/QuickCaptureModal';

export function Home() {
  const navigate = useNavigate();
  const { state, updateSettings } = useApp();
  const [showQuickCapture, setShowQuickCapture] = useState(false);

  const viewMode = state.settings.viewMode;
  const categories = state.categories;

  const toggleViewMode = () => {
    updateSettings({ viewMode: viewMode === 'grid' ? 'list' : 'grid' });
  };

  return (
    <Layout hideBottomNavForModal={showQuickCapture}>
      <div className="px-6 py-6 space-y-6">
        {/* View toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggleViewMode}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          >
            {viewMode === 'grid' ? (
              <List className="w-5 h-5" />
            ) : (
              <Grid3x3 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Categories */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => navigate(`/category/${category.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => navigate(`/category/${category.id}`)}
                viewMode="list"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No categories yet. Get started by adding your first category!</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowQuickCapture(true)}
        className="fixed bottom-24 right-6 w-fab h-fab bg-accent hover:bg-accent-dark text-white rounded-full shadow-elevated hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center z-40"
        aria-label="Quick capture"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Quick capture modal */}
      <QuickCaptureModal
        isOpen={showQuickCapture}
        onClose={() => setShowQuickCapture(false)}
      />
    </Layout>
  );
}
