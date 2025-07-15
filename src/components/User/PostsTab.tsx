"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  MessageSquare,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { communityToast } from "../ui/community-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  deletePostServiceClient,
  deletePostServiceVendor,
  getAllPostForUserServiceClient,
  getAllPostForUserServiceVendor,
} from "@/services/community/communityService";
import {
  useDeletePost,
  useGetAllPostUser,
} from "@/hooks/community/useCommunity";
import Pagination from "../common/Pagination";
import { Spinner } from "../ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ReusableAlertDialog } from "../common/AlertDialogue";
import { Card } from "../ui/card";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useQueryClient } from "@tanstack/react-query";

export interface ICommunityPost {
  _id: string;
  communityId: string;
  userId: string;
  userType: string;
  title: string;
  content: string;
  media: string[];
  mediaType: "image" | "video" | "mixed" | "none";
  isEdited: boolean;
  likeCount: number;
  commentCount: number;
  tags: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
  communityName: string;
  iconImage: string;
  coverImage: string;
  userDetails?: {
    name: string;
    profileImage?: string;
  };
}

 function PostsTab() {
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryCLient = useQueryClient()
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client;
    if (state.vendor.vendor) return state.vendor.vendor;
    return undefined;
  });

  const [query, setQuery] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: 4,
  });

  const queryFn =
    user?.role === "client"
      ? getAllPostForUserServiceClient
      : getAllPostForUserServiceVendor;
  const { data: postsData, isLoading , refetch} = useGetAllPostUser(query, queryFn);

  const mutateFn =
    user?.role == "client" ? deletePostServiceClient : deletePostServiceVendor;
  const { mutate: deletePost } = useDeletePost(mutateFn);


  const handleEditPost = (postId: string) => {
    console.log("Editing post:", postId);
    navigate(`/post/edit/${postId}`);
  };

  const handleDeletePost = (postId: string) => {
    setDeletingPost(postId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPost) return;

    deletePost(deletingPost, {
      onSuccess: () => {
        refetch()
        queryCLient.invalidateQueries({queryKey : ['comments']})
        communityToast.success({ description: "Post deleted successfully" });
      },
      onError : (err)=> {
        handleError(err)
      }
    });
    setIsDeleteDialogOpen(false);
    setDeletingPost(null);
  };

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  if (!user) {
    return (
      <p className="text-center py-8 text-gray-500">
        User not found. Please try again later or relogin to continue.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Spinner />
      </div>
    );
  }

  const posts = postsData?.data.data || [];
  const totalPosts = postsData?.data.total || 0;
  const totalPages = Math.ceil(totalPosts / query.limit);

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4" />
          <p>No posts yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post._id}
                className="w-full overflow-hidden bg-white dark:bg-background border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                {/* Community Reference */}
                <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800 gap-2">
                  <img
                    src={post.iconImage}
                    alt={post.communityName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Posted in
                    </p>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {post.communityName}
                    </h3>
                  </div>
                </div>

                <div className="flex">
                  {/* Like section */}
                  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 min-w-[48px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8 font-semibold text-xs text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                      {post.likeCount}
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-3">
                    {/* Header with user info */}
                    <div className="flex items-center gap-2 mb-2">
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-1 ml-auto">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-2 py-0 h-5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 cursor-pointer transition-colors"
                            >
                              #{tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0 h-5 text-gray-500 dark:text-gray-400"
                            >
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Title and content */}
                    <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Media */}
                    {post.media.length > 0 && (
                      <div className="mb-3 -mx-3">
                        {post.mediaType === "image" ? (
                          <div
                            className={`${
                              post.media.length === 1
                                ? "grid grid-cols-1"
                                : post.media.length === 2
                                ? "grid grid-cols-2"
                                : "grid grid-cols-2 md:grid-cols-3"
                            } gap-1`}
                          >
                            {post.media.map((url, idx) => (
                              <div
                                key={idx}
                                className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                                  post.media.length === 1
                                    ? "aspect-video"
                                    : "aspect-square"
                                }`}
                              >
                                <img
                                  src={url}
                                  alt={`Post media ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {post.media.map((url, idx) => (
                              <div
                                key={idx}
                                className="relative bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
                              >
                                <video
                                  controls
                                  className="w-full max-h-96 object-contain"
                                  preload="metadata"
                                >
                                  <source src={url} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer with actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2 py-1 h-8 text-xs font-medium"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.commentCount} Comments</span>
                        </Button>
                      </div>

                      {/* Management buttons */}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPost(post._id)}
                          className="text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 p-1 h-8 w-8"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post._id)}
                          className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={query.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <ReusableAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Post"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDeletingPost(null);
        }}
      />
    </div>
  );
}

export default PostsTab;