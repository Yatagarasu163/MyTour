import React from 'react';

export default function PostHeader({ title, authorName, userId, localTime }) {
  const displayTitle = title || 'Untitled Post';
  const displayAuthor = authorName || `User ${userId}`;
  const displayTime = localTime || 'Loading time…';

  return (
    <header>
      <h1>{displayTitle}</h1>
      <p
        style={{ fontStyle: 'italic', color: '#555' }}
        aria-label="Post metadata"
      >
        by {displayAuthor} · {displayTime}
      </p>
    </header>
  );
}