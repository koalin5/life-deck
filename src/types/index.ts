// Entry label types
export type EntryLabel = 'note' | 'synthesis' | 'plan' | 'assessment';

// View mode types
export type ViewMode = 'grid' | 'list';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Prompt type for generation
export type PromptType = 'evaluation' | 'planning' | 'synthesis';

// Entry interface
export interface Entry {
  id: string;
  title: string;
  content: string;
  categoryId?: string | null; // For category-level notes
  subcategoryId: string | null; // null = inbox or category-level note
  label: EntryLabel;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Prompt templates for each subcategory
export interface PromptTemplates {
  evaluation: string;
  planning: string;
  synthesis: string;
}

// Subcategory interface
export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  order: number;
  promptTemplates: PromptTemplates;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  icon: string; // emoji or lucide icon name
  order: number;
  subcategories: Subcategory[];
}

// App settings
export interface Settings {
  viewMode: ViewMode;
  theme: Theme;
  hasCompletedOnboarding: boolean;
}

// Complete app state
export interface AppState {
  categories: Category[];
  entries: Entry[];
  settings: Settings;
  version?: number; // For migration purposes
}

// Search filter options
export interface SearchFilters {
  label?: EntryLabel;
  categoryId?: string;
  subcategoryId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Context for AppContext provider
export interface AppContextType {
  state: AppState;
  // Categories
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  // Subcategories
  addSubcategory: (categoryId: string, subcategory: Omit<Subcategory, 'id' | 'order' | 'categoryId'>) => void;
  updateSubcategory: (id: string, updates: Partial<Subcategory>) => void;
  deleteSubcategory: (id: string) => void;
  getSubcategoryById: (id: string) => Subcategory | undefined;
  // Entries
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<Omit<Entry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => Entry | undefined;
  getEntriesBySubcategory: (subcategoryId: string) => Entry[];
  getRecentEntries: (limit?: number) => Entry[];
  getInboxEntries: () => Entry[];
  searchEntries: (query: string, filters?: SearchFilters) => Entry[];
  // Settings
  updateSettings: (updates: Partial<Settings>) => void;
  // Utilities
  clearAllData: () => void;
  resetToDefaults: () => void;
}
