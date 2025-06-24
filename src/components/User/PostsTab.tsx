"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MessageSquare, Heart } from "lucide-react"
import { toast } from "sonner"

export interface ICommunityPost {
  _id?: string
  communityId: string
  userId: string
  title: string
  content: string
  media: string[]
  mediaType?: "image" | "video" | "mixed" | "none"
  isEdited?: boolean
  likeCount: number
  commentCount: number
  tags: string[]
  comments: string[]
  createdAt?: string
  updatedAt?: string
}

// Mock data for posts
const mockPosts: ICommunityPost[] = [
  {
    _id: "1" as any,
    communityId: "comm1" as any,
    userId: "user1" as any,
    title: "Amazing sunset photography session",
    content:
      "Just finished an incredible sunset shoot at the beach. The golden hour lighting was absolutely perfect, and the client was thrilled with the results. Here are some behind-the-scenes shots from today's session.",
    media: ["/placeholder.svg?height=200&width=300"],
    mediaType: "image",
    isEdited: false,
    likeCount: 24,
    commentCount: 8,
    tags: ["photography", "sunset", "beach"],
    comments: [],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2" as any,
    communityId: "comm1" as any,
    userId: "user1" as any,
    title: "New camera gear review",
    content:
      "Recently upgraded to the latest mirrorless camera and I'm blown away by the image quality. The low-light performance is exceptional, and the autofocus is lightning fast. Perfect for wedding photography!",
    media: [],
    mediaType: "none",
    isEdited: true,
    likeCount: 15,
    commentCount: 12,
    tags: ["gear", "review", "camera"],
    comments: [],
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T15:45:00Z",
  },
  {
    _id: "3" as any,
    communityId: "comm1" as any,
    userId: "user1" as any,
    title: "Tips for portrait photography",
    content:
      "Here are my top 5 tips for capturing stunning portraits: 1) Focus on the eyes, 2) Use natural light when possible, 3) Communicate with your subject, 4) Pay attention to background, 5) Shoot in RAW format for better editing flexibility.",
    media: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    mediaType: "image",
    isEdited: false,
    likeCount: 42,
    commentCount: 18,
    tags: ["tips", "portrait", "photography"],
    comments: [],
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
]

interface PostsTabProps {
  userRole: "client" | "vendor"
}

export function PostsTab({ userRole }: PostsTabProps) {
  const [posts, setPosts] = useState<ICommunityPost[]>(mockPosts)

  const handleEditPost = (postId: string) => {
    console.log("Editing post:", postId)
    toast.success("Edit post functionality triggered")
  }

  const handleDeletePost = (postId: string) => {
    console.log("Deleting post:", postId)
    setPosts(posts.filter((post) => post._id?.toString() !== postId))
    toast.success("Post deleted successfully")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 " />
          <p>No posts yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id?.toString()} className="border rounded shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold dark:text-gray-200 mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{post.content}</p>

                  {/* Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {post.media.slice(0, 2).map((mediaUrl, index) => (
                        <img
                          key={index}
                          src={mediaUrl || "/placeholder.svg"}
                          alt={`Post media ${index + 1}`}
                          className="w-full h-32 object-cover rounded border "
                        />
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Heart className="h-4 w-4" />
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.commentCount}</span>
                    </div>
                    <span>{formatDate(post.createdAt || "")}</span>
                    {post.isEdited && <span className="text-orange-600">(edited)</span>}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPost(post._id?.toString() || "")}
                    className="border-orange-700 text-orange-700 hover:bg-orange-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePost(post._id?.toString() || "")}
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
