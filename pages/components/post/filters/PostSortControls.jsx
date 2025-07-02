import SortDropdown from './SortDropdown';
import SortDirectionButtons from './SortDirectionButtons';

export default function PostSortControls({
  sort,
  direction,
  onSortChange,
  onDirectionChange,
}) {
  return (
    <div
      aria-label="Post sorting controls"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
      }}
    >
      <SortDropdown value={sort} onChange={onSortChange} />
      <SortDirectionButtons direction={direction} onChange={onDirectionChange} />
    </div>
  );
}