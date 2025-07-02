import { getPaginationRangeLabel, getPageNumbers } from '@/lib/posts/pagination';

/**
 * Pagination controls for the post list.
 * - Shows first, previous, numbered, next, and last buttons
 * - Handles current page state and disables edges when appropriate
 */
export default function PostPagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '2rem',
      }}
    >
      <button onClick={() => onPageChange(1)} disabled={isFirst} title="First page">
        ⏮
      </button>

      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={isFirst}
        title="Previous page"
      >
        ◀
      </button>

      {getPageNumbers(page, totalPages).map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          aria-current={num === page ? 'page' : undefined}
          title={`Page ${num}`}
          style={{
            fontWeight: num === page ? 'bold' : 'normal',
            textDecoration: num === page ? 'underline' : 'none',
            backgroundColor: num === page ? '#e0f0ff' : 'transparent',
            border: '1px solid #ccc',
            padding: '0.3rem 0.6rem',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={isLast}
        title="Next page"
      >
        ▶
      </button>

      <button onClick={() => onPageChange(totalPages)} disabled={isLast} title="Last page">
        ⏭
      </button>
    </nav>
  );
}