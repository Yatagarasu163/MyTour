import { useEffect, useState } from 'react';

/**
 * Custom hook that returns a debounced version of a value.
 * Useful for delaying reactions to fast-changing inputs (e.g. search, sliders).
 *
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay in ms before updating (default: 400ms)
 * @returns {*} - The debounced value
 */
export default function useDebouncedValue(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let isCancelled = false;

    const timeout = setTimeout(() => {
      if (!isCancelled) setDebouncedValue(value);
    }, delay);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}