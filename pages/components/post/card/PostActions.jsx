'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function PostActions({ postId, ownerId, currentUser }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session, status } = useSession();
  console.log(session);

  if (!currentUser || currentUser !== ownerId){
    return; 
  } else{
      const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this post?');
        if (!confirmed) return;
    
        setIsDeleting(true);
        try {
          const res = await fetch(
            `/api/posts/${postId}`,
            { method: 'DELETE' }
          );
          if (!res.ok) throw new Error('Failed to delete');
          router.push('/posts');
        } catch (err) {
          console.error('Delete error:', err);
          alert('Something went wrong while deleting the post.');
        } finally {
          setIsDeleting(false);
        }
      };
    
      return (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete this post"
            style={{
              color: 'red',
              background: 'transparent',
              border: 'none',
              fontSize: '1rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.6 : 1,
            }}
          >
            🗑 Delete
          </button>
        </div>
      );
  }
}