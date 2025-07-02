import { db } from "../../../../lib/actions/pool";
import { auth } from "auth";

export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user_id = session.user.id;
    
    try {
        const result = await db.query(
            'SELECT * FROM trip_plan WHERE user_id = $1',
            [user_id]
        );

        const plans = result.rows;
        const plansWithActivities = [];

        //Join activities with trip plan
        for (const plan of plans) {
            const activityResult = await db.query(
                'SELECT * FROM activity WHERE plan_id = $1',
                [plan.plan_id]
            )

            plansWithActivities.push({
                ...plan,
                activities: activityResult.rows
            });
        }

        return Response.json(plansWithActivities);

    } catch (err) {
        console.error("DB error:", err);
        return Response.json({ error: "Failed to fetch trip plan" }, { status: 500 });
    }
}