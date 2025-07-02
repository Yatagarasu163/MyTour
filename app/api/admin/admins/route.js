import { db as pool } from "../../../../lib/actions/pool";

export async function GET(request) { //handle get request to fetch all admins 
    try {
        const result = await pool.query(`SELECT * FROM admin ORDER BY admin_id ASC`); // get all admins by admin_id ascending
        return new Response(
            JSON.stringify({ admins: result.rows }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching admins:", error.stack);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
