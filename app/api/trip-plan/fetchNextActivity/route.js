import { db } from "../../../../lib/actions/pool";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const plan_id = searchParams.get("plan_id");
    const day = searchParams.get("day");
    const current_id = searchParams.get("current_id");

    if (!plan_id || !day || !current_id) {
        return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const result = await db.query(
            `SELECT * FROM activity 
             WHERE plan_id = $1 AND activity_day_number = $2 AND activity_id > $3 
             ORDER BY activity_id ASC 
             LIMIT 1`,
            [plan_id, day, current_id]
        );

        if (result.rows.length === 0) {
            return Response.json({ error: "No next activity found" }, { status: 404 });
        }

        return Response.json(result.rows[0], { status: 200 });
    } catch (err) {
        console.error("Fetch next activity error:", err);
        return Response.json({ error: "Failed to fetch next activity" }, { status: 500 });
    }
}
