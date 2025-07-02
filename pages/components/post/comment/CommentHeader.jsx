import { useState, useEffect } from 'react';
import RelativeTime from '../detail/RelativeTime';

export default function CommentHeader({ userName, userId, createdAt, updatedAt }) {
  const displayName = userName || `User ${userId}`;
  const [tooltip, setTooltip] = useState('');
  const [showEdited, setShowEdited] = useState(false);

  useEffect(() => {
    if (!createdAt || !updatedAt) return;

    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    if (isNaN(created) || isNaN(updated)) return;

    const timeDiffMs = Math.abs(updated.getTime() - created.getTime());
    const wasEdited = timeDiffMs >= 60 * 1000; // at least 1 min difference
    setShowEdited(wasEdited);

    if (wasEdited) {
      setTooltip(
        updated.toLocaleString('en-GB', {
          timeZone: 'Asia/Kuala_Lumpur',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
        })
      );
    }
  }, [createdAt, updatedAt]);

  return (
    <p style={{ marginBottom: '0.25rem' }}>
      <strong>{displayName}</strong>
      <span style={{ marginLeft: '0.5rem', color: '#777' }}>
        · <RelativeTime timestamp={createdAt} />
        {showEdited && tooltip && (
          <em
            style={{
              marginLeft: '0.5rem',
              fontStyle: 'normal',
              color: '#999',
            }}
            title={tooltip}
          >
            (edited)
          </em>
        )}
      </span>
    </p>
  );
}