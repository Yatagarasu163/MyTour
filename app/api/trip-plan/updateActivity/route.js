import { db } from "../../../../lib/actions/pool";

export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            activity_id,
            activity_place,
            activity_description,
            activity_start_time,
            activity_end_time,
            activity_estimated_cost,
            activity_estimated_distance,
            activity_booking_required,
            activity_accessible,
            activity_local_tip,
            activity_note,
            activity_tags
        } = body;

        // Update main activity
        await db.query(
            `UPDATE activity SET 
                activity_place = $1,
                activity_description = $2,
                activity_start_time = $3,
                activity_end_time = $4,
                activity_estimated_cost = $5,
                activity_estimated_distance = $6,
                activity_booking_required = $7,
                activity_accessible = $8,
                activity_local_tip = $9,
                activity_note = $10
             WHERE activity_id = $11`,
            [
                activity_place,
                activity_description,
                activity_start_time,
                activity_end_time,
                activity_estimated_cost,
                activity_estimated_distance,
                activity_booking_required,
                activity_accessible,
                activity_local_tip,
                activity_note,
                activity_id
            ]
        );

        // Update tags if provided
        if (Array.isArray(activity_tags)) {
            await db.query(`DELETE FROM tag WHERE activity_id = $1`, [activity_id]);

            for (const tag of activity_tags) {
                await db.query(
                    `INSERT INTO tag (activity_id, tag_name) VALUES ($1, $2)`,
                    [activity_id, tag]
                );
            }
        }

        return Response.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Update error:", err);
        return Response.json({ error: "Failed to update activity" }, { status: 500 });
    }
}

export async function GET() {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
