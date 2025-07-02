import { useEffect, useState } from 'react';

/**
 * Custom hook to fetch filter option metadata from /api/filters
 * Includes: available planDays and planStates
 */
export default function useFilterOptions() {
  const [planDays, setPlanDays] = useState([]);
  const [planStates, setPlanStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch(`api/filters`);
        if (!res.ok) throw new Error('Failed to fetch filters');

        const { planDays, planStates } = await res.json();
        setPlanDays(planDays || []);
        setPlanStates(planStates || []);
      } catch (err) {
        console.error('❌ Failed to load filter options:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return {
    planDays,
    planStates,
    loading,
    error,
  };
}