import type { AppState } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from '../data/defaults';

const STORAGE_KEY = 'life-deck-state';

// Map old Lucide icon names to emojis
const ICON_MIGRATION_MAP: Record<string, string> = {
  'Heart': '❤️',
  'DollarSign': '💰',
  'Sparkles': '✨',
  'Folder': '📁',
  'Briefcase': '💼',
  'Target': '🎯',
  'Activity': '🏃',
  'Book': '📚',
  'Palette': '🎨',
  'Home': '🏠',
  'Plane': '✈️',
  'Music': '🎵',
  'Laptop': '💻',
  'Sprout': '🌱',
};

/**
 * Load app state from localStorage
 * Returns null if not found or corrupted
 */
export function loadState(): AppState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as AppState;
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return null;
  }
}

/**
 * Save app state to localStorage
 */
export function saveState(state: AppState): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      // Could show a warning to the user here
    } else {
      console.error('Error saving state to localStorage:', error);
    }
    return false;
  }
}

/**
 * Initialize app state with defaults
 * Used on first launch or after clearing data
 */
export function initializeState(): AppState {
  const initialState: AppState = {
    categories: DEFAULT_CATEGORIES,
    entries: [],
    settings: DEFAULT_SETTINGS,
  };
  saveState(initialState);
  return initialState;
}

/**
 * Clear all data from localStorage
 * Useful for debugging or reset functionality
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Migrate old Lucide icon names to emojis
 */
function migrateIcons(state: AppState): AppState {
  let needsSave = false;
  
  const migratedCategories = state.categories.map((category) => {
    if (ICON_MIGRATION_MAP[category.icon]) {
      needsSave = true;
      return { ...category, icon: ICON_MIGRATION_MAP[category.icon] };
    }
    return category;
  });
  
  if (needsSave) {
    const migratedState = { ...state, categories: migratedCategories };
    saveState(migratedState);
    return migratedState;
  }
  
  return state;
}

/**
 * Get or initialize state
 * Loads existing state or creates new one with defaults
 */
export function getOrInitializeState(): AppState {
  const existingState = loadState();
  if (existingState) {
    return migrateIcons(existingState);
  }
  return initializeState();
}

/**
 * Check if localStorage is available and working
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get estimated localStorage usage (in bytes)
 */
export function getStorageSize(): number {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return 0;
    return new Blob([serialized]).size;
  } catch {
    return 0;
  }
}
