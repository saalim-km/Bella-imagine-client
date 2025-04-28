// components/common/ReusableDropdown.tsx
"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { ReactNode } from "react"

interface DropdownAction {
  label?: string
  type?: "item" | "separator" | "label"
  onClick?: () => void
  icon?: ReactNode
  href?: string
  danger?: boolean
}

interface ReusableDropdownProps {
  actions: DropdownAction[]
}

export function ReusableDropdown({ actions }: ReusableDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          if (action.type === "separator") {
            return <DropdownMenuSeparator key={index} />
          }
          if (action.type === "label") {
            return <DropdownMenuLabel key={index}>{action.label}</DropdownMenuLabel>
          }
          if (action.href) {
            return (
              <DropdownMenuItem asChild key={index}>
                <a
                  href={action.href}
                  className={`flex items-center ${action.danger ? "text-destructive focus:text-destructive" : ""}`}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </a>
              </DropdownMenuItem>
            )
          }
          return (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={action.danger ? "text-destructive focus:text-destructive" : ""}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
