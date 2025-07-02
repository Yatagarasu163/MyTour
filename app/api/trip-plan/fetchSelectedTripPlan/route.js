import { db } from "../../../../lib/actions/pool";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const plan_id = searchParams.get("plan_id");

    if (!plan_id) {
        return Response.json({ error: "Missing plan_id" }, { status: 400 });
    }

    try {
        // Fetch trip plan
        const planResult = await db.query(
            'SELECT * FROM trip_plan WHERE plan_id = $1',
            [plan_id]
        );

        if (planResult.rowCount === 0) {
            return Response.json({ error: "Trip plan not found" }, { status: 404 });
        }

        // Fetch activities
        const activityResult = await db.query(
            'SELECT * FROM activity WHERE plan_id = $1',
            [plan_id]
        );

        const activityIds = activityResult.rows.map(act => act.activity_id);

        // Fetch tags for all activities
        const tagResult = await db.query(
            'SELECT activity_id, tag_name FROM tag WHERE activity_id = ANY($1)',
            [activityIds]
        );

        // Group tags by activity
        const tagsByActivity = {};
        for (const row of tagResult.rows) {
            if (!tagsByActivity[row.activity_id]) {
                tagsByActivity[row.activity_id] = [];
            }
            tagsByActivity[row.activity_id].push(row.tag_name);
        }

        // Attach tags to each activity
        const activitiesWithTags = activityResult.rows.map(activity => ({
            ...activity,
            activity_tags: tagsByActivity[activity.activity_id] || [],
        }));

        // Return plan with activities
        const fullPlan = {
            ...planResult.rows[0],
            activities: activitiesWithTags,
        };

        return Response.json(fullPlan);
    } catch (err) {
        console.error("Fetch trip error:", err);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}