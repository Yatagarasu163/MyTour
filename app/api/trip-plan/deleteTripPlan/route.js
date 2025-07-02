import { db } from "../../../../lib/actions/pool";
import { auth } from "auth";

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const plan_id = searchParams.get("plan_id");

    try {
        const session = await auth();
        if (!session || !session.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user_id = session.user.id;

        // Delete tags, activities, and then the trip plan
        await db.query(`DELETE FROM tag WHERE activity_id IN (SELECT activity_id FROM activity WHERE plan_id = $1)`, [plan_id]);
        await db.query(`DELETE FROM activity WHERE plan_id = $1`, [plan_id]);
        await db.query(`DELETE FROM trip_plan WHERE plan_id = $1 AND user_id = $2`, [plan_id, user_id]);

        return Response.json({ message: "Trip plan deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        return Response.json({ error: "Failed to delete trip plan" }, { status: 500 });
    }
}
