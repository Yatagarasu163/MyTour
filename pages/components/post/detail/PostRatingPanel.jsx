import RatingStars from '../detail/RatingStars';
import RatingForm from '../detail/RatingForm';

export default function PostRatingPanel({ average, count, postId, currentUser, onRated }) {
  const hasRating = typeof average === 'number' && average > 0;

  return (
    <div
      style={{
        flex: '1 1 300px',
        backgroundColor: '#f0f8ff',
        padding: '1rem',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Ratings</h3>

      {hasRating ? (
        <>
          <RatingStars rating={average} />
          <p style={{ marginTop: '0.5rem' }}>
            <strong>{average.toFixed(1)}</strong> / 5 ({count} rating
            {count !== 1 ? 's' : ''})
          </p>
        </>
      ) : (
        <p>Not yet rated</p>
      )}

      {currentUser && (
        <div style={{ marginTop: '1rem' }}>
          <RatingForm postId={postId} userId={currentUser.user_id} onRated={onRated} />
        </div>
      )}
    </div>
  );
}