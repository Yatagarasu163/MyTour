import { auth } from "../../../../../../auth"; 
import { db as pool } from "../../../../../../lib/actions/pool";

export async function PATCH(request, context) { //PATCH to mark report as resolved and log which admin resolved it 
    const session = await auth();
    const params = await Promise.resolve(context.params);
    const report_id = params.report_id;

    //makes sure user is admin
    if (!session || session.user.role !== "admin") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        //fetch admin id based on email
        const result = await pool.query(
            "SELECT admin_id FROM ADMIN WHERE admin_email = $1",
            [session.user.email]
        );

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: "Admin not found" }), { status: 404 });
        }

        const admin_id = result.rows[0].admin_id;

        // update report status to 'resolved' and associate it with current admin
        await pool.query(
            "UPDATE report SET report_status = 'Resolved', admin_id = $1 WHERE report_id = $2",
            [admin_id, report_id]
        );

        return new Response(JSON.stringify({ message: "Report resolved" }), { status: 200 });
    } catch (error) {
        console.error("Error resolving report:", error.stack);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
