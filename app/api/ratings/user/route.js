import pool from '@/lib/db';

/**
 * GET /api/ratings/user
 * 
 * Supports:
 * - ?user_id=8                 → Get all ratings by user 8
 * - ?user_id=8&post_id=19      → Get user 8's rating for post 19
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const post_id = searchParams.get('post_id');

  if (!user_id) {
    return new Response(JSON.stringify({ error: 'Missing user_id in query' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    if (post_id) {
      // 🎯 Fetch a specific rating by this user for a given post
      const result = await pool.query(
        `SELECT rating_score
         FROM rating
         WHERE user_id = $1 AND post_id = $2`,
        [user_id, post_id]
      );

      return Response.json({
        user_id: parseInt(user_id, 10),
        post_id: parseInt(post_id, 10),
        rating_score: result.rows[0]?.rating_score ?? null
      });
    } else {
      // 📋 Fetch all ratings by this user
      const result = await pool.query(
        `SELECT post_id, rating_score
         FROM rating
         WHERE user_id = $1
         ORDER BY rated_at DESC`,
        [user_id]
      );

      return Response.json(result.rows);
    }

  } catch (error) {
    console.error('❌ Error fetching user rating(s):', error);
    return new Response(JSON.stringify({ error: 'Database error', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}