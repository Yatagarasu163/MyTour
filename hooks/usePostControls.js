import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useDebouncedValue from './useDebouncedValue';

/**
 * Custom hook to manage post filters, sorting, and pagination.
 * Initializes state from incoming query params and provides update handlers.
 */
export default function usePostControls(query = {}) {
  const router = useRouter();

  // 📅 Default range: Jan 1, 2023 → now
  const defaultDateRange = useMemo(() => [
    new Date('2023-01-01').toISOString(),
    new Date().toISOString()
  ], []);

  const parseArrayQuery = (value) =>
    Array.isArray(value) ? value : value ? [value] : [];

  const normalizeDateRange = () => {
    const raw = query.date_range;

    if (Array.isArray(raw) && raw.length === 2) return raw;

    if (typeof raw === 'string') {
      // Split on comma or pipe just in case
      const parts = raw.split(/[,|]/).filter(Boolean).slice(0, 2);
      return parts.length ? parts : defaultDateRange;
    }

    return defaultDateRange;
  };

  const [sort, setSort] = useState(query.sort || 'post_timestamp');
  const [direction, setDirection] = useState(query.direction || 'desc');

  const [filters, setFilters] = useState(() => ({
    q: query.q || '',
    plan_day: query.plan_day || '',
    plan_state: parseArrayQuery(query.plan_state),
    min_rating: query.min_rating || '',
    dateRange: normalizeDateRange()
  }));

  const debouncedQuery = useDebouncedValue(filters.q, 400);
  const [page, setPage] = useState(parseInt(query.page || '1', 10));
  const [limit] = useState(6); // Static

  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;

    setFilters((prev) => {
      const updated = { ...prev };

      if (name === 'plan_state') {
        updated.plan_state = Array.isArray(value) ? value : [];
      } else if (type === 'range') {
        updated.dateRange = Array.isArray(value) ? [...value] : [];
      } else {
        updated[name] = value;
      }

      return updated;
    });

    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      q: '',
      plan_day: '',
      plan_state: [],
      min_rating: '',
      dateRange: defaultDateRange
    });
    setPage(1);
  };

  return {
    sort,
    setSort,
    direction,
    setDirection,
    filters,
    debouncedQuery,
    handleFilterChange,
    handleClearFilters,
    page,
    setPage,
    limit
  };
}