// this page is for deleting posts and comments as well as the reports

import { db as pool } from "../../../../../../lib/actions/pool";

export async function DELETE(request, context) { 
    const params = await Promise.resolve(context.params); // ensures compatibility
    const report_id = params.report_id;

    try {
        // getting report info
        const reportRes = await pool.query(
            `SELECT post_id, comment_id FROM report WHERE report_id = $1`,
            [report_id]
        );

        if (reportRes.rowCount === 0) {
            return new Response(
                JSON.stringify({ error: "Report not found" }),
                { status: 404 }
            );
        }

        const { post_id, comment_id } = reportRes.rows[0];

        // delete the content first 
        if (post_id) {
            await pool.query(`DELETE FROM post WHERE post_id = $1`, [post_id]);
        } else if (comment_id) {
            await pool.query(`DELETE FROM comment WHERE comment_id = $1`, [comment_id]);
        }

        // deleting the report 
        await pool.query(`DELETE FROM report WHERE report_id = $1`, [report_id]);

        return new Response(
            JSON.stringify({ message: "Content and report deleted." }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error deleting content/report: ", err);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
