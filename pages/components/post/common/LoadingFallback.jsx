export default function LoadingFallback({ message = 'Loading…' }) {
  const spinnerStyle = {
    width: '1.5rem',
    height: '1.5rem',
    margin: '0 auto',
    border: '3px solid #ccc',
    borderTop: '3px solid #555',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#555',
        fontSize: '1rem',
      }}
    >
      <div style={{ marginBottom: '0.5rem' }}>{message}</div>
      <div style={spinnerStyle} title="Loading animation" />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}