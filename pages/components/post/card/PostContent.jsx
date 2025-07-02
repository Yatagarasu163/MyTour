export default function PostContent({ description }) {
  if (!description || typeof description !== 'string') return null;

  return (
    <section aria-label="Post description" style={{ marginTop: '2rem' }}>
      <h3>Post Description</h3>
      <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
    </section>
  );
}