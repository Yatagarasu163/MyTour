import { db } from "../../../../lib/actions/pool";

export async function GET() {
    try {
        const result = await db.query(`SELECT * FROM post`);
        return Response.json(result.rows);
    } catch (err) {
        console.error("Error fetching posts:", err);
        return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
