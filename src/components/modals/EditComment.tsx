"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { IComment } from "@/types/interfaces/Community"

interface EditCommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: IComment | null
  onSave: (commentId: string, newContent: string) => Promise<void>
  isLoading?: boolean
}

export function EditCommentModal({ open, onOpenChange, comment, onSave, isLoading = false }: EditCommentModalProps) {
  const [content, setContent] = useState("")

  useEffect(() => {
    if (comment) {
      setContent(comment.content)
    }
  }, [comment])

  const handleSave = async () => {
    if (!comment || !content.trim()) return

    try {
      await onSave(comment._id?.toString() || "", content.trim())
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save comment:", error)
    }
  }

  const handleCancel = () => {
    if (comment) {
      setContent(comment.content) // Reset to original content
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="comment-content" className="text-sm font-medium">
              Comment
            </label>
            <Textarea
              id="comment-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment..."
              className="min-h-[100px] resize-none bg-background border-border"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{content.length} characters</span>
              <span>{content.length > 500 ? "Too long" : ""}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !content.trim() || content.length > 500}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
