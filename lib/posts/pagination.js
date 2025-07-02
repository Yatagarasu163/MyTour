/**
 * Generates a human-readable label for pagination display.
 * Example: "Showing 11–20 of 42 posts"
 *
 * @param {number} page - Current page number (1-based)
 * @param {number} limit - Number of items per page
 * @param {number} total - Total number of items
 * @returns {string} - Pagination range label
 */
export const getPaginationRangeLabel = (page, limit, total) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return `Showing ${start}–${end} of ${total} post${total !== 1 ? 's' : ''}`;
};

/**
 * Calculates a range of page numbers to display in pagination controls.
 * Keeps the current page centered when possible.
 *
 * @param {number} page - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} visiblePages - Max number of page buttons to show (default: 5)
 * @returns {number[]} - Array of page numbers to render
 */
export const getPageNumbers = (page, totalPages, visiblePages = 5) => {
  const half = Math.floor(visiblePages / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, start + visiblePages - 1);

  // 🔁 Adjust start if we're near the end and not showing enough pages
  if (end - start + 1 < visiblePages) {
    start = Math.max(1, end - visiblePages + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};