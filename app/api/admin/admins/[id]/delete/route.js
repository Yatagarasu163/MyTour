import { db as pool } from "../../../../../../lib/actions/pool";

export async function DELETE(request, context) { //handle delete request to remove admin by admin_id
    const params = await Promise.resolve(context.params);
    const id = parseInt(params.id);

    try {
        const result = await pool.query(
            `DELETE FROM admin WHERE admin_id = $1 RETURNING *`, //perform deletion using param SQL query to prevent SQL injection
            [id]
        );

        //if no rows were affected, admin no exist
        if (result.rowCount === 0) { 
            return new Response(
                JSON.stringify({ error: "Admin not found" }),
                { status: 404 }
            );
        }

        // deletion successful, return deleted admin data
        return new Response(
            JSON.stringify({
                message: "Admin deleted successfully",
                deleted: result.rows[0]
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting admin:", error.stack);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
