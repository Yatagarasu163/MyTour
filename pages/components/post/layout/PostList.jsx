import { getPaginationRangeLabel } from '@/lib/posts/pagination';
import PostCard from '../card/PostCard';

/**
 * Component to render a list of posts as <PostCard> elements.
 * Also displays pagination range text, loading state, and empty results message.
 */
export default function PostList({
  posts = [],
  loading,
  query,
  currentPage,
  limit,
  total,
}) {
  if (loading) {
    return <p style={{ color: '#555' }}>Loading posts…</p>;
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return <p style={{ color: '#777' }}>No posts match your filters.</p>;
  }

  return (
    <>
      <p style={{ marginBottom: '0.5rem', color: '#666' }}>
        {getPaginationRangeLabel(currentPage, limit, total)}
      </p>

      {posts.map((post) => (
        <PostCard
          key={post.post_id}
          title={post.post_title}
          description={post.post_description || 'No description'}
          author={post.user_name || `User ID: ${post.user_id}`}
          timestamp={post.post_timestamp}
          average={post.average}
          post_id={post.post_id}
          plan_name={post.plan_name}
          plan_day={post.plan_day}
          plan_state={post.plan_state}
          highlight={query}
        />
      ))}
    </>
  );
}