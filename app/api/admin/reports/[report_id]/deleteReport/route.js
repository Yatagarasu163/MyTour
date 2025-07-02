import { db as pool } from "../../../../../../lib/actions/pool";

export async function DELETE(request, context) { // delete report by its report_id
    const params = await Promise.resolve(context.params);
    const report_id = params.report_id;

    try {
        const result = await pool.query(
            "DELETE FROM report WHERE report_id = $1 RETURNING *", //attempt to delete the report and return the deleted row 
            [report_id]
        );

        if (result.rowCount === 0) {
            return new Response(
                JSON.stringify({ error: "Report not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Report deleted", report: result.rows[0] }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting report:", error.stack);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
