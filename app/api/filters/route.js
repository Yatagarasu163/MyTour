// app/api/filters/route.js

import pool from '@/lib/db';

/**
 * GET /api/filters
 *
 * Returns filter dropdown options for posts.
 * - Fetches distinct plan names, plan days, and plan states from trip_plan table
 * - Uses parallel queries for performance
 * - Returns results as { planNames, planDays, planStates }
 *
 * This is an App Router–compliant API route using Web Fetch API standards
 */
export async function GET() {
  try {
    // 🧵 Run all 3 queries in parallel for performance
    const [nameRes, dayRes, stateRes] = await Promise.all([
      pool.query('SELECT DISTINCT plan_name FROM trip_plan WHERE plan_name IS NOT NULL'),
      pool.query('SELECT DISTINCT plan_day FROM trip_plan WHERE plan_day IS NOT NULL'),
      pool.query('SELECT DISTINCT plan_state FROM trip_plan WHERE plan_state IS NOT NULL'),
    ]);

    // 🧹 Format query results into plain arrays
    const planNames = nameRes.rows.map(row => row.plan_name);
    const planDays = dayRes.rows.map(row => row.plan_day).sort((a, b) => a - b); // Ensure numeric order
    const planStates = stateRes.rows.map(row => row.plan_state); // (If comma-separated strings, parse later in client or backend)

    // ✅ Return data as JSON using App Router's Response helper
    return Response.json({ planNames, planDays, planStates });

  } catch (err) {
    console.error('❌ Error fetching filters:', err);

    // 🚨 Return 500 error with appropriate headers
    return new Response(
      JSON.stringify({ error: 'Failed to get filter options' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}