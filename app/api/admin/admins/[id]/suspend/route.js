import { db as pool } from "../../../../../../lib/actions/pool";

export async function PATCH(request, context) { // patch handler to toggle admin status 
    const params = await Promise.resolve(context.params);
    const id = params.id;

    try { 
        const result = await pool.query(
            'SELECT admin_status FROM admin WHERE admin_id = $1', // check if admin exists and get current status 
            [id]
        );

        if (result.rowCount === 0) {
            return new Response(
                JSON.stringify({ error: "Admin not found" }),
                { status: 404 }
            );
        }
        //toggle status 
        const currentStatus = result.rows[0].admin_status;
        const newStatus = currentStatus === 1 ? 0 : 1;

        //update admin's satus in database
        await pool.query(
            `UPDATE admin SET admin_status = $1 WHERE admin_id = $2`,
            [newStatus, id]
        );

        //respond with success and new status 
        return new Response(
            JSON.stringify({
                message: "Admin status updated",
                admin_id: id,
                new_status: newStatus
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error toggling admin status: ", err.stack);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
