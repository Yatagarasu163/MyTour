/**
 * highlightMatch(text, query)
 * Highlights matched portions of a string using <mark> tags.
 * Used for search term highlighting in titles or descriptions.
 *
 * @param {string} text - The original string to search in
 * @param {string} query - The search query to highlight
 * @returns {Array<JSX.Element|string>} - A JSX array with highlighted segments
 */
export function highlightMatch(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');

  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ backgroundColor: '#ffe58a', padding: '0 2px' }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}