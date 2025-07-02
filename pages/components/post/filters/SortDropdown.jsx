export default function SortDropdown({ value, onChange }) {
  const options = [
    { value: 'post_timestamp', label: 'Most Recent' },
    { value: 'post_title', label: 'Title (A–Z)' },
    { value: 'average', label: 'Highest Rated' },
    { value: 'comment_count', label: 'Most Commented' },
  ];

  return (
    <label style={{ marginRight: '1rem' }}>
      Sort by:{' '}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort posts"
        style={{ padding: '0.35rem 0.5rem' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}