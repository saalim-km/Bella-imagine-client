import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInfiniteScroll from "../../components/community-contest/useInfiniteScroll";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "../../components/community-contest/PostCard";
import PostSkeleton from "../../components/community-contest/PostSkeleton";
import type { AppDispatch } from "@/store/store";
import CommunityLayout from "@/components/layout/CommunityLayout";
import { useGetAllPost } from "@/hooks/community-contest/useCommunity";
import { incrementPage, setPosts, toggleLike, updatePost } from "@/store/slices/feedslice";
import { LoadingBar } from "@/components/ui/LoadBar";
import { useSocket } from "@/context/SocketContext";
import { communityToast } from "@/components/ui/community-toast";
import { ICommunityPostResponse } from "@/components/User/Home";

const ExplorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { limit, page, posts, total } = useSelector(
    (state: RootState) => state.feed
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const { data: postsData, isFetching } = useGetAllPost({ page, limit });

  // Update Redux store when new data is fetched
  useEffect(() => {
    if (postsData) {
      dispatch(
        setPosts({
          data: postsData.data.data,
          total: postsData.data.total,
        })
      );
      setIsLoading(false);
    }
  }, [postsData, dispatch]);

  // Handle errors
  useEffect(() => {
    if (isFetching) {
      setError(null);
    }
  }, [isFetching]);

  // Infinite scroll callback
  const loadMorePosts = () => {
    if (!isLoading && posts.length < total) {
      setIsLoading(true);
      dispatch(incrementPage());
    }
  };

  // Initialize infinite scroll
  const sentinelRef = useInfiniteScroll(loadMorePosts);

  const handleLike = (post : ICommunityPostResponse) => {
    if (!socket) {
      console.error("Socket is not connected");
      // You can also trigger a toast or dispatch an error to Redux
      return;
    }
    socket.emit("like_post", { postId : post._id, isLike : post.isLiked });

    socket.on("like_confirm", ({ success }: { success: boolean }) => {
      alert('like confirmed trigger')
      if (success) {
        dispatch(toggleLike({ postId: post._id!, isLiked: !post.isLiked }));
        dispatch(updatePost(post))
        return;
      }

      communityToast.error({
        title: "An error occured",
        description: "error occured liking post , please try again later.",
      });
    });
  };

  const handleUnLike = (post : ICommunityPostResponse) => {
    if (!socket) {
      console.error("Socket is not connected");
      // You can also trigger a toast or dispatch an error to Redux
      return;
    }

    socket.emit("unLike_post", { postId : post._id });
    socket.on("like_confirm", ({ success }: { success: boolean }) => {
      alert('like confirmed trigger')
      if (success) {
        alert('trigger togglelike ')
        dispatch(toggleLike({ postId: post._id!, isLiked: !post.isLiked }));
        return;
      }

      communityToast.error({
        title: "An error occured",
        description: "error occured unLiking post , please try again later.",
      });
    });
  };

  if (isFetching) return <LoadingBar />;
  return (
    <CommunityLayout>
      <div className="flex-1">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              handleUnLike={handleUnLike}
              handleLike={handleLike}
              key={post._id}
              post={post}
            />
          ))}

          {(isLoading || isFetching) && (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {posts.length >= total && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              You've reached the end of the feed
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No posts found</h3>
              <p className="text-gray-500">
                Try changing your filters or create a new post
              </p>
            </div>
          )}

          <div ref={sentinelRef} className="h-1 w-full" />
        </div>
      </div>
    </CommunityLayout>
  );
};

export default ExplorePage;
