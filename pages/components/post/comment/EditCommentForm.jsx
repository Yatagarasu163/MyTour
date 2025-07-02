export default function EditCommentForm({
  editedText,
  setEditedText,
  isProcessing,
  onSave,
  onCancel,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedText.trim()) return;
    onSave();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        aria-label="Edit your comment"
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        rows={2}
        style={{
          width: '100%',
          marginBottom: '0.5rem',
          opacity: isProcessing ? 0.6 : 1,
        }}
        disabled={isProcessing}
      />
      <button
        type="submit"
        disabled={isProcessing || !editedText.trim()}
        aria-disabled={isProcessing}
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isProcessing}
        aria-disabled={isProcessing}
        style={{ marginLeft: '0.5rem' }}
      >
        Cancel
      </button>
    </form>
  );
}