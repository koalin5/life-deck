import type { Entry, SearchFilters, Category } from '../types';

/**
 * Search entries by query and filters
 * Returns results ranked by relevance (title matches > content matches)
 */
export function searchEntries(
  entries: Entry[],
  query: string,
  filters?: SearchFilters,
  categories?: Category[]
): Entry[] {
  // Start with all entries
  let results = [...entries];

  // Apply filters first (cheap operations)
  if (filters) {
    // Filter by label
    if (filters.label) {
      results = results.filter((entry) => entry.label === filters.label);
    }

    // Filter by subcategory
    if (filters.subcategoryId) {
      results = results.filter((entry) => entry.subcategoryId === filters.subcategoryId);
    }

    // Filter by category (need to check subcategoryId against category's subcategories)
    if (filters.categoryId && categories) {
      const category = categories.find((c) => c.id === filters.categoryId);
      if (category) {
        const subcategoryIds = category.subcategories.map((s) => s.id);
        results = results.filter((entry) =>
          entry.subcategoryId && subcategoryIds.includes(entry.subcategoryId)
        );
      }
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      results = results.filter((entry) => new Date(entry.updatedAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      results = results.filter((entry) => new Date(entry.updatedAt) <= toDate);
    }
  }

  // If no query, return filtered results sorted by date
  if (!query.trim()) {
    return results.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // Search query in title and content (case-insensitive)
  const lowerQuery = query.toLowerCase();

  const scored = results.map((entry) => {
    let score = 0;
    const lowerTitle = entry.title.toLowerCase();
    const lowerContent = entry.content.toLowerCase();

    // Title match (higher weight)
    if (lowerTitle.includes(lowerQuery)) {
      score += 10;
      // Boost if it's at the start
      if (lowerTitle.startsWith(lowerQuery)) {
        score += 5;
      }
    }

    // Content match (lower weight)
    if (lowerContent.includes(lowerQuery)) {
      score += 3;
    }

    return { entry, score };
  });

  // Filter out entries with no matches
  const matched = scored.filter((item) => item.score > 0);

  // Sort by score DESC, then by date DESC
  matched.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return new Date(b.entry.updatedAt).getTime() - new Date(a.entry.updatedAt).getTime();
  });

  return matched.map((item) => item.entry);
}

/**
 * Highlight search matches in text
 * Returns text with matches wrapped in <mark> tags
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get a preview snippet from content that includes the search query
 * Returns up to `length` characters around the first match
 */
export function getSearchPreview(
  content: string,
  query: string,
  length: number = 150
): string {
  if (!query.trim()) {
    return content.slice(0, length) + (content.length > length ? '...' : '');
  }

  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerContent.indexOf(lowerQuery);

  if (matchIndex === -1) {
    // No match, return beginning
    return content.slice(0, length) + (content.length > length ? '...' : '');
  }

  // Calculate snippet around the match
  const halfLength = Math.floor(length / 2);
  let start = Math.max(0, matchIndex - halfLength);
  let end = Math.min(content.length, start + length);

  // Adjust start if we're at the end
  if (end - start < length && start > 0) {
    start = Math.max(0, end - length);
  }

  let snippet = content.slice(start, end);

  // Add ellipsis
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';

  return snippet;
}
