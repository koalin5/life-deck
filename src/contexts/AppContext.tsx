import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type {
  AppState,
  AppContextType,
  Category,
  Subcategory,
  Entry,
  SearchFilters,
} from '../types';
import { getOrInitializeState, saveState, clearState } from '../utils/storage';
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from '../data/defaults';
import { searchEntries as searchEntriesUtil } from '../utils/search';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => getOrInitializeState());

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Category operations
  const addCategory = useCallback((category: Omit<Category, 'id' | 'order'>) => {
    setState((prev) => {
      const maxOrder = Math.max(-1, ...prev.categories.map((c) => c.order));
      const categoryId = nanoid();

      // Generate IDs and orders for subcategories
      const subcategoriesWithIds = category.subcategories.map((sub, index) => ({
        ...sub,
        id: nanoid(),
        categoryId,
        order: index,
      }));

      const newCategory: Category = {
        ...category,
        id: categoryId,
        order: maxOrder + 1,
        subcategories: subcategoriesWithIds,
      };
      return {
        ...prev,
        categories: [...prev.categories, newCategory],
      };
    });
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setState((prev) => {
      // Also delete all subcategories and entries in this category
      const category = prev.categories.find((c) => c.id === id);
      if (!category) return prev;

      const subcategoryIds = category.subcategories.map((s) => s.id);

      return {
        ...prev,
        categories: prev.categories.filter((c) => c.id !== id),
        entries: prev.entries.filter(
          (e) => !e.subcategoryId || !subcategoryIds.includes(e.subcategoryId)
        ),
      };
    });
  }, []);

  const getCategoryById = useCallback(
    (id: string) => state.categories.find((c) => c.id === id),
    [state.categories]
  );

  // Subcategory operations
  const addSubcategory = useCallback(
    (categoryId: string, subcategory: Omit<Subcategory, 'id' | 'order' | 'categoryId'>) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;

          const maxOrder = Math.max(-1, ...cat.subcategories.map((s) => s.order));
          const newSubcategory: Subcategory = {
            ...subcategory,
            id: nanoid(),
            categoryId,
            order: maxOrder + 1,
          };

          return {
            ...cat,
            subcategories: [...cat.subcategories, newSubcategory],
          };
        }),
      }));
    },
    []
  );

  const updateSubcategory = useCallback((id: string, updates: Partial<Subcategory>) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => ({
        ...cat,
        subcategories: cat.subcategories.map((sub) =>
          sub.id === id ? { ...sub, ...updates } : sub
        ),
      })),
    }));
  }, []);

  const deleteSubcategory = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => ({
        ...cat,
        subcategories: cat.subcategories.filter((s) => s.id !== id),
      })),
      entries: prev.entries.filter((e) => e.subcategoryId !== id),
    }));
  }, []);

  const getSubcategoryById = useCallback(
    (id: string) => {
      for (const category of state.categories) {
        const subcategory = category.subcategories.find((s) => s.id === id);
        if (subcategory) return subcategory;
      }
      return undefined;
    },
    [state.categories]
  );

  // Entry operations
  const addEntry = useCallback((entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEntry: Entry = {
      ...entry,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
    }));
  }, []);

  const updateEntry = useCallback(
    (id: string, updates: Partial<Omit<Entry, 'id' | 'createdAt'>>) => {
      const now = new Date().toISOString();
      setState((prev) => ({
        ...prev,
        entries: prev.entries.map((entry) =>
          entry.id === id
            ? { ...entry, ...updates, updatedAt: now }
            : entry
        ),
      }));
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.filter((e) => e.id !== id),
    }));
  }, []);

  const getEntryById = useCallback(
    (id: string) => state.entries.find((e) => e.id === id),
    [state.entries]
  );

  const getEntriesBySubcategory = useCallback(
    (subcategoryId: string) =>
      state.entries
        .filter((e) => e.subcategoryId === subcategoryId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [state.entries]
  );

  const getRecentEntries = useCallback(
    (limit: number = 5) =>
      [...state.entries]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit),
    [state.entries]
  );

  const getInboxEntries = useCallback(
    () =>
      state.entries
        .filter((e) => e.subcategoryId === null)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [state.entries]
  );

  const searchEntries = useCallback(
    (query: string, filters?: SearchFilters) =>
      searchEntriesUtil(state.entries, query, filters, state.categories),
    [state.entries, state.categories]
  );

  // Settings operations
  const updateSettings = useCallback((updates: Partial<typeof state.settings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  // Utility operations
  const clearAllData = useCallback(() => {
    clearState();
    setState({
      categories: DEFAULT_CATEGORIES,
      entries: [],
      settings: DEFAULT_SETTINGS,
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    clearState();
    setState({
      categories: DEFAULT_CATEGORIES,
      entries: [],
      settings: DEFAULT_SETTINGS,
    });
  }, []);

  const value: AppContextType = {
    state,
    // Categories
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    // Subcategories
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getSubcategoryById,
    // Entries
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    getEntriesBySubcategory,
    getRecentEntries,
    getInboxEntries,
    searchEntries,
    // Settings
    updateSettings,
    // Utilities
    clearAllData,
    resetToDefaults,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
