// app/api/posts/[id]/route.js

import pool from '@/lib/db'; // ⛳️ Import your PostgreSQL pool connection

// ======================================================
// GET /api/posts/:id
// Fetches a single post based on the post_id from the URL
// ======================================================
export async function GET(request, context) {
  const { id } = await context.params;

  try {
    const result = await pool.query('SELECT * FROM post WHERE post_id = $1', [id]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
    }

    // ✅ Return the post if found
    return Response.json(result.rows[0]);
  } catch (err) {
    console.error('❌ GET error in /api/posts/[id]:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), { status: 500 });
  }
}

// ======================================================
// PATCH /api/posts/:id
// Updates a post’s title, description, or status
// ======================================================
export async function PATCH(request, context) {
  const { id } = context.params;

  try {
    const { post_title, post_description, post_status } = await request.json();

    const result = await pool.query(
      `
      UPDATE post
      SET 
        post_title = $1,
        post_description = $2,
        post_status = $3
      WHERE post_id = $4
      RETURNING *;
    `,
      [post_title, post_description, post_status, id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Post not found for update' }), { status: 404 });
    }

    // ✅ Return the updated post
    return Response.json(result.rows[0]);
  } catch (err) {
    console.error('❌ PATCH error in /api/posts/[id]:', err);
    return new Response(JSON.stringify({ error: 'Failed to update post' }), { status: 500 });
  }
}

// ======================================================
// DELETE /api/posts/:id
// Deletes a post by ID
// ======================================================
export async function DELETE(request, context) {
  const { id } = context.params;

  try {
    const result = await pool.query('DELETE FROM post WHERE post_id = $1 RETURNING *;', [id]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Post not found to delete' }), { status: 404 });
    }

    // ✅ Success with no content
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('❌ DELETE error in /api/posts/[id]:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), { status: 500 });
  }
}