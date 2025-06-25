"use client"

import type React from "react"
import { Heart, MessageSquare, Share2, MoreHorizontal, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import type { ICommunityPostResponse } from "../User/Home"
import { LoadingBar } from "../ui/LoadBar"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface PostCardProps {
  post: ICommunityPostResponse
  onLikeToggle: (post: ICommunityPostResponse) => void
  isLiking?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ post, onLikeToggle, isLiking = false }) => {
  if (!post) {
    return <LoadingBar />
  }

  const handleLikeClick = () => {
    if (isLiking) return // Prevent multiple clicks while processing
    onLikeToggle(post)
  }

  return (
    <div className="rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage
              src={post.userId.profileImage || "/placeholder.svg"}
              alt={`${post.userId.name}`}
              className="object-cover w-full h-full rounded-full"
            />
            <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
              {post.userId.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.userId.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt ?? 0), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-200">{post.title}</h2>
        <p className="text-gray-700 dark:text-gray-400 mb-4">{post.content}</p>

        {post.media && post.media.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            {post.mediaType === "image" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {post.media.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url || "/placeholder.svg"}
                    alt={`Post media ${idx + 1}`}
                    className="w-full h-auto max-h-96 object-cover rounded"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {post.media.map((url: string, idx: number) => (
                  <video key={idx} controls className="w-full rounded">
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeClick}
              disabled={isLiking}
              className={`flex items-center transition-colors ${
                post.isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
              } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLiking ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 mr-1 transition-all ${post.isLiked ? "fill-current" : ""}`} />
              )}
              <span>{post.likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center text-gray-500 hover:text-blue-500">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{post.commentCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center text-gray-500 hover:text-green-500">
              <Share2 className="w-4 h-4 mr-1" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
