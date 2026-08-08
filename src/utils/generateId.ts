/**
 * Generate a unique ID for form elements
 * @param prefix - Component type prefix (e.g., 'input', 'checkbox')
 * @param label - Optional label to derive ID from
 */
export const generateId = (prefix: string, label?: string): string => {
  if (label) {
    const slug = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${prefix}-${slug}`;
  }
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};
