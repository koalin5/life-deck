/**
 * Copy text to clipboard
 * Uses modern Clipboard API with fallback to execCommand
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard API failed:', error);
      // Fall through to fallback
    }
  }

  // Fallback for older browsers
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback copy method using execCommand
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Create a temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);

    // Select and copy
    textarea.focus();
    textarea.select();

    const successful = document.execCommand('copy');

    // Clean up
    document.body.removeChild(textarea);

    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}
