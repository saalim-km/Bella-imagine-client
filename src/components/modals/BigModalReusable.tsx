import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { ReactNode } from "react"

interface BigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string | React.ReactNode
  description?: string
  children: ReactNode
  className?: string
}

export function BigModal({ open, onOpenChange, title, description, children, className }: BigModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl ${className ?? ""}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}