import { db as pool } from "../../../../../../lib/actions/pool";

export async function PATCH(request, context) { //patch handler to toggle user status (active / suspended)
    const params = await Promise.resolve(context.params);
    const id = params.id;

    try {
        //check if user exists and retrieve current status 
        const check = await pool.query(
            'SELECT user_status FROM users WHERE user_id = $1',
            [id]
        );

        if (check.rowCount === 0) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 400 }
            );
        }

        //determine new status 
        const currentStatus = check.rows[0].user_status;
        const newStatus = currentStatus === 1 ? 0 : 1;

        //update user status 
        const result = await pool.query(
            'UPDATE users SET user_status = $1 WHERE user_id = $2 RETURNING *',
            [newStatus, id]
        );

        return new Response(
            JSON.stringify({
                message: newStatus === 0 ? "User suspended" : "User restored",
                user: result.rows[0],
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user status:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
