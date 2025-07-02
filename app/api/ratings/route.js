import pool from '@/lib/db';

/**
 * API route for /api/ratings
 * 
 * Supports:
 * - GET: Returns average rating & count for a post
 * - POST: Create or update a user's rating for a post
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
      `SELECT 
         ROUND(AVG(rating_score)::numeric, 1) AS average,
         COUNT(*) AS count
       FROM rating
       WHERE post_id = $1`,
      [post_id]
    );

    const { average, count } = result.rows[0];

    return Response.json({
      post_id: parseInt(post_id, 10),
      average: parseFloat(average) || 0,
      count: parseInt(count, 10) || 0
    });

  } catch (error) {
    console.error('❌ Error fetching ratings:', error);
    return new Response(JSON.stringify({ error: 'Database error', detail: error.message }), {
      status: 500
    });
  }
}

export async function POST(request) {
  try {
    const { post_id, user_id, rating_score } = await request.json();

    if (!post_id || !user_id || !rating_score) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const score = parseInt(rating_score, 10);
    if (isNaN(score) || score < 1 || score > 5) {
      return new Response(JSON.stringify({ error: 'Rating score must be an integer between 1 and 5' }), { status: 400 });
    }

    // Optional: Determine if this is an update or new rating
    const existing = await pool.query(
      'SELECT rating_id FROM rating WHERE post_id = $1 AND user_id = $2',
      [post_id, user_id]
    );

    const result = await pool.query(
      `INSERT INTO rating (post_id, user_id, rating_score)
       VALUES ($1, $2, $3)
       ON CONFLICT (post_id, user_id)
       DO UPDATE SET rating_score = EXCLUDED.rating_score, rated_at = NOW()
       RETURNING *`,
      [post_id, user_id, score]
    );

    const status = existing.rows.length > 0 ? 'updated' : 'created';

    return new Response(JSON.stringify({ rating: result.rows[0], status }), { status: 201 });

  } catch (error) {
    console.error('❌ Error saving rating:', error);
    return new Response(JSON.stringify({ error: 'Database error', detail: error.message }), { status: 500 });
  }
}