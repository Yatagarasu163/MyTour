import pool from '@/lib/db';

/**
 * API route for /api/comments/:id
 *
 * Supports:
 * - DELETE: Remove a comment by ID
 * - PATCH: Update comment text and timestamp
 */

export async function DELETE(_request, { params }) {
  const { id } = params;

  try {
    const result = await pool.query(
      `DELETE FROM comment WHERE comment_id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Comment not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Comment deleted' }), {
      status: 200,
    });
  } catch (error) {
    console.error('❌ DELETE error in /api/comments/[id]:', error);
    return new Response(
      JSON.stringify({ error: 'Database error', detail: error.message }),
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    const { comment_text } = await request.json();

    if (!comment_text || comment_text.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Missing comment_text in body' }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      UPDATE comment c
      SET comment_text = $1,
          comment_timestamp = NOW()
      FROM users u
      WHERE comment_id = $2 AND c.user_id = u.user_id
      RETURNING c.*, u.user_name;
    `,
      [comment_text.trim(), id]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Comment not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error('❌ PATCH error in /api/comments/[id]:', error);
    return new Response(
      JSON.stringify({ error: 'Database error', detail: error.message }),
      { status: 500 }
    );
  }
}