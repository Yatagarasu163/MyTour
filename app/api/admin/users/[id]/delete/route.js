import { db as pool } from "../../../../../../lib/actions/pool";

export async function DELETE(request, context) { // delete handler to permanently remove user by ID 
    const params = await Promise.resolve(context.params);
    const id = params.id;

    try {
        const result = await pool.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING *',
            [id] // $1 placeholder, RETURNING gives back full row for confirmation or undo
        );

        if (result.rowCount === 0) { // if no user is found
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                message: "User deleted successfully",
                user: result.rows[0]
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user: ", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
