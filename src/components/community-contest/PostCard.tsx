"use client";

import type React from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ICommunityPostResponse } from "../User/Home";


interface PostCardProps {
  post: ICommunityPostResponse;
  onLikeToggle: (post: ICommunityPostResponse) => void;
  isLiking?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikeToggle,
  isLiking = false,
}) => {
  if (!post) {
    return (
      <Card className="w-full h-32 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  const handleLikeClick = () => {
    if (isLiking) return;
    onLikeToggle(post);
  };

  return (
    <Card className="w-full mb-4 overflow-hidden bg-white dark:bg-background border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <div className="flex">
        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 min-w-[48px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikeClick}
            disabled={isLiking}
            className={`p-1 h-8 w-8 font-semibold text-xs transition-colors ${
              post.isLiked
                ? "text-orange-500 hover:text-orange-600"
                : "text-gray-600 dark:text-gray-400 hover:text-orange-500"
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLiking ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Heart
                className={`w-3 h-3 ${post.isLiked ? "fill-current" : ""}`}
              />
            )}
          </Button>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
            {post.likeCount}
          </span>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-3">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={
                  post.userId.profileImage ||
                  "/placeholder.svg?height=24&width=24"
                }
                alt={post.userId.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                {post.userId.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {post.userId.name}
              </span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(post.createdAt ?? 0), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Tags - seamlessly integrated in header */}
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

          {/* Title */}
          <Link to={`/post/${post._id}`}>
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 leading-tight hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
              {post.title}
            </h2>
          </Link>
          {/* Content */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {post.content}
          </p>

          {/* Media section - full width */}
          {post.media && post.media.length > 0 && (
            <Link to={`/post/${post._id}`}>
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
                    {post.media.map((url: string, idx: number) => (
                      <div
                        key={idx}
                        className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                          post.media?.length === 1
                            ? "aspect-video"
                            : "aspect-square"
                        }`}
                      >
                        <img
                          src={url || "/placeholder.svg?height=400&width=400"}
                          alt={`Post media ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {post.media.map((url: string, idx: number) => (
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
            </Link>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1">
              <Link to={`/post/${post._id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2 py-1 h-8 text-xs font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentCount} Comments</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 px-2 py-1 h-8 text-xs font-medium"
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
  );
};

export default PostCard;
