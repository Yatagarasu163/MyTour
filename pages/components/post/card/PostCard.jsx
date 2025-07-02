import React from 'react';
import Link from 'next/link';
import RatingStars from '../detail/RatingStars';
import { highlightMatch } from '@/utils/text';

/**
 * PostCard component
 * Renders a single post preview with metadata and highlighting.
 * - Linked to /posts/[post_id]
 * - Highlights search matches
 * - Shows ratings visually and numerically
 * - Displays plan metadata if available
 */
export default function PostCard({
  title,
  description,
  author,
  timestamp,
  average,
  post_id,
  plan_name,
  plan_day,
  plan_state,
  highlight = ''
}) {
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  const displayAuthor = author || 'Unknown';
  const hasRating = typeof average === 'number' && average > 0;

  return (
    <Link
      href={`/posts/${post_id}`}
      aria-label={`View details for post titled ${title}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)')
        }
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      >
        <h2 style={{ marginBottom: '0.25rem' }}>
          {highlightMatch(title, highlight)}
        </h2>

        <p>{highlightMatch(description, highlight)}</p>

        <p style={{ fontStyle: 'italic', color: '#555' }}>
          by {displayAuthor} · {formattedDate}
        </p>

        {plan_name && (
          <>
            <p>
              <strong>Trip:</strong> {plan_name} ({plan_day} day
              {plan_day > 1 ? 's' : ''})
            </p>
            <p>
              <strong>States:</strong> {plan_state}
            </p>
          </>
        )}

        <div style={{ marginTop: '0.5rem' }}>
          Rating:{' '}
          {hasRating ? (
            <>
              <RatingStars rating={average} />{' '}
              <span style={{ marginLeft: '0.5rem' }}>
                {average.toFixed(1)} / 5
              </span>
            </>
          ) : (
            'Not yet rated'
          )}
        </div>
      </div>
    </Link>
  );
}