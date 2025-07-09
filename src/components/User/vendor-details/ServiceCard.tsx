"use client"
import { useState } from "react"
import { ChevronDown, Clock, Star, Camera, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { IServiceResponse } from "@/types/interfaces/vendor"

interface ServicesAccordionProps {
  services: IServiceResponse[]
  onViewDetails: (service: IServiceResponse) => void
}

export function ServicesAccordion({ services, onViewDetails }: ServicesAccordionProps) {
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId)
  }

  if (!services || services.length === 0) {
    return (
      <Card className="p-12 text-center bg-background">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No Services Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This photographer hasn't added any services yet. Contact them directly for custom packages.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {services.map((service) => {
        const isExpanded = expandedService === service._id
        const minPrice =
          service.sessionDurations.length > 0 ? Math.min(...service.sessionDurations.map((s: any) => s.price)) : 0
        const minHours =
          service.sessionDurations.length > 0
            ? Math.min(...service.sessionDurations.map((s: any) => s.durationInHours))
            : 0

        return (
          <Card key={service._id} className="overflow-hidden border border-border">
            <div
              className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => toggleService(service._id || "")}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Camera className="w-5 h-5 text-orange-600" />
                    <h3 className="text-xl font-semibold text-foreground">{service.serviceTitle}</h3>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Starting at</span>
                      <span className="text-lg font-semibold text-foreground">
                        ₹{minPrice > 0 ? minPrice.toLocaleString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{minHours > 0 ? `${minHours}h minimum` : "Custom duration"}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2">{service.serviceDescription}</p>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {isExpanded && (
              <CardContent className="px-6 pb-6 pt-2 border-t border-border bg-muted/20">
                <div className="space-y-6">
                  {/* Style Specialties */}
                  {service.styleSpecialty && service.styleSpecialty.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Style Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.styleSpecialty.map((style: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                          >
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Durations & Pricing */}
                  {service.sessionDurations && service.sessionDurations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Available Packages</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {service.sessionDurations.map((session: any, idx: number) => (
                          <div key={idx} className="p-4 bg-background rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground">{session.durationInHours}h Session</span>
                              <span className="text-lg font-semibold text-orange-600">
                                ₹{session.price.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Perfect for {session.durationInHours > 4 ? "full day" : "short"} coverage
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewDetails(service)
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      View Full Details & Book
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
