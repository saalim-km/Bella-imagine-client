"use client"

import type { CommunityResponse } from "@/types/interfaces/Community"
import { CommunityCard } from "./CommunityCard"

interface CommunityGridProps {
  communities: CommunityResponse[]
}

export function CommunityGrid({ communities }: CommunityGridProps) {
  return (
    <div className="space-y-4">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {communities.map((community) => (
          <CommunityCard key={community._id} community={community} />
        ))}
      </div>

      {/* Load More Section - if needed */}
      {communities.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing {communities.length} communities</p>
        </div>
      )}
    </div>
  )
}
