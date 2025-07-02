'use client';
// 🔧 React + Next.js hooks
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 🧩 Reusable form component for post creation
import PostForm from '@/pages/components/post/form/PostForm';

export default function PostCreatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false); // Tracks form submission state

  // 📨 Handles form submission and POST request to create a new post
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: 14 }) // 🔐 Hardcoded user_id (consider dynamic auth later)
      });

      if (!res.ok) {
        const errorText = await res.text(); // 🛡 Prevents .json() crash on non-JSON errors
        console.error('Server error:', errorText);
        throw new Error('Failed to create post');
      }

      const newPost = await res.json();
      router.push(`/posts/${newPost.post_id}`); // 🔁 Redirect to newly created post
    } catch (err) {
      console.error('Create error:', err);
      alert('Something went wrong. Try again?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Create a New Post</h1>
      {/* 📝 Reusable form component with submit handler and loading state */}
      <PostForm onSubmit={handleSubmit} submitting={submitting} />
    </main>
  );
}