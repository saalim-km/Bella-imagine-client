"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  title: string
  isActive?: boolean
  onClick?: () => void
}

export default function CategoryCard({ title, onClick }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "min-w-[180px] h-[100px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative group border",
      )}
    >
      <span
        className={cn(
          "text-lg font-medium transition-colors",
        )}
      >
        {title}
      </span>
    </motion.div>
  )
}
