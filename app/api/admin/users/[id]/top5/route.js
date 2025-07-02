import { db as pool } from "../../../../../../lib/actions/pool";

export async function GET(request, context) {
  const params = await Promise.resolve(context.params);
  const id = params.id;

  try {
    const check = await pool.query(
      'SELECT post_title FROM post WHERE user_id = $1 ORDER BY post_id DESC LIMIT 5',
      [id]
    );

    if (check.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: "No post found" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ posts: check.rows }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching top posts:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

