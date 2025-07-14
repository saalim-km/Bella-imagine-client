"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import CommunityLayout from "@/components/layout/CommunityLayout";
import {
  useAddComment,
  useGetPostDetailsClient,
  useGetPostDetailsVendor,
} from "@/hooks/community/useCommunity";
import { LoadingBar } from "@/components/ui/LoadBar";
import { Textarea } from "@/components/ui/textarea";
import { communityToast } from "@/components/ui/community-toast";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  addCommentServiceClient,
  addCommentServiceVendor,
} from "@/services/community/communityService";
import Pagination from "@/components/common/Pagination";
import { useSocket } from "@/hooks/socket/useSocket";
import { useDispatch } from "react-redux";
import { toggleLike } from "@/store/slices/feedslice";
import type { BasePaginatedResponse } from "@/services/client/clientService";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { PostDetailsResponse } from "@/types/interfaces/Community";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams();
  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client;
    if (state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  });
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const [commentContent, setCommentContent] = useState("");
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const commentLimit = 4;
  const isLiking = postId ? likingPosts.has(postId.toString()) : false;

  const queryData = {
    postId: postId!,
    limit: commentLimit,
    page: page,
  };

  const {
    data: postDetailsClient,
    isLoading: isLoadingClient,
    refetch: clientRefetch,
  } = useGetPostDetailsClient({
    ...queryData,
    enabled: user?.role === "client",
  });

  const {
    data: postDetailsVendor,
    isLoading: isLoadingVendor,
    refetch: vendorRefresh,
  } = useGetPostDetailsVendor({
    ...queryData,
    enabled: user?.role === "vendor",
  });

  const totalComments = postDetailsClient?.data
    ? postDetailsClient.data.totalComments
    : postDetailsVendor?.data.totalComments || 0;

  const totalPages = Math.max(1, Math.ceil(totalComments / commentLimit));

  const addCommentMutateFn =
    user?.role === "client" ? addCommentServiceClient : addCommentServiceVendor;

  const { mutate: addComment, isPending } = useAddComment(addCommentMutateFn);

  const post = postDetailsClient?.data
    ? postDetailsClient.data
    : postDetailsVendor?.data;

  const isPostLiked = Boolean(post?.isLiked);
  const queryClient = useQueryClient();

  const socketListenerSetup = useRef(false);

  useEffect(() => {
    if (!socket || socketListenerSetup.current) {
      return;
    }

    function handleLikeConfirm({
      success,
      postId,
      action,
      error,
    }: {
      success: boolean;
      postId: string;
      action: "like" | "unlike";
      error?: string;
    }) {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId.toString());
        return newSet;
      });

      if (success) {
        const isLiked = action === "like";
        dispatch(toggleLike({ postId: postId, isLiked: isLiked }));

        queryClient.setQueryData(
          ["post", postId, page],
          (oldData: BasePaginatedResponse<PostDetailsResponse> | undefined) => {
            if (!oldData?.data) return oldData;

            const currentPost = oldData.data;
            const updatedPost = {
              ...currentPost,
              likeCount: isLiked
                ? (currentPost.likeCount || 0) + 1
                : Math.max(0, (currentPost.likeCount || 0) - 1),
              isLiked: isLiked,
            };

            return {
              ...oldData,
              data: updatedPost,
            };
          }
        );

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
    }

    socket.on("like_confirm", handleLikeConfirm);
    socketListenerSetup.current = true;

    return () => {
      socket.off("like_confirm", handleLikeConfirm);
      socketListenerSetup.current = false;
    };
  }, [socket, dispatch, queryClient, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      addComment(
        { content: commentContent, postId: postId! },
        {
          onSuccess: (data) => {
            if (user?.role === "client") {
              clientRefetch();
            } else {
              vendorRefresh();
            }
            queryClient.invalidateQueries({ queryKey: ["comments"] });
            communityToast.success({
              title: "Comment added",
              description: data.message,
            });
          },
          onError: (err) => {
            handleError(err);
          },
        }
      );
      setCommentContent("");
    } catch (error) {
      handleError(error);
    }
  };

  const handlelikeToggle = useCallback(() => {
    if (!socket) {
      communityToast.error({
        title: "Connection Error",
        description:
          "Socket connection not available. Please refresh the page.",
      });
      return;
    }

    if (!postId) {
      communityToast.error({
        title: "Error",
        description: "Invalid post data.",
      });
      return;
    }

    if (likingPosts.has(postId.toString())) {
      return;
    }

    if (!post) {
      communityToast.error({
        title: "Error",
        description: "Post data not available.",
      });
      return;
    }

    setLikingPosts((prev) => new Set(prev).add(postId.toString()));
    const eventName = isPostLiked ? "unLike_post" : "like_post";
    socket.emit(eventName, { postId: postId });
  }, [socket, likingPosts, postId, isPostLiked, post]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            User not found. Please try again later or re-login to continue.
          </p>
        </Card>
      </div>
    );
  }

  if (!postId) {
    return (
      <CommunityLayout>
        <Card className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            Post ID is required to fetch details. Please try again later.
          </p>
        </Card>
      </CommunityLayout>
    );
  }

  if (isLoadingClient || isLoadingVendor) {
    return (
      <CommunityLayout>
        <LoadingBar />
      </CommunityLayout>
    );
  }

  if (!post) {
    return (
      <CommunityLayout>
        <Card className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            Post not found or failed to load. Please try again later.
          </p>
        </Card>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Main Post - Reddit Style */}
        <Card className="overflow-hidden bg-white dark:bg-background border border-gray-200 dark:border-gray-800">
          <div className="flex">
            {/* Left voting section */}
            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 min-w-[56px]">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
              ></Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handlelikeToggle}
                disabled={isLiking}
                className={`p-1 h-8 w-8 font-semibold text-sm transition-colors ${
                  isPostLiked
                    ? "text-orange-500 hover:text-orange-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-orange-500"
                } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLiking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart
                    className={`w-4 h-4 ${isPostLiked ? "fill-current" : ""}`}
                  />
                )}
              </Button>

              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                {post?.likeCount || 0}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              ></Button>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={post.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={post?.userName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm bg-gray-200 dark:bg-gray-700">
                    {post?.userId.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {post?.userName}
                  </span>
                  <span>•</span>
                  <span>
                    {post?.createdAt &&
                      formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                  </span>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1 ml-auto">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs px-2 py-0 h-5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0 h-5 text-gray-500 dark:text-gray-400"
                      >
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 leading-tight">
                {post?.title}
              </h1>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {post?.content}
              </p>

              {/* Media section */}
              {Array.isArray(post?.media) && post.media.length > 0 && (
                <div className="mb-4 -mx-4">
                  <div
                    className={`${
                      post.media.length === 1
                        ? "grid grid-cols-1"
                        : post.media.length === 2
                        ? "grid grid-cols-2"
                        : "grid grid-cols-2 md:grid-cols-3"
                    } gap-1`}
                  >
                    {post.media.map((mediaUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                          post.media.length === 1
                            ? "aspect-video"
                            : "aspect-square"
                        }`}
                      >
                        {post.mediaType === "image" ? (
                          <img
                            src={
                              mediaUrl ||
                              "/placeholder.svg?height=400&width=400"
                            }
                            alt={`Post media ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                          />
                        ) : (
                          <video
                            controls
                            className="w-full h-full object-contain"
                            preload="metadata"
                          >
                            <source src={mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-3 py-1 h-8 text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post?.totalComments || 0} Comments</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 px-3 py-1 h-8 text-sm font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 h-8 w-8"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Comment Input - Reddit Style */}
        <Card className="p-4 bg-white dark:bg-background border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage
                src={user.avatar || "/placeholder.svg?height=32&width=32"}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="text-sm bg-gray-200 dark:bg-gray-700">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <form onSubmit={handleCommentSubmit} className="flex-1">
              <div className="relative">
                <Textarea
                  placeholder="What are your thoughts?"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full min-h-[80px] resize-none border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400 rounded-lg"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    disabled={isPending || !commentContent.trim()}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 h-8 text-sm font-medium"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-1" />
                        Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>

        {/* Comments Section - Reddit Style */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Comments ({totalComments})
            </h3>
          </div>

          {post?.comments?.map((comment) => (
            <Card
              key={comment._id}
              className="bg-white dark:bg-background border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="flex">
                {/* Comment content */}
                <div className="flex-1 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          comment.avatar ||
                          "/placeholder.svg?height=24&width=24"
                        }
                        alt={comment.userName}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                        {comment.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {comment.userName}
                      </span>
                      <span>•</span>
                      <span>
                        {comment.createdAt &&
                          formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    {comment.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={page}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </CommunityLayout>
  );
};

export default PostDetailPage;
