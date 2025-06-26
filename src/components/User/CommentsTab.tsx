"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Heart } from "lucide-react"
import { toast } from "sonner"
import Pagination from "../common/Pagination"

export interface IComment {
  _id?: string
  postId: string
  userId: {
    _id: string
    name: string
    profileImage?: string
    email: string
  }
  content: string
  likesCount: number
  createdAt?: Date
  updatedAt?: Date
}

// Mock data for comments
const mockComments: IComment[] = [
  {
    _id: "1" as any,
    postId: "post1" as any,
    userId: {
      _id: "user1" as any,
      name: "John Doe",
      profileImage: "/placeholder.svg?height=40&width=40",
      email: "john@example.com",
    },
    content: "Great shot! The lighting is absolutely perfect. What camera settings did you use for this?",
    likesCount: 5,
    createdAt: new Date("2024-01-15T11:30:00Z"),
    updatedAt: new Date("2024-01-15T11:30:00Z"),
  },
  {
    _id: "2" as any,
    postId: "post2" as any,
    userId: {
      _id: "user1" as any,
      name: "John Doe",
      profileImage: "/placeholder.svg?height=40&width=40",
      email: "john@example.com",
    },
    content:
      "Thanks for sharing this review! I've been considering the same camera upgrade. How's the battery life compared to your previous setup?",
    likesCount: 3,
    createdAt: new Date("2024-01-12T16:20:00Z"),
    updatedAt: new Date("2024-01-12T16:20:00Z"),
  },
  {
    _id: "3" as any,
    postId: "post3" as any,
    userId: {
      _id: "user1" as any,
      name: "John Doe",
      profileImage: "/placeholder.svg?height=40&width=40",
      email: "john@example.com",
    },
    content:
      "Excellent tips! The advice about focusing on the eyes really made a difference in my recent portrait session. Do you have any recommendations for outdoor portrait lighting?",
    likesCount: 8,
    createdAt: new Date("2024-01-10T14:45:00Z"),
    updatedAt: new Date("2024-01-10T14:45:00Z"),
  },
  {
    _id: "4" as any,
    postId: "post1" as any,
    userId: {
      _id: "user1" as any,
      name: "John Doe",
      profileImage: "/placeholder.svg?height=40&width=40",
      email: "john@example.com",
    },
    content: "Beautiful composition! The way you captured the reflection in the water adds so much depth to the image.",
    likesCount: 2,
    createdAt: new Date("2024-01-09T09:15:00Z"),
    updatedAt: new Date("2024-01-09T09:15:00Z"),
  },
]

interface CommentsTabProps {
  userRole: "client" | "vendor"
}

export function CommentsTab({ userRole }: CommentsTabProps) {
  const [comments, setComments] = useState<IComment[]>(mockComments)

  const handleEditComment = (commentId: string) => {
    console.log("Editing comment:", commentId)
    
  }

  const handleDeleteComment = (commentId: string) => {
    console.log("Deleting comment:", commentId)
    setComments(comments.filter((comment) => comment._id?.toString() !== commentId))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{comments.length} comments</span>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12 ">
          <Edit className="h-12 w-12 mx-auto mb-4 " />
          <p>No comments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id?.toString()} className="border rounded shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm  mb-3">{truncateContent(comment.content)}</p>

                  {/* Comment metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Heart className="h-3 w-3" />
                      <span>{comment.likesCount}</span>
                    </div>
                    <span>{formatDate(comment.createdAt || new Date())}</span>
                    <span className="text-orange-600">on post</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditComment(comment._id?.toString() || "")}
                    className="border-orange-700 text-orange-700 hover:bg-orange-50 h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteComment(comment._id?.toString() || "")}
                    className="border-red-600 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination 
        currentPage={1}
        onPageChange={()=> console.log('hi')}
        totalPages={1}
      />
    </div>
  )
}
