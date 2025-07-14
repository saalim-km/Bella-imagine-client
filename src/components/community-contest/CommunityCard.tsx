"use client"

import { Link } from "react-router-dom"
import { Users, TrendingUp, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CommunityResponse } from "@/types/interfaces/Community"

interface CommunityCardProps {
  community: CommunityResponse
  className?: string
}

export function CommunityCard({ community, className }: CommunityCardProps) {
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden bg-white dark:bg-background border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md",
        className,
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
        <img
          src={community.coverImage || "/placeholder.svg?height=200&width=400"}
          alt={community.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />

        {/* Overlay with community stats */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Member count overlay */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black/70 text-white border-0 backdrop-blur-sm">
            <Users className="w-3 h-3 mr-1" />
            {formatMemberCount(community?.memberCount || 0)}
          </Badge>
        </div>

        {/* Trending indicator */}
        {community?.memberCount && community.memberCount > 1000 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-orange-500 text-white border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/community/${community.slug}`}
              className="group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
            >
              <h3 className="font-semibold text-lg leading-tight line-clamp-1 text-gray-900 dark:text-gray-100">
                {community.name}
              </h3>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
              asChild
            >
              <Link to={`/community/${community.slug}`}>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          </div>

          {/* Community slug/handle */}
          <p className="text-sm text-gray-500 dark:text-gray-400">{community.slug}</p>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">{community.description}</p>
      </CardContent>

      <CardFooter className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{formatMemberCount(community?.memberCount || 0)} members</span>
          </div>

          {/* Activity indicator */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Active</span>
          </div>
        </div>

        {/* Join/Visit Button */}
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-3 border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/50 bg-transparent"
          asChild
        >
          <Link to={`/community/${community.slug}`}>Visit</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
