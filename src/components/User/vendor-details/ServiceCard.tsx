"use client"

import { Clock, ArrowRight, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { IServiceResponse, IWorkSampleResponse } from "@/types/interfaces/vendor"
import { ImageWithFallback } from "../ImageFallBack"

interface ServiceCardProps {
  service: IServiceResponse
  onViewDetails: (service: any) => void
  workSample: IWorkSampleResponse
}

export default function ServiceCard({ service, onViewDetails, workSample }: ServiceCardProps) {
  const minPrice =
    service.sessionDurations.length > 0 ? Math.min(...service.sessionDurations.map((s: any) => s.price)) : 0

  const minHours =
    service.sessionDurations.length > 0 ? Math.min(...service.sessionDurations.map((s: any) => s.durationInHours)) : 0

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-background border border-border hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-200 hover:shadow-md"
      onClick={() => onViewDetails(service)}
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={workSample?.media[3]}
          alt={service.serviceTitle}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          fallbackType="work"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Service Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white mb-2">{service.serviceTitle}</h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm">
              <Star className="w-3 h-3 mr-1" />
              {service.yearsOfExperience} Years
            </Badge>
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm">
              <Users className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{service.serviceDescription}</p>

        {/* Pricing and Duration */}
        <div className="flex justify-between items-center py-3 border-y border-border">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Starting at</div>
            <div className="text-xl font-semibold text-foreground">
              ₹{minPrice > 0 ? minPrice.toLocaleString() : "N/A"}
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Duration</span>
            </div>
            <div className="text-sm font-medium text-foreground">
              {minHours > 0 ? `${minHours}h minimum` : "Custom"}
            </div>
          </div>
        </div>

        {/* Style Specialties */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Specialties</div>
          <div className="flex flex-wrap gap-1.5">
            {service.styleSpecialty.slice(0, 3).map((style: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
              >
                {style}
              </Badge>
            ))}
            {service.styleSpecialty.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{service.styleSpecialty.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/50 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/50 bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(service)
            }}
          >
            <span>View Details & Packages</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
