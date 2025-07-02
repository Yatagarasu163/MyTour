import { useState } from 'react';
import RatingStars from '../detail/RatingStars';

export default function RatingForm({ postId, userId, onRated }) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await fetch(`/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: userId,
          rating_score: rating,
        }),
      });

      onRated(); // Notify parent to refresh display
    } catch (err) {
      console.error('❌ Failed to submit rating:', err);
      // Optional: show user-friendly error here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label htmlFor="rating-stars">Rate this post:</label>{' '}
      <RatingStars
        rating={rating}
        onChange={setRating}
        interactive
        id="rating-stars"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        aria-disabled={isSubmitting}
        style={{
          marginLeft: '1rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '4px',
          border: 'none',
          background: rating > 0 ? '#0070f3' : '#888',
          color: 'white',
          cursor: rating > 0 ? 'pointer' : 'not-allowed',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
    </div>
  );
}