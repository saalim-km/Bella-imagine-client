// src/pages/ExplorePage.tsx
import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInfiniteScroll from "./useInfiniteScroll";
import { fetchPosts } from "@/store/slices/feedThunk";
import { setFilter } from "@/store/slices/feedslice";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import Sidebar from "./Sidebar";
import type { AppDispatch } from "@/store/store";
import Header from "@/components/common/Header";
import LeftSidebar from "./Leftsidebar";

const ExplorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error, hasMore, filter } = useSelector(
    (state: RootState) => state.feed
  );
  const sentinelRef = useInfiniteScroll(() => {
    if (hasMore && !loading) {
      dispatch(fetchPosts(posts.length / 10, filter));
    }
  });

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts(0, filter));
    }
  }, [dispatch, filter, posts.length]);

  const handleFilterChange = (newFilter: "recent" | "top" | "trending") => {
    dispatch(setFilter(newFilter));
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <LeftSidebar />

          {/* Main Feed */}
          <div className="flex-1">
            <div className="mb-6">
              <Tabs
                defaultValue="recent"
                value={filter}
                onValueChange={(value) =>
                  handleFilterChange(value as "recent" | "top" | "trending")
                }
              >
                <TabsList>
                  <TabsTrigger value="recent">Most Recent</TabsTrigger>
                  <TabsTrigger value="top">Most Upvoted</TabsTrigger>
                  <TabsTrigger value="trending">Trending Today</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {(loading || hasMore) && (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              )}

              {!hasMore && posts.length > 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  You've reached the end of the feed
                </div>
              )}

              {!loading && posts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No posts found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try changing your filters
                  </p>
                </div>
              )}

              <div ref={sentinelRef} className="h-1 w-full" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 space-y-6">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
