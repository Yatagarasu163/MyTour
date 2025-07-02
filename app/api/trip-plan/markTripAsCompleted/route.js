import { db } from "../../../../lib/actions/pool";

export async function PUT(req) {
    try {
        const body = await req.json();
        const { plan_id } = body;

        if (!plan_id) {
            return Response.json({ error: "Missing plan_id" }, { status: 400 });
        }

        await db.query(
            `UPDATE trip_plan SET plan_status = 1 WHERE plan_id = $1`,
            [plan_id]
        );

        return Response.json(
            { success: true, message: "Trip marked as completed." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating trip status:", error);
        return Response.json({ error: "Failed to update trip status" }, { status: 500 });
    }
}
