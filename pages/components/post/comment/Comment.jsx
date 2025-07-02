import { useState, useEffect } from 'react';
import CommentHeader from '../comment/CommentHeader';
import EditCommentForm from '../comment/EditCommentForm';
import CommentMenu from '../comment/CommentMenu';

export default function Comment({ comment, currentUserId, onDelete, onUpdate }) {
  const isOwner = currentUserId === comment.user_id;
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.comment_text);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const now = new Date();
    const created = new Date(comment.created_at);
    const delay = 5000; // 5 seconds

    const timeLeft = delay - (now - created);

    if (timeLeft <= 0) {
      setCanEdit(true);
    } else {
      const timer = setTimeout(() => setCanEdit(true), timeLeft);
      return () => clearTimeout(timer);
    }
  }, [comment.created_at]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;
    setIsProcessing(true);

    try {
      await fetch(`/api/comments/${comment.comment_id}`, {
        method: 'DELETE',
      });
      onDelete(comment.comment_id);
    } catch (err) {
      console.error('❌ Failed to delete comment:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async () => {
    const trimmed = editedText.trim();
    if (!trimmed) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/comments/${comment.comment_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: trimmed }),
      });

      const updated = await res.json();
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      console.error('❌ Failed to update comment:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        borderBottom: '1px solid #ddd',
        padding: '0.75rem 0',
      }}
    >
      <CommentHeader
        userName={comment.user_name}
        userId={comment.user_id}
        createdAt={comment.created_at}
        updatedAt={comment.comment_timestamp}
      />

      {editing ? (
        <EditCommentForm
          editedText={editedText}
          setEditedText={setEditedText}
          isProcessing={isProcessing}
          onSave={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <p style={{ margin: 0 }}>{comment.comment_text}</p>
      )}

      {isOwner && (
        <>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Comment options"
            disabled={!canEdit}
            title={!canEdit ? 'You can edit this in a few seconds…' : 'More options'}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: canEdit ? 'pointer' : 'not-allowed',
              fontSize: '1.25rem',
              color: '#999',
            }}
          >
            ⋯
          </button>

          {/* ⏳ Cooldown hint appears below the button */}
          {!canEdit && (
            <small
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '2.2rem',
                color: '#bbb',
              }}
            >
              Edit available in a moment…
            </small>
          )}

          {showMenu && (
            <CommentMenu
              onEdit={() => setEditing(true)}
              onDelete={handleDelete}
              disabled={isProcessing}
              onClose={() => setShowMenu(false)}
            />
          )}
        </>
      )}
    </div>
  );
}