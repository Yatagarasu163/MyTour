import pool from '@/lib/db';

/**
 * GET /api/ratings/distribution?post_id=13
 *
 * Returns the number of ratings per score (1–5 stars) for a specific post
 * Example:
 * {
 *   post_id: 13,
 *   distribution: { 1: 0, 2: 1, 3: 2, 4: 5, 5: 3 }
 * }
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get('post_id');

  if (!post_id) {
    return new Response(JSON.stringify({ error: 'Missing post_id in query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await pool.query(
      `SELECT rating_score, COUNT(*) as count
       FROM rating
       WHERE post_id = $1
       GROUP BY rating_score
       ORDER BY rating_score`,
      [post_id]
    );

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    result.rows.forEach(row => {
      distribution[row.rating_score] = parseInt(row.count, 10);
    });

    return new Response(JSON.stringify({
      post_id: parseInt(post_id, 10),
      distribution
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error getting rating distribution:', error);
    return new Response(JSON.stringify({ error: 'Database error', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}