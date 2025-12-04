import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

export function CategoryCard({ category, onClick, viewMode = 'grid' }: CategoryCardProps) {
  // Use emoji directly - fallback to 📁 if no icon set
  const emoji = category.icon || '📁';

  if (viewMode === 'list') {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
          <span className="text-2xl">{emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.subcategories.length} subcategories</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 hover:shadow-soft transition-all duration-200"
    >
      <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900">{category.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{category.subcategories.length} subcategories</p>
      </div>
    </button>
  );
}
