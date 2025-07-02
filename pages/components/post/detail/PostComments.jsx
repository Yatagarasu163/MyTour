import CommentForm from '../comment/CommentForm';
import Comment from '../comment/Comment';
import CommentReportButton from '../../reporting/CommentReportButton';

export default function PostComments({
  currentUser,
  newComment,
  setNewComment,
  isSubmitting,
  handleSubmit,
  commentList,
  setCommentList,
  sentinelRef,
  loadingMore
}) {
  const handleDelete = (id) => {
    setCommentList((prev) => prev.filter((c) => c.comment_id !== id));
  };

  const handleUpdate = (updated) => {
    setCommentList((prev) =>
      prev.map((c) => (c.comment_id === updated.comment_id ? updated : c))
    );
  };

  return (
    <section aria-label="Comments" style={{ marginTop: '3rem' }}>
      <h3>Leave a Comment</h3>

      {currentUser ? (
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      ) : (
        <p style={{ color: '#888', marginBottom: '2rem' }}>
          You must <a href="/login">log in</a> or{' '}
          <a href="/register">create an account</a> to leave a comment.
        </p>
      )}

      <h3>Comments</h3>

      {commentList.length > 0 ? (
        <>
          {commentList.map((comment) => (
            <div key={comment.comment_id}>
              <Comment
                comment={comment}
                currentUserId={currentUser?.user_id}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
              <CommentReportButton commentId={comment.comment_id}/>
            </div>
          ))}
          <div ref={sentinelRef} style={{ height: '1px' }} />
          {loadingMore && (
            <p style={{ color: '#999', marginTop: '1rem' }}>
              Loading more comments…
            </p>
          )}
        </>
      ) : (
        <p style={{ color: '#777' }}>
          No comments yet. Be the first to say something!
        </p>
      )}
    </section>
  );
}