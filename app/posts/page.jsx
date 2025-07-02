'use client';
// React + Next.js hooks
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const PostFilterSidebar = dynamic(() => import('@/pages/components/post/filters/PostFilterSidebar'), {
  ssr: false,
});

// UI components
import PostList from '@/pages/components/post/layout/PostList';
import PostSortControls from '@/pages/components/post/filters/PostSortControls';
import PostPagination from '@/pages/components/post/filters/PostPagination';
import ScrollToTopButton from '@/pages/components/post/common/ScrollToTopButton';
import CreatePostButton from '@/pages/components/post/form/CreatePostButton';

// Custom hooks
import useDebouncedValue from '@/hooks/useDebouncedValue';
import usePosts from '@/hooks/usePosts';
import useFilterOptions from '@/hooks/useFilterOptions';
import usePostControls from '@/hooks/usePostControls';

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  // 🎛️ Centralized UI state: filters, sort, direction, pagination
  const {
    sort,
    setSort,
    direction,
    setDirection,
    filters,
    debouncedQuery,
    handleFilterChange,
    handleClearFilters,
    page,
    setPage,
    limit
  } = usePostControls(query);

  // 📊 Fetch available filter options (plan days and states)
  const filterOptions = useFilterOptions();

  // 📥 Fetch posts based on current filters and sort
  const { posts, total, loading, availableStates } = usePosts({
    sort,
    direction,
    filters: { ...filters, q: debouncedQuery }, // Use debounced search input
    page,
    limit
  });

  // 🔢 Calculate total pages for pagination
  const totalPages = Math.ceil(total / limit);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>All Posts</h1>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
        {/* 🔍 Sidebar: filters for search, plan day/state, rating, date range */}
        <PostFilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          options={{
            planDays: filterOptions.planDays,    // Static options from backend
            planStates: availableStates          // Dynamic options with post counts
          }}
        />

        {/* 📦 Main content: sort controls, post list, pagination */}
        <div style={{ flex: 1 }}>
          {/* 🔽 Sort controls and create button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <PostSortControls
              sort={sort}
              direction={direction}
              onSortChange={(val) => {
                setSort(val);
                setPage(1); // Reset to first page on sort change
              }}
              onDirectionChange={(val) => {
                setDirection(val);
                setPage(1);
              }}
            />
            <CreatePostButton />
          </div>

          {/* 🗂️ Post list or loading state */}
          <PostList
            posts={posts}
            loading={loading}
            query={filters.q}
            currentPage={page}
            limit={limit}
            total={total}
          />

          {/* 📄 Pagination controls */}
          <PostPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* ⬆️ Floating scroll-to-top button */}
      <ScrollToTopButton />
    </main>
  );
}