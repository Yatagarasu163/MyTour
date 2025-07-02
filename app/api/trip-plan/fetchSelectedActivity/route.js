import { db } from "../../../../lib/actions/pool";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const activity_id = searchParams.get("activity_id");

    if (!activity_id) {
        return Response.json({ error: "Missing activity_id" }, { status: 400 });
    }

    try {
        const activityResult = await db.query(
            "SELECT * FROM activity WHERE activity_id = $1",
            [activity_id]
        );

        if (activityResult.rowCount === 0) {
            return Response.json({ error: "Activity not found" }, { status: 404 });
        }

        const current = activityResult.rows[0];

        const allActivities = await db.query(
            "SELECT * FROM activity WHERE plan_id = $1 AND activity_day_number = $2 ORDER BY activity_start_time",
            [current.plan_id, current.activity_day_number]
        );

        //Get the previous activity for previous place
        const index = allActivities.rows.findIndex(a => a.activity_id === current.activity_id);
        const previousActivity = index > 0 ? allActivities.rows[index - 1] : null;
        const previousPlace = previousActivity?.activity_place || null;

        const tagResult = await db.query(
            "SELECT tag_name FROM tag WHERE activity_id = $1",
            [activity_id]
        );
        const tags = tagResult.rows.map(row => row.tag_name);

        current.activity_tags = tags;

        return Response.json({ ...current, previousPlace }, { status: 200 });
    } catch (err) {
        console.error("Fetch error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
