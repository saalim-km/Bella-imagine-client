import type { RootState } from "@/store/store";
import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInfiniteScroll from "../../hooks/community/useInfiniteScroll";
import PostCard from "../../components/community/PostCard";
import PostSkeleton from "../../components/community/PostSkeleton";
import type { AppDispatch } from "@/store/store";
import CommunityLayout from "@/components/layout/CommunityLayout";
import {
  useGetAllPostForClient,
  useGetAllPostForVendor,
} from "@/hooks/community/useCommunity";
import { incrementPage, setPosts, toggleLike } from "@/store/slices/feedslice";
import { useSocket } from "@/hooks/socket/useSocket";
import { communityToast } from "@/components/ui/community-toast";
import type { ICommunityPostResponse } from "@/components/User/Home";

const ExplorePage: React.FC = () => {
  // Move all hooks to the top level
  const dispatch = useDispatch<AppDispatch>();
  const { limit, page, posts, total } = useSelector(
    (state: RootState) => state.feed
  );
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const user = client || vendor;
  const [isLoading, setIsLoading] = useState(false);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const { socket } = useSocket();
  const socketListenersSetup = useRef(false);

  const {
    data: postsDataClient,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useGetAllPostForClient({ page, limit, enabled: user?.role === "client" });
  const {
    data: postsDataVendor,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useGetAllPostForVendor({ page, limit, enabled: user?.role === "vendor" });

  const postsData = postsDataClient?.data.data
    ? postsDataClient.data
    : postsDataVendor?.data;

  // Update Redux store when new data is fetched
  useEffect(() => {
    if (postsData) {
      dispatch(
        setPosts({
          data: postsData.data,
          total: postsData.total,
        })
      );
      setIsLoading(false);
    }
  }, [postsData, dispatch]);

  // Set up socket listeners once
  useEffect(() => {
    if (!socket || socketListenersSetup.current) return;

    const handleLikeConfirm = ({
      success,
      postId,
      action,
      error,
    }: {
      success: boolean;
      postId: string;
      action: "like" | "unlike";
      error?: string;
    }) => {
      console.log("Like confirm received:", { success, postId, action });

      // Remove from liking state
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });

      if (success) {
        const isLiked = action === "like";
        dispatch(toggleLike({ postId: postId, isLiked: isLiked }));
        communityToast.success({
          title: "Success",
          description: `Post ${isLiked ? "liked" : "unliked"} successfully`,
        });
      } else {
        communityToast.error({
          title: "Error",
          description: error || `Failed to ${action} post. Please try again.`,
        });
      }
    };

    socket.on("like_confirm", handleLikeConfirm);
    socketListenersSetup.current = true;

    // Cleanup function
    return () => {
      socket.off("like_confirm", handleLikeConfirm);
      socketListenersSetup.current = false;
    };
  }, [socket, dispatch]);

  // Infinite scroll callback
  const loadMorePosts = useCallback(() => {
    if (!isLoading && posts.length < total) {
      setIsLoading(true);
      dispatch(incrementPage());
    }
  }, [isLoading, posts.length, total, dispatch]);

  // Initialize infinite scroll
  const infiniteScrollRef = useInfiniteScroll(loadMorePosts);

  const handleLikeToggle = useCallback(
    (post: ICommunityPostResponse) => {
      if (!socket) {
        communityToast.error({
          title: "Connection Error",
          description:
            "Socket connection not available. Please refresh the page.",
        });
        return;
      }

      if (!post._id) {
        communityToast.error({
          title: "Error",
          description: "Invalid post data.",
        });
        return;
      }

      // Prevent multiple simultaneous like/unlike operations on the same post
      if (likingPosts.has(post._id.toString())) {
        return;
      }

      // Add to liking state
      setLikingPosts((prev) => new Set(prev).add(post._id!.toString()));

      const eventName = post.isLiked ? "unLike_post" : "like_post";

      console.log(`Emitting ${eventName} for post:`, post._id);
      socket.emit(eventName, { postId: post._id });
    },
    [socket, likingPosts]
  );

  // Render error or user not found messages after hooks
  if (isClientError || isVendorError) {
    return (
      <CommunityLayout>
        <p className="text-red-700">Error fetching posts, please try again later</p>
      </CommunityLayout>
    );
  }

  if (!user) {
    return (
      <CommunityLayout>
        <p>User not found, please try again later or relogin to continue</p>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="flex-1">
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLikeToggle={handleLikeToggle}
              isLiking={post._id ? likingPosts.has(post._id.toString()) : false}
            />
          ))}

          {(isClientLoading || isVendorLoading) && (
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

          <div ref={infiniteScrollRef} className="h-1 w-full" />
        </div>
      </div>
    </CommunityLayout>
  );
};

export default ExplorePage;