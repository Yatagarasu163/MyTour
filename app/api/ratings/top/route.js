import pool from '@/lib/db';

/**
 * GET /api/ratings/top?min=2&limit=5
 * 
 * Returns top-rated posts with at least `min` ratings, sorted by average rating (desc).
 * 
 * Default: min=1, limit=10
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const min = parseInt(searchParams.get('min') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const result = await pool.query(
      `SELECT post_id,
              ROUND(AVG(rating_score)::numeric, 2) AS average,
              COUNT(*) AS count
       FROM rating
       GROUP BY post_id
       HAVING COUNT(*) >= $1
       ORDER BY average DESC
       LIMIT $2`,
      [min, limit]
    );

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error getting top-rated posts:', error);
    return new Response(JSON.stringify({ error: 'Database error', detail: error.message }), {
      status: 500
    });
  }
}