'use client';

import { useState, useEffect } from 'react';
import { getRelativeTime } from '@/utils/time';

/**
 * Displays a live-updating relative timestamp (e.g. "5 minutes ago")
 * and shows full localized time on hover. Renders only on the client
 * to avoid hydration mismatches.
 */
export default function RelativeTime({ timestamp }) {
  const [relative, setRelative] = useState('');
  const [fullDate, setFullDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!timestamp) return;

    const date = new Date(timestamp);
    if (isNaN(date)) return;

    const updateRelative = () => setRelative(getRelativeTime(date));
    const formatFull = () =>
      setFullDate(
        date.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
        })
      );

    updateRelative();
    formatFull();

    const interval = setInterval(updateRelative, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!mounted || !relative) return null;

  return (
    <span title={fullDate} aria-label={`Posted at ${fullDate}`}>
      {relative}
    </span>
  );
}