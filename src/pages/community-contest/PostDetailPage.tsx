import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import CommunityLayout from "@/components/layout/CommunityLayout";
import {
  useAddComment,
  useGetPostDetailsClient,
  useGetPostDetailsVendor,
} from "@/hooks/community-contest/useCommunity";
import { LoadingBar } from "@/components/ui/LoadBar";
import { Textarea } from "@/components/ui/textarea";
import { communityToast } from "@/components/ui/community-toast";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  addCommentServiceClient,
  addCommentServiceVendor,
  PostDetailsInput,
  PostDetailsResponse,
} from "@/services/community-contest/communityService";
import Pagination from "@/components/common/Pagination";
import { useSocket } from "@/context/SocketContext";
import { useDispatch } from "react-redux";
import { toggleLike } from "@/store/slices/feedslice";
import { BasePaginatedResponse } from "@/services/client/clientService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const PostDetailPage: React.FC = () => {
    const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client;
    if (state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  });

  if (!user) {
    return (
      <p className="text-red-700">
        user not found please try again later , or please relogin to continue
      </p>
    );
  }

  const { postId } = useParams();
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

  const { data : postDetailsClient, isLoading : isLoadingClient } = useGetPostDetailsClient({...queryData,enabled : user.role === 'client'});
  const { data : postDetailsVendor, isLoading : isLoadingVendor } = useGetPostDetailsVendor({...queryData,enabled : user.role === 'vendor'});


  const totalComments = postDetailsClient?.data ? postDetailsClient.data.totalComments : postDetailsVendor?.data.totalComments || 0
  const totalPages = Math.max(1, Math.ceil(totalComments / commentLimit));

  const addCommentMutateFn = user.role === 'client' ? addCommentServiceClient : addCommentServiceVendor
  const { mutate: addComment, isPending } = useAddComment(addCommentMutateFn);
  
  // Fix 1: Better handling of post data and isLiked state
  const post = postDetailsClient?.data ? postDetailsClient.data : postDetailsVendor?.data
  const isPostLiked = Boolean(post?.isLiked); // Ensure it's always a boolean
  const queryClient = useQueryClient();
  
  console.log('post details 🤞', post);
  console.log('isPostLiked:', isPostLiked); // Debug log
  
  let socketListenerSetup = useRef(false);

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
        
        // Fix 2: Properly update query cache without mutation
        queryClient.setQueryData(
          ["post", postId, page],
          (oldData: BasePaginatedResponse<PostDetailsResponse> | undefined) => {
            if (!oldData?.data) return oldData;
            
            const currentPost = oldData.data;
            // Create new objects instead of mutating
            const updatedPost = {
              ...currentPost,
              likeCount: isLiked 
                ? (currentPost.likeCount || 0) + 1 
                : Math.max(0, (currentPost.likeCount || 0) - 1),
              isLiked: isLiked,
            };
            
            return {
              ...oldData,
              data: updatedPost
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
  }, [socket, dispatch, queryClient, page]); // Fix 3: Add missing dependencies

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
            queryClient.invalidateQueries({ queryKey: ["post", postId, page] });
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
        description: "Socket connection not available. Please refresh the page.",
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

    // Fix 4: Add additional safety check
    if (!post) {
      communityToast.error({
        title: "Error",
        description: "Post data not available.",
      });
      return;
    }

    setLikingPosts((prev) => new Set(prev).add(postId.toString()));

    // Remove the alert - it was for debugging
    console.log('Current like status:', isPostLiked);
    const eventName = isPostLiked ? "unLike_post" : "like_post";
    socket.emit(eventName, { postId: postId });
  }, [socket, likingPosts, postId, isPostLiked, post]); // Fix 5: Add proper dependencies

  if (!postId) {
    return <p>Post ID is required to fetch details, please try again later</p>;
  }

  if (isLoadingClient || isLoadingVendor) {
    return <LoadingBar />;
  }

  // Fix 6: Add guard clause for missing post data
  if (!post) {
    return <p>Post not found or failed to load. Please try again later.</p>;
  }

  return (
    <CommunityLayout>
      <div className="space-y-6">
        {/* Post Content */}
        <div className="rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Avatar className="h-12 w-12 mr-2 ">
                <AvatarImage
                  src={post?.userId.profileImage}
                  alt={`${post?.userId.name}`}
                  className="object-cover w-full h-full rounded-full"
                />
                <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  {post?.userId.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">
                  {post?.userId?.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {post?.createdAt &&
                    formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-200">
              {post?.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-400 mb-4">
              {post?.content}
            </p>

            {Array.isArray(post?.media) && post.media.length > 0 && (
              <div className="mb-4 rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.media.map((mediaUrl: string, idx: number) =>
                  post.mediaType === "image" ? (
                    <img
                      key={idx}
                      src={mediaUrl}
                      alt={`Post media ${idx + 1}`}
                      className="w-full h-auto max-h-96 object-cover rounded"
                    />
                  ) : (
                    <video key={idx} controls className="w-full rounded">
                      <source src={mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                )}
              </div>
            )}

            <div className="flex justify-between items-center border-t pt-3">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlelikeToggle}
                  disabled={isLiking}
                  className={`flex items-center transition-colors ${
                    isPostLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-500 hover:text-red-500"
                  } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLiking ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Heart
                      className={`w-4 h-4 mr-1 transition-all ${
                        isPostLiked ? "fill-current" : ""
                      }`}
                    />
                  )}
                  <span>{post?.likeCount || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-500"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>{post?.totalComments || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-500"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="rounded-lg shadow-sm border p-4">
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <Textarea
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <Button
              type="submit"
              disabled={isPending || !commentContent.trim()}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {isPending ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Comments ({totalComments})</h3>
          {post?.comments?.map((comment) => (
            <div key={comment._id} className="rounded-lg shadow-sm border p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.avatar}
                    alt={comment.userName}
                    className="object-cover w-full h-full rounded-full"
                  />
                  <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
                    {comment.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-900 dark:text-gray-100">
                      {comment.userName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt &&
                        formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                    </span>
                  </div>
                  <p className="mt-1 dark:text-gray-200">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        currentPage={page}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </CommunityLayout>
  );
};

export default PostDetailPage;