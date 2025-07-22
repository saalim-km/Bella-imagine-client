// src/components/community-contest/tab/PostTab.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  setPosts,
  incrementPage,
  toggleLikeCommunity,
  setCurrentCommunity,
} from "@/store/slices/communityDetailsSlice";
import PostCard from "../PostCard";
import PostSkeleton from "../PostSkeleton";
import useInfiniteScroll from "../../../hooks/community/useInfiniteScroll";
import { useSocket } from "@/hooks/socket/useSocket";
import { communityToast } from "@/components/ui/community-toast";
import type { ICommunityPostResponse } from "@/components/User/Home";
import type { RootState, AppDispatch } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAllPostForClient,
  useGetAllPostForVendor,
} from "@/hooks/community/useCommunity";

interface PostsTabProps {
  isMember: boolean;
  communityId: string;
  slug: string;
}

export function PostsTab({ isMember, communityId }: PostsTabProps) {
  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client;
    if (state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  });

  const dispatch = useDispatch<AppDispatch>();
  const { posts, total, page, limit, currentCommunityId } = useSelector(
    (state: RootState) => state.communityDetail
  );
  const queryClient = useQueryClient();
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const { socket } = useSocket();
  const socketListenersSetup = useRef(false);

  // Reset state when community changes
  useEffect(() => {
    if (communityId !== currentCommunityId) {
      dispatch(setCurrentCommunity(communityId));
    }
  }, [communityId, currentCommunityId, dispatch]);

  const {
    data: postsDataClient,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useGetAllPostForClient({ 
    page, 
    limit, 
    enabled: user?.role === "client", 
    communityId: communityId
  });
  
  const {
    data: postsDataVendor,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useGetAllPostForVendor({ 
    page, 
    limit, 
    enabled: user?.role === "vendor", 
    communityId: communityId
  });

  // Memoize postsData to prevent unnecessary re-renders
  const postsData = user?.role === "client" 
    ? postsDataClient?.data 
    : postsDataVendor?.data;

  // Handle data updates - FIXED: Use postsData instead of postsData?.data
  useEffect(() => {
    if (!postsData || communityId !== currentCommunityId) return;

    dispatch(
      setPosts({
        data: postsData.data,
        total: postsData.total,
        replace: page === 1, // Replace only on first page
      })
    );
  }, [postsData, page, communityId, currentCommunityId, dispatch]);

  // Socket listeners setup
  useEffect(() => {
    if (!socket || socketListenersSetup.current) return;

    const handleLikeConfirm = ({
      success,
      postId,
      action,
    }: {
      success: boolean;
      postId: string;
      action: "like" | "unlike";
    }) => {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });

      if (success) {
        const isLiked = action === "like" ? true : false;
        communityToast.success({
          title: "Success",
          description: `Post ${isLiked ? "liked" : "unliked"} successfully`,
        });
        dispatch(toggleLikeCommunity({ postId, isLiked: isLiked }));
        queryClient.invalidateQueries({ queryKey: ["community-post"] });
      } else {
        communityToast.error({
          title: "Error",
          description: "Failed to update like status",
        });
      }
    };

    socket.on("like_confirm", handleLikeConfirm);
    socketListenersSetup.current = true;

    return () => {
      socket.off("like_confirm", handleLikeConfirm);
      socketListenersSetup.current = false;
    };
  }, [socket, dispatch, queryClient]);

  // Determine current loading state
  const isLoading = user?.role === "client" ? isClientLoading : isVendorLoading;

  // Infinite scroll callback - FIXED: Corrected the loading condition
  const loadMorePosts = useCallback(() => {
    if (!isLoading && posts.length < total) {
      dispatch(incrementPage());
    }
  }, [isLoading, posts.length, total, dispatch]);

  const sentinelRef = useInfiniteScroll(loadMorePosts);

  const handleLikeToggle = useCallback(
    (post: ICommunityPostResponse) => {
      if (!post._id || !socket) return;

      // Prevent duplicate requests
      if (likingPosts.has(post._id)) return;

      setLikingPosts((prev) => new Set(prev).add(post._id!));

      const eventName = post.isLiked ? "unLike_post" : "like_post";
      socket.emit(eventName, {
        postId: post._id,
        communityId,
      });
    },
    [socket, likingPosts, communityId]
  );

  if (isClientError || isVendorError) {
    return (
      <p className="text-red-700">Error fetching posts, please try again later</p>
    );
  }

  if (!user) {
    return (
      <p>
        User not found, please try again later or please re-login to continue
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        {isMember ? (
          <Link to={`/community/submit?communityId=${communityId}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </Link>
        ) : (
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLikeToggle={handleLikeToggle}
            isLiking={post._id ? likingPosts.has(post._id) : false}
          />
        ))}

        {isLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}

        {posts.length >= total && posts.length > 0 && (
          <div className="text-center py-6 text-gray-500">
            You've reached the end of the posts
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10 text-center bg-secondary/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share content in this community
            </p>
            {isMember && (
              <Button asChild>
                <Link to={`/community/submit?communityId=${communityId}`}>
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Link>
              </Button>
            )}
          </div>
        )}

        <div ref={sentinelRef} className="h-1 w-full" />
      </div>
    </div>
  );
}