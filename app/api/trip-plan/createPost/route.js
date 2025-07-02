import { db } from "../../../../lib/actions/pool";
import { auth } from "auth";

export async function POST(req) {
    try {
        const body = await req.json();
        const { title, description, plan_id } = body;

        if (!title || !description || !plan_id) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const session = await auth();
        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user_id = session.user.id;

        await db.query(
            `INSERT INTO post (post_title, post_description, plan_id, user_id)
             VALUES ($1, $2, $3, $4)`,
            [title, description, plan_id, user_id]
        );

        return Response.json({ success: true }, { status: 200 });

    } catch (err) {
        console.error("Post creation error:", err);
        return Response.json({ error: "Failed to create post" }, { status: 500 });
    }
}
