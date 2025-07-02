'use client';

import { useRouter } from 'next/navigation';

export default function CreatePostButton() {
  const router = useRouter();

  const buttonStyle = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  };

  return (
    <button
      onClick={() => router.push('/posts/create')}
      aria-label="Create a new post"
      style={buttonStyle}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#005ac1')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
    >
      + Create Post
    </button>
  );
}