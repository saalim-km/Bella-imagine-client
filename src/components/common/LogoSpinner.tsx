"use client"

import { useThemeConstants } from "@/utils/theme/themeUtills"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  isLoading?: boolean
  size?: "sm" | "md" | "lg"
  color?: string
}

export default function LoadingSpinner({ isLoading = true, size = "md", color = "primary" }: LoadingSpinnerProps) {
  const { isDarkMode } = useThemeConstants()
  
  if (!isLoading) return null

  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  // Dynamic color based on theme and prop
  const baseColor = color === "primary" 
    ? (isDarkMode ? "text-blue-400" : "text-blue-600")
    : `text-${color}`

  // Background color based on theme
  const bgColor = isDarkMode 
    ? "bg-gray-900/80" 
    : "bg-gray-100/80"

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${bgColor} backdrop-blur-sm z-50`}>
      <div className={`relative ${sizeMap[size]}`}>
        {/* Outer rotating circle */}
        <motion.div
          className={`absolute inset-0 rounded-full border-4 border-t-transparent ${baseColor} opacity-80`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Middle pulsing circle */}
        <motion.div
          className={`absolute inset-2 rounded-full border-4 border-r-transparent ${baseColor} opacity-60`}
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        />

        {/* Center logo with fade animation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%28Nav%29-JXDDhzGbY1vRdo3FaJjbit6kw1th88.png"
            alt="Loading Logo"
            className={`w-10 h-10 ${isDarkMode ? 'brightness-125' : 'brightness-100'}`}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Inner circle with dots */}
        <div className="absolute inset-4 rounded-full flex items-center justify-center">
          <motion.div
            className={`absolute w-2 h-2 rounded-full ${baseColor}`}
            animate={{
              x: [0, 10, 0, -10, 0],
              y: [0, -10, 0, 10, 0],
              opacity: [1, 0.8, 1, 0.8, 1],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute w-2 h-2 rounded-full ${baseColor}`}
            animate={{
              x: [0, -10, 0, 10, 0],
              y: [0, 10, 0, -10, 0],
              opacity: [1, 0.6, 1, 0.6, 1],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className={`absolute w-2 h-2 rounded-full ${baseColor}`}
            animate={{
              x: [0, 10, 0, -10, 0],
              y: [0, 10, 0, -10, 0],
              opacity: [1, 0.7, 1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          />
        </div>
      </div>
    </div>
  )
}