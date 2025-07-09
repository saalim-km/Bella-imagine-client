"use client"

import type React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  console.log(`in pagination component , totalPage : ${totalPages} , currentPage : ${currentPage}`)

  const pageNumbers = []
  console.log(totalPages, "total pages")

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const renderPageNumbers = () => {
    const items = []

    // Always show first page
    if (totalPages > 0) {
      items.push(
        <Button
          key={1}
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          className={`min-w-[40px] h-10 px-3 mx-0.5 rounded-lg font-medium transition-all duration-200 ${
            currentPage === 1
              ? "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          1
        </Button>,
      )
    }

    // Show ellipsis if there's a gap after first page
    if (currentPage > 3) {
      items.push(
        <div key="ellipsis-start" className="flex items-center justify-center min-w-[40px] h-10 px-2">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>,
      )
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Button
          key={i}
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(i)}
          className={`min-w-[40px] h-10 px-3 mx-0.5 rounded-lg font-medium transition-all duration-200 ${
            currentPage === i
              ? "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {i}
        </Button>,
      )
    }

    // Show ellipsis if there's a gap before last page
    if (currentPage < totalPages - 2) {
      items.push(
        <div key="ellipsis-end" className="flex items-center justify-center min-w-[40px] h-10 px-2">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>,
      )
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      items.push(
        <Button
          key={totalPages}
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className={`min-w-[40px] h-10 px-3 mx-0.5 rounded-lg font-medium transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          {totalPages}
        </Button>,
      )
    }

    return items
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-1 py-6">
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="min-w-[40px] h-10 px-3 mx-0.5 rounded-lg font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center">{renderPageNumbers()}</div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="min-w-[40px] h-10 px-3 mx-0.5 rounded-lg font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default Pagination
