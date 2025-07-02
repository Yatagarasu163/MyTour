import pool from '@/lib/db';

/**
 * API route for /api/comments
 * 
 * Supports:
 * - POST: Create a new comment
 * - GET: Fetch comments for a specific post (with pagination)
 */

export async function POST(request) {
  try {
    const { post_id, user_id, comment_text } = await request.json();

    if (!post_id || !user_id || !comment_text) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await pool.query(
      `INSERT INTO comment (post_id, user_id, comment_text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [post_id, user_id, comment_text]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error inserting comment:', error);
    return new Response(JSON.stringify({ error: 'Database error', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get('post_id');
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  if (!post_id) {
    return new Response(JSON.stringify({ error: 'post_id query parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const result = await pool.query(
      `SELECT comment.*, users.user_name
       FROM comment
       JOIN users ON comment.user_id = users.user_id
       WHERE comment.post_id = $1
       ORDER BY comment.created_at DESC
       LIMIT $2 OFFSET $3`,
      [post_id, limit, offset]
    );

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    return new Response(JSON.stringify({ error: 'Database error', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}