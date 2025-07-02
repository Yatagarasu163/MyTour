import { useState, useEffect } from 'react';

export default function TripPlanSelect({ value, onChange, disabled }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPlans = async () => {
      try {
        const res = await fetch(`/api/posts?plansOnly=true`);
        const contentType = res.headers.get('content-type') || '';
        const raw = await res.text();

        if (!res.ok || !contentType.includes('application/json')) {
          console.error('Bad response:', raw);
          return;
        }

        const data = JSON.parse(raw);
        if (isMounted) setPlans(data);
      } catch (err) {
        console.error('Failed to load trip plans:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectStyle = {
    marginLeft: '0.5rem',
    padding: '0.4rem',
  };

  return (
    <label style={{ display: 'block', marginBottom: '1rem' }}>
      Trip Plan:
      <select
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        required
        aria-label="Select a trip plan"
        style={selectStyle}
      >
        <option value="">
          {loading ? 'Loading plans…' : '-- Select a trip --'}
        </option>

        {!loading && plans.length === 0 && (
          <option value="" disabled>
            No available trip plans
          </option>
        )}

        {plans.map((plan) => (
          <option key={plan.plan_id} value={plan.plan_id}>
            {plan.plan_name}
          </option>
        ))}
      </select>
    </label>
  );
}