import { db } from "../../../../lib/actions/pool";

export async function DELETE(req) {
    const url = new URL(req.url);
    const activity_id = url.searchParams.get("activity_id");

    if (!activity_id) {
        return new Response(JSON.stringify({ error: "Missing activity_id" }), { status: 400 });
    }

    try {
        await db.query(`DELETE FROM tag WHERE activity_id = $1`, [activity_id]);
        await db.query(`DELETE FROM activity WHERE activity_id = $1`, [activity_id]);

        return new Response(JSON.stringify({ message: "Activity deleted" }), { status: 200 });
    } catch (err) {
        console.error("Delete error:", err);
        return new Response(JSON.stringify({ error: "Failed to delete activity" }), { status: 500 });
    }
}
