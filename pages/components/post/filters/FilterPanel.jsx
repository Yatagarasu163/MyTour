export default function FilterPanel({
  filters = [],
  onToggle = () => {},
  categories = ['plan1', 'plan2', 'plan3'], // Replace or override as needed
}) {
  const toLabel = (cat) => cat.replace(/([a-zA-Z]+)(\d+)/, (_, p1, p2) => `${p1.charAt(0).toUpperCase() + p1.slice(1)} ${p2}`);

  return (
    <fieldset style={{ margin: '1rem 0', border: 'none', padding: 0 }}>
      <legend><strong>Filter by plan:</strong></legend>
      {categories.map((cat) => (
        <label key={cat} style={{ marginLeft: '1rem' }}>
          <input
            type="checkbox"
            checked={filters.includes(cat)}
            onChange={() => onToggle(cat)}
            aria-label={`Toggle filter for ${toLabel(cat)}`}
          />
          {toLabel(cat)}
        </label>
      ))}
    </fieldset>
  );
}