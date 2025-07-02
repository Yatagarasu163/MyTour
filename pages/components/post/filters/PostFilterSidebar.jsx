import Select from 'react-select';

export default function PostFilterSidebar({ filters, onChange, onClear, options }) {
  const handleDateChange = (which, value) => {
    console.log('📆 Date selected:', which, value);
    const dateOnly = value; // Already in 'yyyy-mm-dd' format from input

    // If 'start' picker
    if (which === 'start') {
      const end = filters.dateRange?.[1];
      const isAfterEnd = end && dateOnly > end;

      onChange({
        target: {
          name: 'date_range',
          value: [dateOnly, isAfterEnd ? dateOnly : end],
          type: 'range',
        },
      });
    } else {
      const start = filters.dateRange?.[0];
      const isBeforeStart = start && dateOnly < start;

      onChange({
        target: {
          name: 'date_range',
          value: [isBeforeStart ? dateOnly : start, dateOnly],
          type: 'range',
        },
      });
    }
  };

  const safePlanStates = options.planStates || [];

  return (
    <aside style={sidebarStyle}>
      <h3>Filter Posts</h3>

      <label style={labelStyle}>
        Search Posts:
        <input
          type="text"
          name="q"
          value={filters.q}
          onChange={onChange}
          placeholder="Search by title or description"
          style={inputStyle}
          aria-label="Search posts"
        />
      </label>

      <label style={labelStyle}>
        Plan Day:
        <select
          name="plan_day"
          value={filters.plan_day}
          onChange={onChange}
          style={inputStyle}
          aria-label="Filter by plan day"
        >
          <option value="">All</option>
          {options.planDays.map((day) => (
            <option key={day} value={day}>
              {day} day{day > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Plan State:
        <Select
          isMulti
          name="plan_state"
          value={safePlanStates
            .filter((s) => (filters.plan_state || []).includes(s.name))
            .map((s) => ({ label: `${s.name} (${s.count})`, value: s.name }))}
          onChange={(selected) => {
            const selectedValues = (selected || []).map((s) => s.value);
            onChange({
              target: {
                name: 'plan_state',
                value: selectedValues,
                type: 'select-multiple',
              },
            });
          }}
          options={safePlanStates.map((s) => ({
            label: `${s.name} (${s.count})`,
            value: s.name,
            isDisabled: s.count === 0,
          }))}
          styles={{
            container: (base) => ({ ...base, marginTop: '0.25rem' }),
            option: (base, state) => ({
              ...base,
              color: state.isDisabled ? '#999' : base.color,
              cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            }),
          }}
        />
      </label>

      <label style={labelStyle}>
        Min Rating:
        <select
          name="min_rating"
          value={filters.min_rating}
          onChange={onChange}
          style={inputStyle}
          aria-label="Filter by minimum rating"
        >
          <option value="">All ratings</option>
          <option value="4">4★ and up</option>
          <option value="3">3★ and up</option>
          <option value="2">2★ and up</option>
        </select>
      </label>

      <fieldset style={{ ...labelStyle, border: 'none' }}>
        <legend>Date Range:</legend>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            type="date"
            name="start_date"
            value={filters.dateRange?.[0]?.split('T')[0] || ''}
            onChange={(e) => handleDateChange('start', e.target.value)}
            {...(filters.dateRange?.[1]
              ? { max: filters.dateRange[1].split('T')[0] }
              : {})}
          />

          <span>to</span>
          <input
            type="date"
            name="end_date"
            value={filters.dateRange?.[1]?.split('T')[0] || ''}
            onChange={(e) => handleDateChange('end', e.target.value)}
            {...(filters.dateRange?.[0]
              ? { min: filters.dateRange[0].split('T')[0] }
              : {})}
          />

        </div>
      </fieldset>

      <button onClick={onClear} style={clearButtonStyle}>
        Clear Filters
      </button>
    </aside>
  );
}

const sidebarStyle = {
  minWidth: '250px',
  padding: '1rem',
  background: '#f9f9f9',
  borderRadius: '8px',
};

const labelStyle = { display: 'block', marginBottom: '0.5rem' };
const inputStyle = { width: '100%', padding: '0.5rem', marginTop: '0.25rem' };
const clearButtonStyle = {
  marginTop: '1rem',
  width: '100%',
  padding: '0.5rem',
  background: '#eee',
  border: '1px solid #ccc',
  cursor: 'pointer',
};