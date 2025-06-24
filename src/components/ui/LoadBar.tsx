import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loadingBarVariants = cva("fixed top-0 left-0 right-0 z-50 overflow-hidden", {
  variants: {
    size: {
      default: "h-0.5",
      sm: "h-0.5",
      lg: "h-1",
      xl: "h-1.5",
    },
    variant: {
      default: "bg-orange-500",
      light: "bg-orange-300",
      dark: "bg-orange-700",
      accent: "bg-orange-400",
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "default",
  },
})

export interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingBarVariants> {
  asChild?: boolean
  loading?: boolean
  speed?: "slow" | "medium" | "fast"
}

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ className, size, variant, loading = true, speed = "medium", ...props }, ref) => {
    const speedClasses = {
      slow: "animate-pulse duration-2000",
      medium: "animate-pulse duration-1000",
      fast: "animate-pulse duration-500",
    }

    if (!loading) return null

    return (
      <div className={cn(loadingBarVariants({ size, variant }), className)} ref={ref} {...props}>
        <div className="h-full w-full relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-transparent via-white to-transparent absolute inset-0 opacity-60"
            style={{
              animation: `shimmer 1.5s ease-in-out infinite`,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
              transform: "translateX(-100%)",
            }}
          />
          <div className="h-full w-full bg-current opacity-90" />
        </div>
      </div>
    )
  },
)
LoadingBar.displayName = "LoadingBar"

export { LoadingBar, loadingBarVariants }
