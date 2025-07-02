import { db as pool } from "../../../../lib/actions/pool"; // adjust path if needed

export async function GET() { //get handler to retrieve all reports (posts, comments, users)
    try {
        //sql query to join report data with post, comment and user tables
        const result = await pool.query(`
            SELECT
                r.report_id, 
                CASE 
                    WHEN r.post_id IS NOT NULL THEN 'post' 
                    WHEN r.comment_id IS NOT NULL THEN 'comment' 
                    WHEN r.reported_user_id IS NOT NULL THEN 'user' 
                END AS report_type,
                r.report_option AS reason, 
                r.report_status AS status,
                r.user_id AS reporter_id,
                ru.user_name AS reporter_name,
                r.reported_user_id,
                ru2.user_name AS reported_user_name,
                COALESCE(p.post_description, c.comment_text, ru2.user_email) AS content
            FROM report r 
            LEFT JOIN post p ON r.post_id = p.post_id
            LEFT JOIN comment c ON r.comment_id = c.comment_id
            LEFT JOIN users ru ON r.user_id = ru.user_id -- reporter
            LEFT JOIN users ru2 ON r.reported_user_id = ru2.user_id -- reported
            ORDER BY r.report_id DESC;
        `);

        return Response.json({ reports: result.rows });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
