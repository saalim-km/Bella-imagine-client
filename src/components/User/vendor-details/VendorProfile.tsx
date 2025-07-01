"use client"

import { MapPin, Star, Award, ArrowRight, Users, Calendar, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { IVendorDetails } from "@/types/interfaces/vendor"
import { ImageWithFallback, ImageWithFallbackForWork } from "../ImageFallBack"

interface VendorProfileProps {
  vendor: IVendorDetails
}

export function VendorProfile({ vendor }: VendorProfileProps) {
  const heroImage = vendor?.workSamples?.[0]?.media?.[0]
  const profileImage = vendor?.profileImage

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden bg-background border border-border">
        <div className="relative h-48 sm:h-64 lg:h-80 w-full">
          <ImageWithFallbackForWork
            src={heroImage || "/placeholder.svg?height=320&width=800"}
            alt={`${vendor?.name || "Vendor"} work sample`}
            className="w-full h-full object-cover"
            fallbackType="work"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {vendor?.name || "Vendor Name"}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor?.location?.address || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9 (124 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>256 bookings</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left Column - Profile Card */}
        <Card className="bg-background border border-border h-fit">
          <CardContent className="p-6 space-y-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={profileImage || "/placeholder.svg?height=240&width=240"}
                  alt={`${vendor?.name || "Vendor"} profile`}
                  className="object-cover w-full h-full"
                  fallbackType="profile"
                />
              </div>

              {vendor?.isVerified === "accept" && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white border-0 shadow-lg px-3 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    Verified Pro
                  </Badge>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {vendor?.workSamples?.reduce((acc, sample) => acc + (sample.media?.length || 0), 0) || 0}
                </div>
                <div className="text-xs text-muted-foreground">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{vendor?.services?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Services</div>
              </div>
            </div>

            {/* Experience */}
            {vendor?.services?.[0]?.yearsOfExperience && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Experience</h4>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-semibold text-foreground">{vendor.services[0].yearsOfExperience}</div>
                  <div className="text-xs text-muted-foreground">Years</div>
                </div>
              </div>
            )}

            {/* Languages */}
            {vendor?.languages && vendor.languages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Languages</h4>
                <div className="flex flex-wrap gap-1">
                  {vendor.languages.slice(0, 3).map((lang, index) => (
                    <Badge
                      key={`${lang}-${index}`}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    >
                      {lang}
                    </Badge>
                  ))}
                  {vendor.languages.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{vendor.languages.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - About and Details */}
        <div className="space-y-6">
          {/* About Section */}
          <Card className="bg-background border border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {vendor?.description || "No description available yet."}
              </p>
            </CardContent>
          </Card>

          {/* Specialties */}
          {vendor?.services?.[0]?.styleSpecialty && vendor.services[0].styleSpecialty.length > 0 && (
            <Card className="bg-background border border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Specialties</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-600 hover:text-orange-700 p-0 h-auto"
                    onClick={() => {
                      const servicesTab = document.querySelector('[data-value="services"]') as HTMLElement
                      servicesTab?.click()
                    }}
                  >
                    <span className="text-sm">View Services</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vendor.services[0].styleSpecialty.map((specialty, index) => (
                    <Badge
                      key={`${specialty}-${index}`}
                      variant="outline"
                      className="px-3 py-1 border-border text-foreground hover:bg-muted"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Availability & Contact */}
          <Card className="bg-background border border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Availability</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Available for bookings</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Typically responds within 2 hours</span>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
