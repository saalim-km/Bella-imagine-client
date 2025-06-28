import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import CommunityLayout from "@/components/layout/CommunityLayout";
import {
  useAddComment,
  useGetPostDetails,
} from "@/hooks/community-contest/useCommunity";
import { LoadingBar } from "@/components/ui/LoadBar";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea component
import { communityToast } from "@/components/ui/community-toast";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useQueryClient } from "@tanstack/react-query";
import { PostDetailsInput } from "@/services/community-contest/communityService";
import Pagination from "@/components/common/Pagination";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const [page, setPage] = useState(1);
  const commentLimit = 2;

  const queryData: PostDetailsInput = {
    postId: postId!,
    limit: commentLimit,
    page: page,
  };
  // State for comment input
  const { data, isLoading } = useGetPostDetails(queryData);
  const totalComments = data?.data.totalComments || 0;
  const totalPages = Math.max(1, Math.ceil(totalComments / commentLimit));


  console.log('total comments : ',totalComments);
  const { mutate: addComment, isPending } = useAddComment(); // Hook for comment submission
  const post = data?.data;
  const queryclient = useQueryClient();

  if (!postId) {
    return <p>postid is required to fetch details, please try again later</p>;
  }

  if (isLoading) {
    return <LoadingBar />;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return; // Prevent empty comments
    try {
      addComment(
        { content: commentContent, postId: postId },
        {
          onSuccess: (data) => {
            queryclient.invalidateQueries({ queryKey: ["post", postId] });
            communityToast.success({ title: 'Comment added' , description : data.message });
          },
          onError: (err) => {
            handleError(err);
          },
        }
      );
      setCommentContent(""); // Clear input after submission
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

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
                  className={`flex items-center ${
                    post?.isLiked ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 ${
                      post?.isLiked ? "fill-current" : ""
                    }`}
                  />
                  <span>{post?.likeCount || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-500"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>{post?.commentCount || 0}</span>
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
          <h3 className="font-semibold text-lg">
            Comments ({totalComments})
          </h3>
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
