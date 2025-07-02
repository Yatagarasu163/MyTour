import { db as pool } from "../../../../lib/actions/pool";

export async function GET(request) {
    try {
        const client = await pool.connect();

        const [
            usersRes,
            postsRes,
            commentsRes,
            reportsRes,
            adminsRes
        ] = await Promise.all([
            client.query('SELECT COUNT(*) FROM users'),   
            client.query('SELECT COUNT(*) FROM post'),
            client.query('SELECT COUNT(*) FROM comment'),
            client.query('SELECT COUNT(*) FROM report'),
            client.query('SELECT COUNT(*) FROM admin'),
        ]);

        client.release();

        const stats = {
            users: parseInt(usersRes.rows[0].count),
            posts: parseInt(postsRes.rows[0].count),
            comments: parseInt(commentsRes.rows[0].count),
            reports: parseInt(reportsRes.rows[0].count),
            admins: parseInt(adminsRes.rows[0].count),
        };

        return new Response(JSON.stringify(stats), { status: 200 });
    } catch (err) {
        console.error('Error fetching stats:', err);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch dashboard stats' }),
            { status: 500 }
        );
    }
}
