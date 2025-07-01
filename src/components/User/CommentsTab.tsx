"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MessageSquare, ExternalLink, Calendar, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Pagination from "../common/Pagination"
import type { IComment } from "@/types/interfaces/Community"
import { useGetCommentsForClient, useGetCommentsForVendor } from "@/hooks/community-contest/useCommunity"
import { EditCommentModal } from "../modals/EditComment"
import { ReusableAlertDialog } from "@/components/common/AlertDialogue"
import { Link } from "react-router-dom"


interface CommentsTabProps {
  userRole: "client" | "vendor"
}

export function CommentsTab({ userRole }: CommentsTabProps) {
  const [queryData, setQueryData] = useState<{ page: number; limit: number }>({
    limit: 6,
    page: 1,
  })

  const [editingComment, setEditingComment] = useState<IComment | null>(null)
  const [deletingComment, setDeletingComment] = useState<IComment | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditLoading, setIsEditLoading] = useState(false)

  const {
    data: clientData,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useGetCommentsForClient({ ...queryData, enabled: userRole === "client" })

  const {
    data: vendorData,
    isLoading: isVendorLoading,
    isError: isVendorError,
  } = useGetCommentsForVendor({ ...queryData, enabled: userRole === "vendor" })

  // Use real data if available, otherwise fall back to mock data
  const commentsData = clientData?.data.data ? clientData.data : vendorData?.data
  const comments = commentsData?.data || []
  const totalComments = commentsData?.total || 0
  const totalPages = Math.ceil(totalComments / queryData.limit)

  const isLoading = isClientLoading || isVendorLoading
  const isError = isClientError || isVendorError

  const handleEditComment = (comment: IComment) => {
    setEditingComment(comment)
    setIsEditModalOpen(true)
  }

  const handleDeleteComment = (comment: IComment) => {
    setDeletingComment(comment)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveEdit = async (commentId: string, newContent: string) => {
    setIsEditLoading(true)
    try {
      // TODO: Implement actual API call to update comment
      console.log("Updating comment:", commentId, "with content:", newContent)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state or refetch data
      // You would typically call your update comment API here
    } catch (error) {
      console.error("Failed to update comment:", error)
      throw error
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingComment) return

    try {
      // TODO: Implement actual API call to delete comment
      console.log("Deleting comment:", deletingComment._id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state or refetch data
      // You would typically call your delete comment API here
    } catch (error) {
      console.error("Failed to delete comment:", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setDeletingComment(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    setQueryData((prev) => ({ ...prev, page: newPage }))
  }

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const getPostReference = (comment: IComment) => {
    return comment.post && comment.post.length > 0 ? comment.post[0] : null
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 bg-background animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="p-8 text-center bg-background border-destructive/20">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-destructive">Error loading comments</h3>
          <p className="text-muted-foreground">Something went wrong. Please try again later.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <span className="text-lg font-semibold">Your Comments</span>
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
          >
            {totalComments}
          </Badge>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <Card className="p-12 text-center bg-background">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No comments yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven't made any comments yet. Start engaging with the community by commenting on posts!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const postRef = getPostReference(comment)
            return (
              <Card key={comment._id?.toString()} className="overflow-hidden bg-background border-border">
                <div className="p-4 space-y-4">
                  {/* Comment Content */}
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed text-foreground">{truncateContent(comment.content)}</p>

                    {/* Comment Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(comment.createdAt || new Date()), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{comment.userType}</span>
                      </div>
                      {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                        <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                          Edited
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Post Reference */}
                  {postRef && (
                    <div className="border-l-4 border-orange-500 pl-4 bg-muted/30 rounded-r-lg p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-medium text-foreground line-clamp-1">{postRef.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{postRef.content}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground">
                            <Link to={`/post/${comment.postId}`}>
                            <ExternalLink className="w-3 h-3" />

                            </Link>
                          </Button>
                        </div>

                        {/* Post Tags */}
                        {postRef.tags && postRef.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {postRef.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-2 py-0 h-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {postRef.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs px-2 py-0 h-4">
                                +{postRef.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Post Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{postRef.likeCount} likes</span>
                          <span>{postRef.commentCount} comments</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditComment(comment)}
                      className="h-8 px-3 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteComment(comment)}
                      className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination currentPage={queryData.page} onPageChange={handlePageChange} totalPages={totalPages} />
        </div>
      )}

      {/* Edit Comment Modal */}
      <EditCommentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        comment={editingComment}
        onSave={handleSaveEdit}
        isLoading={isEditLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ReusableAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false)
          setDeletingComment(null)
        }}
      />
    </div>
  )
}
