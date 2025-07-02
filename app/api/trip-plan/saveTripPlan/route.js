import { db } from "../../../../lib/actions/pool";
import { auth } from "auth";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, days, state, itinerary } = body;

        if (!name || name.trim().length < 5 || name.trim().length > 100) {
            return Response.json({ error: "Trip name must be between 5 and 100 characters." }, { status: 400 });
        }

        const session = await auth();
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user_id = session.user.id;

        const result = await db.query(
            `INSERT INTO trip_plan (plan_name, plan_day, plan_state, user_id)
             VALUES ($1, $2, $3, $4) RETURNING plan_id`,
            [name, days, state.join(", "), user_id]
        );

        const plan_id = result.rows[0].plan_id;

        for (const day of itinerary) {
            const dayNumber = day.days;

            for (const activity of day.activities) {
                const activityResult = await db.query(
                    `INSERT INTO activity (
                        activity_day_number, activity_place, activity_start_time,
                        activity_end_time, activity_description, activity_estimated_cost,
                        activity_estimated_distance, activity_booking_required, activity_accessible,
                        activity_local_tip, activity_note, plan_id
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
                    RETURNING activity_id`,
                    [
                        dayNumber,
                        activity.place,
                        activity.start_time,
                        activity.end_time,
                        activity.description,
                        activity.estimated_cost,
                        activity.estimated_distance,
                        activity.booking_required,
                        activity.accessible,
                        activity.local_tip,
                        activity.note,
                        plan_id,
                    ]
                );

                const activity_id = activityResult.rows[0].activity_id;

                for (const tag of activity.tags) {
                    await db.query(
                        `INSERT INTO "tag" (tag_name, activity_id) VALUES ($1, $2)`,
                        [tag, activity_id]
                    );
                }
            }
        }

        return Response.json({ message: "Itinerary saved successfully" });
    } catch (err) {
        console.error("Save error:", err);
        return Response.json({ error: "Failed to save itinerary" }, { status: 500 });
    }
}
