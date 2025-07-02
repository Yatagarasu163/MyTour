export default function CommentForm({
  newComment,
  setNewComment,
  isSubmitting,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <textarea
        aria-label="Write your comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
        style={{
          width: '100%',
          padding: '0.75rem',
          opacity: isSubmitting ? 0.6 : 1,
        }}
        placeholder="Write your comment…"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting || !newComment.trim()}
        aria-disabled={isSubmitting}
        style={{
          marginTop: '0.5rem',
          background: '#0070f3',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? 'Posting…' : 'Post Comment'}
      </button>
    </form>
  );
}