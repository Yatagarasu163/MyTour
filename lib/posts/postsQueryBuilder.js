/**
 * Dynamically builds a SQL query for fetching posts with filters, sorting, and pagination.
 * Returns query fragments and parameter values for safe use with parameterized queries.
 */
export function buildPostQuery(queryParams) {
  const {
    id, plan_id, user_id, status, q,
    start_date, end_date,
    plan_name, plan_day, plan_state,
    sort = 'post_timestamp',
    direction = 'desc',
    page = 1, limit = 10,
    min_rating, date_range
  } = queryParams;

  const allowedSortFields = [
    'post_id', 'post_title', 'post_timestamp',
    'post_status', 'plan_id', 'average', 'comment_count'
  ];

  // 🎯 Determine SQL sort field based on input
  let sortField;
  if (sort === 'post_title') {
    sortField = 'TRIM(LOWER(p.post_title))'; // Case-insensitive alphabetical sort
  } else if (sort === 'average') {
    sortField = 'COALESCE(r.avg_rating, 0)'; // Sort by rating
  } else if (sort === 'comment_count') {
    sortField = 'COALESCE(c.comment_count, 0)'; // Sort by comment count
  } else if (allowedSortFields.includes(sort)) {
    sortField = `p.${sort}`;
  } else {
    sortField = 'p.post_timestamp'; // Default fallback
  }

  const sortDir = direction.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const filters = [];
  const values = [];
  let i = 1;

  // 🧱 Build WHERE clause filters
  if (id) filters.push(`p.post_id = $${i++}`), values.push(id);
  if (plan_id) filters.push(`p.plan_id = $${i++}`), values.push(plan_id);
  if (user_id) filters.push(`p.user_id = $${i++}`), values.push(user_id);
  if (status !== undefined) filters.push(`p.post_status = $${i++}`), values.push(status);

  if (q) {
    filters.push(`(p.post_title ILIKE $${i} OR p.post_description ILIKE $${i})`);
    values.push(`%${q}%`);
    i++;
  }

  if (start_date) filters.push(`p.post_timestamp >= $${i++}`), values.push(start_date);
  if (end_date) filters.push(`p.post_timestamp <= $${i++}`), values.push(end_date);

  if (plan_name) filters.push(`pl.plan_name ILIKE $${i++}`), values.push(`%${plan_name}%`);
  if (plan_day) filters.push(`pl.plan_day = $${i++}`), values.push(plan_day);

  if (plan_state) {
    const states = Array.isArray(plan_state) ? plan_state : [plan_state];
    if (states.length > 0) {
      const conditions = states.map(() => `pl.plan_state ILIKE $${i++}`);
      filters.push(`(${conditions.join(' OR ')})`);
      values.push(...states.map((s) => `%${s}%`));
    }
  }

  // 🕒 Handle flexible date range filtering
  let normalizedDateRange = [];

  if (typeof date_range === 'string') {
    normalizedDateRange = [date_range];
  } else if (Array.isArray(date_range)) {
    normalizedDateRange = date_range;
  }

  if (normalizedDateRange.length === 2) {
    filters.push(`p.post_timestamp >= $${i++}`);
    values.push(normalizedDateRange[0]);

    filters.push(`p.post_timestamp <= $${i++}`);
    values.push(normalizedDateRange[1]);
  } else if (normalizedDateRange.length === 1) {
    filters.push(`p.post_timestamp >= $${i++}`);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(normalizedDateRange[0]));
    values.push(daysAgo.toISOString());
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  return {
    sortField,
    sortDir,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    whereClause,
    values,
    nextParamIndex: i
  };
}