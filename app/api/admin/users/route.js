import { db as pool } from "../../../../lib/actions/pool";

export async function GET() { //get handler to retrieve list of users
    try {
        const result = await pool.query(`
            SELECT 
                user_id, 
                user_name, 
                user_email, 
                CASE 
                    WHEN user_status = 1 THEN 'Active' 
                    ELSE 'Inactive' 
                END AS status 
            FROM users
            ORDER BY user_id DESC
        `);

        return new Response(
            JSON.stringify({ users: result.rows }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
