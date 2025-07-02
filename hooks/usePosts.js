import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Safely convert URLSearchParams into an object.
 * Supports repeated keys as arrays.
 */
function extractQueryObject(params) {
  const query = {};
  for (const [key, value] of params.entries()) {
    if (query[key]) {
      query[key] = Array.isArray(query[key]) ? [...query[key], value] : [query[key], value];
    } else {
      query[key] = value;
    }
  }
  return query;
}

/**
 * Hook to fetch posts with filters, sorting, pagination.
 * Also returns available plan states and syncs URL query.
 */
export default function usePosts({ sort, direction, filters, page, limit }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        sort,
        direction,
        page,
        limit,
      });

      if (filters.q) params.append('q', filters.q);
      if (filters.plan_day) params.append('plan_day', filters.plan_day);
      if (filters.min_rating) params.append('min_rating', filters.min_rating);

      if (Array.isArray(filters.dateRange)) {
        const clean = filters.dateRange
          .filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d));

        clean.forEach((d) => params.append('date_range', d));
      }

      filters.plan_state?.forEach((state) => {
        params.append('plan_state', state);
      });

      const newQuery = extractQueryObject(params);
      const currentQuery = extractQueryObject(searchParams);

      if (
        typeof window !== 'undefined' &&
        router?.replace &&
        JSON.stringify(currentQuery) !== JSON.stringify(newQuery)
      ) {
        const search = new URLSearchParams(newQuery).toString();
        router.replace(`/posts?${search}`);
      }

      try {
        const url = `/api/posts?${params.toString()}`;
        const response = await fetch(url);
        const json = await response.json();
        console.log('🧪 Raw response:', json);
        const { posts: rawPosts = [], total: totalCount, planStates } = json;

        setTotal(totalCount);
        setAvailableStates(planStates);

        const withRatings = await Promise.all(
          rawPosts.map(async (post) => {
            try {
              const ratingUrl = `/api/ratings?post_id=${post.post_id}`;
              const res = await fetch(ratingUrl);
              const { average = 0 } = await res.json();
              return { ...post, average };
            } catch {
              return { ...post, average: 0 };
            }
          })
        );

        setPosts(withRatings);
      } catch (err) {
        console.error('❌ Failed to fetch posts:', err);
      }

      setLoading(false);
    };
    console.log('🎯 filters.dateRange from useEffect:', filters.dateRange);
    fetchPosts();
  }, [
    sort,
    direction,
    filters.q,
    filters.plan_day,
    filters.plan_state?.join(','),
    filters.min_rating,
    (filters.dateRange || []).join(','),
    page,
    limit,
  ]);

  return { posts, total, loading, availableStates };
}