import { FaSortAmountDownAlt, FaSortAmountUpAlt } from 'react-icons/fa';

export default function SortDirectionButtons({ direction, onChange }) {
  const baseButtonStyle = {
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'background 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        onClick={() => onChange('asc')}
        title="Ascending"
        aria-label="Sort ascending"
        aria-pressed={direction === 'asc'}
        style={{
          ...baseButtonStyle,
          background: direction === 'asc' ? '#e0e0e0' : 'transparent',
        }}
      >
        <FaSortAmountUpAlt size={20} color={direction === 'asc' ? '#333' : '#999'} />
      </button>

      <button
        onClick={() => onChange('desc')}
        title="Descending"
        aria-label="Sort descending"
        aria-pressed={direction === 'desc'}
        style={{
          ...baseButtonStyle,
          background: direction === 'desc' ? '#e0e0e0' : 'transparent',
        }}
      >
        <FaSortAmountDownAlt size={20} color={direction === 'desc' ? '#333' : '#999'} />
      </button>
    </div>
  );
}