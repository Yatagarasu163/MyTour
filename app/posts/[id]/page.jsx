import PostDetail from '@/pages/components/post/detail/PostDetail';
import ScrollToTopButton from '@/pages/components/post/common/ScrollToTopButton';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { notFound } from 'next/navigation';
import PostReportButton from '@/pages/components/reporting/PostReportButton';

/**
 * Fetch data server-side using async server component pattern (App Router compliant).
 */
export default async function PostPage({ params }) {
  const baseUrl = await getBaseUrl();
  const { id } = await params;

  // Fetch the main post data
  const postRes = await fetch(`${baseUrl}/api/posts?id=${id}`, {
    cache: 'no-store',
  });
  const { posts } = await postRes.json();
  const post = posts?.[0];

  // If not found, return 404
  if (!post) {
    // This throws Next.js' built-in not-found page
    return notFound(); // make sure to import it from 'next/navigation' if needed
  }

  // Fetch rating
  const ratingRes = await fetch(`${baseUrl}/api/ratings?post_id=${id}`, {
    cache: 'no-store',
  });
  const ratingData = await ratingRes.json();

  // Fetch comments
  const commentsRes = await fetch(`${baseUrl}/api/comments?post_id=${id}&limit=10`, {
    cache: 'no-store',
  });
  const comments = await commentsRes.json();

  return (
    <>
      <PostDetail
        post={post}
        average={ratingData.average ?? 0}
        count={ratingData.count ?? 0}
        comments={comments}
      />
      <PostReportButton postId={id}/>
      <ScrollToTopButton />
    </>
  );
}