export default function PostItem({ post }) {
  const title = post?.post_title || 'Untitled';
  const description = post?.post_description || 'No description provided.';
  const author = post?.user_name || `User ${post?.user_id || 'ID unknown'}`;
  const date = post?.post_timestamp
    ? new Date(post?.post_timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <div
      style={{
        padding: '1rem 0',
        borderBottom: '1px solid #ddd',
      }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <small style={{ color: '#777' }}>
        By {author} · {date}
      </small>
    </div>
  );
}