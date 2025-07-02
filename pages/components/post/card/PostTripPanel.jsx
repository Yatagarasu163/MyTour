export default function PostTripPanel({ name, day, state }) {
  const panelStyle = {
    flex: '1 1 300px',
    backgroundColor: '#f7f7f7',
    padding: '1rem',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const displayName = name || 'Untitled Plan';
  const displayDay = typeof day === 'number' ? `${day} day${day !== 1 ? 's' : ''}` : 'N/A';
  const displayState = state || 'Unknown';

  return (
    <div style={panelStyle}>
      <h3 style={{ marginTop: 0 }}>Trip Details</h3>
      <p><strong>Plan Name:</strong> {displayName}</p>
      <p><strong>Duration:</strong> {displayDay}</p>
      <p><strong>States:</strong> {displayState}</p>
    </div>
  );
}