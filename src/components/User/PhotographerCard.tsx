"use client"

import { useNavigate } from "react-router-dom"
import { MapPin, Clock, ArrowUpRight, Star, Camera, Award, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { IVendorsResponse } from "@/types/interfaces/User"
import { ImageWithFallback } from "./ImageFallBack"
import { useState } from "react"

interface PhotographerCardProps {
  vendorData: IVendorsResponse
}

const PhotographerCard = ({ vendorData }: PhotographerCardProps) => {
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const hourlyRate = vendorData?.services[0]?.sessionDurations.price || 0
  const currency = "INR"
  const minimumHours = vendorData?.services[0]?.sessionDurations?.durationInHours || 0

  const handleNavigate = () => navigate(`/photographer/${vendorData._id}`)

  // Flatten work samples for easier handling
  const allWorkSamples =
    vendorData.workSamples?.flatMap(
      (work, workIndex) =>
        work.media?.map((src, mediaIndex) => ({
          src: src || "/placeholder.svg?height=400&width=320",
          alt: `Portfolio ${workIndex + 1}-${mediaIndex + 1}`,
          workTitle: work.title || `Work ${workIndex + 1}`,
        })) || [],
    ) || []

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}L`
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`
    }
    return price.toString()
  }

  return (
    <Card className="overflow-hidden bg-background border border-border hover:border-border/80 transition-colors duration-200 mb-6">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[400px]">
          {/* Left Section - Profile & Info */}
          <div className="p-6 bg-muted/20 border-r border-border">
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="relative">
                <div
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={handleNavigate}
                >
                  <ImageWithFallback
                    src={vendorData.profileImage || "/placeholder.svg?height=280&width=280"}
                    alt={`${vendorData?.name || "Vendor"} profile`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackType="profile"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Verification Badge */}
                {vendorData.isVerified === "accept" && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                      <Award className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                )}
              </div>

              {/* Photographer Info */}
              <div className="space-y-3">
                <div className="cursor-pointer" onClick={handleNavigate}>
                  <h2 className="text-xl font-semibold text-foreground hover:text-orange-600 transition-colors">
                    {vendorData.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{vendorData.location?.address || "Location not specified"}</span>
                  </div>
                </div>

                {/* Rating (if available) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                  <span className="text-xs text-muted-foreground">(24 reviews)</span>
                </div>

                {/* Pricing */}
                {hourlyRate > 0 && (
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="text-lg font-semibold text-foreground">
                      ₹{formatPrice(hourlyRate)} {hourlyRate >= 1000 ? "" : currency}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{minimumHours}h minimum</span>
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {vendorData.services && vendorData.services.length > 0 && vendorData.services[0].styleSpecialty && vendorData.services[0].styleSpecialty.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Specialties</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {vendorData.services[0].styleSpecialty.slice(0, 2).map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {vendorData.services[0].styleSpecialty.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          +{vendorData.services[0].styleSpecialty.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                  onClick={handleNavigate}
                >
                  View Profile
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Section - Portfolio & Description */}
          <div className="p-6 space-y-6">
            {/* About Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-foreground">About</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {vendorData.description ||
                  "Professional photographer specializing in capturing life's most precious moments with artistic vision and technical excellence."}
              </p>
            </div>

            {/* Portfolio Gallery */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Portfolio</h3>

              {allWorkSamples.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Featured Image */}
                  <div
                    className="relative aspect-[12/6] overflow-hidden rounded-lg cursor-pointer group bg-muted"
                    onClick={handleNavigate}
                  >
                    <img
                      src={allWorkSamples[selectedImageIndex]?.src || "/placeholder.svg?height=300&width=480"}
                      alt={allWorkSamples[selectedImageIndex]?.alt || "Portfolio"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">{allWorkSamples[selectedImageIndex]?.workTitle}</p>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/70 text-white p-2 rounded-full backdrop-blur-sm">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {allWorkSamples.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {allWorkSamples.slice(0, 4).map((sample, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square overflow-hidden rounded-md cursor-pointer transition-all duration-200 ${
                            selectedImageIndex === index
                              ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-background"
                              : "hover:opacity-80"
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={sample.src || "/placeholder.svg"}
                            alt={sample.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {index === 3 && allWorkSamples.length > 4 && (
                            <div
                              className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-medium text-sm cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleNavigate()
                              }}
                            >
                              +{allWorkSamples.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Portfolio Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <button
                      onClick={handleNavigate}
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/10] bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center space-y-2">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No portfolio images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PhotographerCard
