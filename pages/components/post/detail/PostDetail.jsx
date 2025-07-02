'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Subcomponents
import PostHeader from '../card/PostHeader';
import PostActions from '../card/PostActions';
import PostTripPanel from '../card/PostTripPanel';
import PostContent from '../card/PostContent';
import PostRatingPanel from '../detail/PostRatingPanel';
import PostComments from '../detail/PostComments';
import RatingStars from '../detail/RatingStars';
import RelativeTime from '../detail/RelativeTime';
import LoadingFallback from '../common/LoadingFallback';

export default function PostDetail({ post, comments, ...initial }) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState(comments);
  const [offset, setOffset] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(comments.length === 10);
  const sentinelRef = useRef(null);

  const [average, setAverage] = useState(initial.average);
  const [count, setCount] = useState(initial.count);

  const { data: session, status } = useSession();
  console.log(session);
  const currentUser = { user_id: 14, user_name: 'abu' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    const res = await fetch(`/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: post.post_id,
        user_id: currentUser.user_id,
        user_name: currentUser.user_name,
        comment_text: newComment.trim(),
      }),
    });

    const posted = await res.json();
    const newCommentObj = {
      ...posted,
      comment_text: newComment.trim(),
      comment_timestamp: new Date().toISOString(),
      user_name: currentUser.user_name,
    };

    setCommentList((prev) => [newCommentObj, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const res = await fetch(
      `/api/comments?post_id=${post.post_id}&limit=10&offset=${offset}`
    );
    const newComments = await res.json();

    if (newComments.length > 0) {
      setCommentList((prev) => [...prev, ...newComments]);
      setOffset((prev) => prev + 10);
      setHasMore(newComments.length === 10);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  const refreshRatings = async () => {
    const res = await fetch(
      `/api/ratings?post_id=${post.post_id}`
    );
    const data = await res.json();
    setAverage(data.average ?? 0);
    setCount(data.count ?? 0);
  };

  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loadingMore, offset]);

  if (router.isFallback) return <LoadingFallback />;

  return (
    <main style={{ padding: '2rem' }}>
      <Link href="/posts" className="inline-block mb-4 text-blue-600">
        ← Back to Posts
      </Link>

      <PostHeader
        title={post.post_title}
        authorName={post.user_name}
        userId={post.user_id}
        localTime={<RelativeTime timestamp={post.post_timestamp} />}
      />

      <PostActions
        postId={post.post_id}
        ownerId={post.user_id}
        currentUser={currentUser}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          marginTop: '2rem',
          alignItems: 'flex-start',
        }}
      >
        <PostRatingPanel
          average={average}
          count={count}
          postId={post.post_id}
          currentUser={currentUser}
          onRated={refreshRatings}
        />

        <PostTripPanel
          name={post.plan_name}
          day={post.plan_day}
          state={post.plan_state}
        />
      </div>

      <PostContent description={post.post_description} />

      <PostComments
        currentUser={currentUser}
        newComment={newComment}
        setNewComment={setNewComment}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        commentList={commentList}
        setCommentList={setCommentList}
        sentinelRef={sentinelRef}
        loadingMore={loadingMore}
      />
    </main>
  );
}