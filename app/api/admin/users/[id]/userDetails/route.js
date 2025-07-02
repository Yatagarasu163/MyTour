import { db } from "@/lib/actions/pool";

export async function GET(request, context){
    const params = await Promise.resolve(context.params);
    const id = params.id;

    try{
        const result = await db.query(`SELECT * FROM USERS WHERE USER_ID=$1`, [id]);
        if (result.rowCount === 0) {
            return new Response(
                JSON.stringify({ error: "No post found" }),
                { status: 400 }
            );
        }

        return new Response(
        JSON.stringify({ user: result.rows[0]}), 
        { status: 200 }
        );
    } catch (err) {
        console.error("Error fetching top posts:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
    }
}