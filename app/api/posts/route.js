import pool from '@/lib/db';
import { buildPostQuery } from '@/lib/posts/postsQueryBuilder';

/**
 * GET /api/posts
 * - Supports filters, sorting, pagination
 * - Special case: ?plansOnly=true returns dropdown values
 * 
 * POST /api/posts
 * - Creates a new post
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // ✅ Plans-only shortcut for dropdowns
  if (searchParams.get('plansOnly') === 'true') {
    try {
      const result = await pool.query(`
        SELECT plan_id, plan_name
        FROM trip_plan
        WHERE plan_status = 1
        ORDER BY plan_name
      `);
      return Response.json(result.rows);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      return new Response(JSON.stringify({ error: 'Failed to fetch plans' }), { status: 500 });
    }
  }

  try {
    const queryObj = {};
    for (const [key, value] of searchParams.entries()) {
      if (queryObj[key]) {
        queryObj[key] = Array.isArray(queryObj[key])
          ? [...queryObj[key], value]
          : [queryObj[key], value];
      } else {
        queryObj[key] = value;
      }
    }
    const {
      sortField,
      sortDir,
      limit,
      offset,
      whereClause,
      values,
      nextParamIndex
    } = buildPostQuery(queryObj);

    const minRating = parseFloat(searchParams.get('min_rating') || '0');

    // ⭐️ Inject rating filter only when avg_rating is joined
    let ratingClause = '';
    const ratingIndex = values.length + 1;
    const baseValues = [...values];

    if (!isNaN(minRating) && minRating > 0) {
      ratingClause = `AND COALESCE(r.avg_rating, 0) >= $${ratingIndex}`;
      baseValues.push(minRating);
    }

    const baseJoin = `
      FROM post p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN trip_plan pl ON p.plan_id = pl.plan_id
      LEFT JOIN (
        SELECT post_id, AVG(rating_score) as avg_rating
        FROM rating
        GROUP BY post_id
      ) r ON p.post_id = r.post_id
      LEFT JOIN (
        SELECT post_id, COUNT(*) as comment_count
        FROM comment
        GROUP BY post_id
      ) c ON p.post_id = c.post_id
    `;

    // 📊 Count for pagination (only filters, including rating if present)
    const countQuery = `SELECT COUNT(*) ${baseJoin} ${whereClause} ${ratingClause}`;
    const countResult = await pool.query(countQuery, baseValues);
    const total = parseInt(countResult.rows[0].count, 10);

    // 📊 Sidebar plan state counts (no rating filters here)
    const stateCountQuery = `
      SELECT s.name AS plan_state, COUNT(*) AS count
      FROM (
        SELECT DISTINCT p.post_id, unnest(string_to_array(pl.plan_state, ',')) AS name
        FROM post p
        LEFT JOIN trip_plan pl ON p.plan_id = pl.plan_id
      ) s
      GROUP BY s.name
      ORDER BY s.name
    `;
    const stateCountResult = await pool.query(stateCountQuery);

    const allStates = [
      'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
      'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
      'Terengganu', 'Kuala Lumpur (Federal Territory)', 'Putrajaya (Federal Territory)', 'Labuan (Federal Territory)'
    ];

    const rawMap = new Map(
      stateCountResult.rows.map(({ plan_state, count }) => [
        plan_state.trim(),
        parseInt(count, 10)
      ])
    );

    const planStates = allStates.map(name => ({
      name,
      count: rawMap.get(name) || 0
    }));

    // 🗂️ Main data query with pagination
    const dataQuery = `
      SELECT 
        p.post_id,
        p.post_title,
        p.post_description,
        p.post_timestamp,
        p.post_status,
        p.plan_id,
        p.user_id,
        u.user_name,
        pl.plan_name,
        pl.plan_day,
        pl.plan_state,
        COALESCE(r.avg_rating, 0) as average,
        COALESCE(c.comment_count, 0) as comment_count
      ${baseJoin}
      ${whereClause} ${ratingClause}
      ORDER BY ${sortField} ${sortDir}
      LIMIT $${baseValues.length + 1} OFFSET $${baseValues.length + 2}
    `;

    const dataValues = [...baseValues, parseInt(limit), offset];
    const postResult = await pool.query(dataQuery, dataValues);

    return Response.json({
      posts: postResult.rows,
      total,
      planStates
    });

  } catch (err) {
    console.error('GET error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { plan_id, user_id, post_title, post_description, post_status } = await request.json();
    if (!plan_id || !user_id || !post_title || !post_description) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const statusValue = post_status === 0 ? 0 : 1;
    const insertQuery = `
      INSERT INTO post (
        plan_id,
        user_id,
        post_title,
        post_description,
        post_status,
        post_timestamp
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [
      plan_id,
      user_id,
      post_title,
      post_description,
      statusValue
    ]);

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error('POST error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), { status: 500 });
  }
}