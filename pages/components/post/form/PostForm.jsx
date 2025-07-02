'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TripPlanSelect from './TripPlanSelect';

export default function PostForm({ initialData = {}, onSubmit, submitting }) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData.post_title || '');
  const [description, setDescription] = useState(initialData.post_description || '');
  const [status, setStatus] = useState(initialData.post_status ?? 1);
  const [planId, setPlanId] = useState(initialData.plan_id || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription) return;

    const payload = {
      post_title: trimmedTitle,
      post_description: trimmedDescription,
      post_status: Number(status),
      plan_id: Number(planId),
    };

    console.log('📦 Submitting new post:', payload);
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          required
          aria-label="Post title"
        />
      </label>

      <label>
        Description:
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          required
          aria-label="Post description"
        />
      </label>

      <label>
        Status:
        <select
          value={status}
          onChange={(e) => setStatus(Number(e.target.value))}
          disabled={submitting}
          aria-label="Post status"
        >
          <option value={1}>Active</option>
          <option value={0}>Deactive</option>
        </select>
      </label>

      <TripPlanSelect
        value={planId}
        onChange={(e) => setPlanId(e.target.value)}
        disabled={submitting}
      />

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: '#0070f3',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Saving...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/posts')}
          disabled={submitting}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f3f3f3',
            cursor: 'pointer',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}