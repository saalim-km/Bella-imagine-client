import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const loadingBarVariants = cva("fixed top-0 left-0 right-0 z-50 overflow-hidden", {
  variants: {
    size: {
      default: "h-1",
      sm: "h-0.5",
      lg: "h-1.5",
      xl: "h-2",
    },
    variant: {
      default: "bg-blue-500",
      orange: "bg-orange-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "orange",
  },
})

export interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loadingBarVariants> {
  asChild?: boolean
  loading?: boolean
  progress?: number // 0-100 for controlled progress
  speed?: "slow" | "medium" | "fast"
  type?: "indeterminate" | "determinate"
}

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ 
    className, 
    size, 
    variant, 
    loading = true, 
    progress = 0,
    speed = "medium", 
    type = "indeterminate",
    ...props 
  }, ref) => {
    const [internalProgress, setInternalProgress] = React.useState(0)
    const [isVisible, setIsVisible] = React.useState(loading)

    const speedDurations = {
      slow: 2000,
      medium: 1200,
      fast: 800,
    }

    // Handle visibility with fade effect
    React.useEffect(() => {
      if (loading) {
        setIsVisible(true)
        if (type === "indeterminate") {
          setInternalProgress(0)
          // Simulate realistic loading progress
          const duration = speedDurations[speed]
          const steps = 60
          const increment = 100 / steps
          let currentProgress = 0
          
          const interval = setInterval(() => {
            currentProgress += increment * (Math.random() * 0.5 + 0.5) // Vary speed
            if (currentProgress >= 90) {
              currentProgress = 90 // Stop at 90% for indeterminate
            }
            setInternalProgress(currentProgress)
          }, duration / steps)

          return () => clearInterval(interval)
        }
      } else {
        // Complete the progress bar before hiding
        setInternalProgress(100)
        const timer = setTimeout(() => {
          setIsVisible(false)
          setInternalProgress(0)
        }, 300)
        return () => clearTimeout(timer)
      }
    }, [loading, speed, type])

    const currentProgress = type === "determinate" ? progress : internalProgress

    if (!isVisible) return null

    return (
      <>
        <style>{`
          @keyframes loading-shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .loading-shimmer {
            animation: loading-shimmer 1s ease-in-out infinite;
          }
        `}</style>
        
        <div 
          className={cn(loadingBarVariants({ size, variant }), "transition-opacity duration-300", className)} 
          ref={ref} 
          {...props}
        >
          {/* Background track */}
          <div className="h-full w-full bg-gray-200 dark:bg-gray-800 opacity-30" />
          
          {/* Progress bar */}
          <div 
            className="h-full bg-current absolute top-0 left-0 transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(currentProgress, 100)}%`,
              opacity: loading ? 1 : 0,
            }}
          />
          
          {/* Shimmer effect for indeterminate loading */}
          {type === "indeterminate" && loading && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="loading-shimmer h-full w-20 bg-gradient-to-r from-transparent via-white to-transparent absolute opacity-30"
                style={{
                  backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`,
                }}
              />
            </div>
          )}
        </div>
      </>
    )
  },
)
LoadingBar.displayName = "LoadingBar"

export { LoadingBar, loadingBarVariants }