import styles from '../common/RatingStars.module.css';

const MAX_RATING = 5;

export default function RatingStars({ rating = 0, onChange, interactive = false }) {
  const handleClick = (index) => {
    if (interactive && typeof onChange === 'function') {
      onChange(index + 1); // 1-based rating
    }
  };

  const clampedRating = Math.min(rating, MAX_RATING);

  return (
    <div
      className={styles.starWrapper}
      title={`${clampedRating.toFixed(1)} / ${MAX_RATING}`}
      role={interactive ? 'slider' : 'img'}
      aria-label={`Rating: ${clampedRating.toFixed(1)} out of ${MAX_RATING}`}
    >
      {Array.from({ length: MAX_RATING }).map((_, i) => (
        <span
          key={i}
          className={styles.star}
          onClick={() => handleClick(i)}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            color: i < clampedRating ? '#ffc107' : '#ccc',
            fontSize: '1.5rem',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}