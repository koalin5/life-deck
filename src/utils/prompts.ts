import type { Entry } from '../types';

/**
 * Format a single entry for context injection
 */
export function formatEntryForContext(entry: Entry): string {
  return `Title: ${entry.title}\n${entry.content}\n\n---\n\n`;
}

/**
 * Get recent entries for context (sorted by updatedAt)
 */
export function getRecentEntriesForContext(
  entries: Entry[],
  subcategoryId: string,
  limit: number = 3
): Entry[] {
  return entries
    .filter((entry) => entry.subcategoryId === subcategoryId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

/**
 * Generate a prompt with context injection
 *
 * @param template - The prompt template with {{CONTEXT}} placeholder
 * @param entries - All entries to choose from
 * @param includeContext - Whether to include context (default true)
 * @param selectedEntryIds - Specific entry IDs to include (overrides default 3 recent)
 * @returns The final prompt with context injected
 */
export function generatePrompt(
  template: string,
  entries: Entry[],
  includeContext: boolean = true,
  selectedEntryIds?: string[]
): string {
  // If context not included, remove placeholder
  if (!includeContext) {
    return template.replace('{{CONTEXT}}', '(No context included)');
  }

  // Get entries to include
  let entriesToInclude: Entry[];

  if (selectedEntryIds && selectedEntryIds.length > 0) {
    // Use specific selected entries
    entriesToInclude = entries.filter((e) => selectedEntryIds.includes(e.id));
    // Sort by updatedAt DESC
    entriesToInclude.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } else {
    // This should be filtered externally, but just in case
    entriesToInclude = entries;
  }

  // Format context
  let context = '';
  if (entriesToInclude.length > 0) {
    context = `Here's my current context from previous entries:
---
${entriesToInclude.map(formatEntryForContext).join('')}---

`;
  }

  // Replace placeholder with formatted context (or empty string if no context)
  return template.replace('{{CONTEXT}}', context.trim());
}

/**
 * Format a date relative to now (e.g., "2 days ago", "just now")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Format a date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
