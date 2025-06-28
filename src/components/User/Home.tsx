"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Camera, Users, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { useAllVendorsListQuery } from "@/hooks/client/useClient"
import { LoadingBar } from "../ui/LoadBar"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

// Your existing interface
export interface ICommunityPost {
  _id?: string
  communityId: string
  userId: string
  title: string
  content: string
  media: string[]
  mediaType?: "image" | "video" | "mixed" | "none"
  isEdited?: boolean
  likeCount: number
  commentCount: number
  tags: string[]
  comments: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ICommunityPostResponse {
  _id?: string
  communityId: string
  userId: {
    _id: string
    name: string
    profileImage: string
  }
  isLiked: boolean
  title: string
  content: string
  media: string[]
  mediaType?: "image" | "video" | "mixed" | "none"
  isEdited?: boolean
  likeCount: number
  commentCount: number
  tags: string[]
  comments: string[]
  createdAt?: string
  updatedAt?: string
}

// Transform work samples into hero posts format
const transformWorkSamplesToHeroPosts = (photographers: any[]) => {
  const heroPosts: any[] = []

  photographers.forEach((photographer) => {
    if (photographer.workSamples && Array.isArray(photographer.workSamples)) {
      photographer.workSamples.forEach((workSample: any) => {
        if (workSample && workSample.media && Array.isArray(workSample.media) && workSample.media.length > 0) {
          heroPosts.push({
            _id: workSample._id || `work-${Math.random()}`,
            title: workSample.title || "Professional Photography Work",
            content: workSample.description || "Explore this amazing photography work...",
            media: workSample.media.filter(Boolean), // Remove any null/undefined media
            mediaType: "image",
            likeCount: Math.floor(Math.random() * 100) + 20,
            commentCount: Math.floor(Math.random() * 30) + 5,
            tags: Array.isArray(workSample.tags) ? workSample.tags : [],
            photographer: {
              name: photographer.name || "Professional Photographer",
              profileImage: photographer.profileImage || "/placeholder.svg",
              location: photographer.location?.address || "Available",
              categories: Array.isArray(photographer.categories)
                ? photographer.categories.map((cat: any) => cat?.title).filter(Boolean)
                : [],
            },
            service:
              Array.isArray(photographer.services) && photographer.services.length > 0
                ? photographer.services[0]
                : null,
          })
        }
      })
    }
  })

  return heroPosts.length > 0 ? heroPosts : fallbackPosts
}

// Fallback posts if no work samples available
const fallbackPosts = [
  {
    _id: "fallback1",
    title: "Discover Amazing Photography Services",
    content: "Connect with professional photographers in your area for all your photography needs...",
    media: ["/placeholder.svg?height=800&width=1200"],
    mediaType: "image",
    likeCount: 47,
    commentCount: 12,
    tags: ["photography", "professional"],
    photographer: {
      name: "Professional Photographers",
      profileImage: "/placeholder.svg?height=100&width=100",
      location: "Available Nationwide",
      categories: ["All Categories"],
    },
  },
]

export default function CommunityHome() {
  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor
    if (state.client.client) return state.client.client
    return null
  })

  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const [marker, setMarker] = useState<{ lng: number; lat: number }>({
    lng: 0,
    lat: 0,
  })
  const [heroPosts, setHeroPosts] = useState<any[]>(fallbackPosts)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const navigate = useNavigate()

  const { data, isLoading, isError } = useAllVendorsListQuery({
    maxCharge: 100000,
    location: marker,
    limit: 4,
    page: 1,
    enabled: user?.role === "client",
  })

  const onlinePhotographers = data?.data.data || []

  // Transform real data into hero posts when data is available
  useEffect(() => {
    if (onlinePhotographers.length > 0) {
      const transformedPosts = transformWorkSamplesToHeroPosts(onlinePhotographers)
      if (transformedPosts.length > 0) {
        setHeroPosts(transformedPosts)
      }
    }
  }, [onlinePhotographers])

  // Smooth transition between posts every 6 seconds
  useEffect(() => {
    if (heroPosts.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentPostIndex((prevIndex) => (prevIndex + 1) % heroPosts.length)
        setIsTransitioning(false)
      }, 300) // Half of transition duration
    }, 6000)

    return () => clearInterval(interval)
  }, [heroPosts.length])

  useEffect(() => {
    if (navigator.geolocation && marker.lat == 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        }
        setMarker(userLocation)
      })
    }
  }, [])

  const currentPost = heroPosts[currentPostIndex]

  // Add safety checks
  if (!currentPost || !currentPost.media || currentPost.media.length === 0) {
    return <LoadingBar />
  }

  if (isLoading) {
    return <LoadingBar />
  }

  if (isError) {
    return <p className="text-red-600">Error fetching photographers. Please try again later.</p>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br">
      {/* Hero Section - Real Work Samples Showcase */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        {/* Background Image with Smooth Transition */}
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
              isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
            style={{
              backgroundImage: `url(${currentPost?.media?.[0] || "/placeholder.svg?height=800&width=1200"})`,
              filter: "brightness(0.7)",
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              {/* Badges */}
              <div
                className={`flex items-center gap-3 mb-6 transition-all duration-500 ${
                  isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1">
                  Featured Work
                </Badge>
                {currentPost?.photographer?.categories?.[0] && (
                  <Badge variant="outline" className="text-white border-white/30 px-3 py-1">
                    {currentPost.photographer.categories[0]}
                  </Badge>
                )}
                {currentPost?.tags?.[0] && (
                  <Badge variant="outline" className="text-orange-200 border-orange-200/30 px-3 py-1">
                    {currentPost.tags[0]}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight transition-all duration-500 delay-100 ${
                  isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                {currentPost?.title || "Discover Amazing Photography"}
              </h1>

              {/* Description */}
              <p
                className={`text-lg md:text-xl mb-6 text-orange-100 leading-relaxed max-w-2xl transition-all duration-500 delay-200 ${
                  isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                {currentPost?.content ||
                  "Connect with professional photographers in your area for all your photography needs."}
              </p>

              {/* Photographer Info */}
              {currentPost?.photographer && (
                <div
                  className={`flex items-center gap-4 mb-8 transition-all duration-500 delay-300 ${
                    isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
                >
                  <Avatar className="w-12 h-12 border-2 border-white/20">
                    <AvatarImage src={currentPost.photographer.profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-orange-600 text-white">
                      {currentPost.photographer.name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">
                      {currentPost.photographer.name || "Professional Photographer"}
                    </p>
                    <p className="text-orange-200 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentPost.photographer.location || "Available"}
                    </p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div
                className={`flex items-center gap-6 mb-8 transition-all duration-500 delay-300 ${
                  isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4" />
                  <span>{currentPost?.likeCount || 0} likes</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Camera className="w-4 h-4" />
                  <span>{currentPost?.commentCount || 0} comments</span>
                </div>
                {currentPost?.service?.sessionDurations?.durationInHours && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{currentPost.service.sessionDurations.durationInHours}h sessions</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-400 ${
                  isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                }`}
              >
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
                  onClick={() => navigate("/photographers")}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Find Photographers
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
                  onClick={() => navigate("/communities")}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        {heroPosts.length > 1 && (
          <div className="absolute bottom-6 left-6 flex gap-2">
            {heroPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setCurrentPostIndex(index)
                    setIsTransitioning(false)
                  }, 300)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPostIndex ? "bg-orange-500 scale-110" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {heroPosts.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
            <div
              className="h-full bg-orange-500 transition-all duration-75 ease-linear"
              style={{
                width: `${((currentPostIndex + 1) / heroPosts.length) * 100}%`,
              }}
            />
          </div>
        )}
      </section>

      {/* Online Photographers - Instant Booking */}
      <section className="py-16 bg-gradient-to-r">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-200">Available Right Now</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Connect instantly with online photographers in your area
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/photographers")}>
              <span>View all photographers</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {user?.role === "client" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {onlinePhotographers.map((photographer) => (
                <div
                  key={photographer._id}
                  className="rounded-xl p-6 border transition-all group shadow-sm cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={photographer.profileImage || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback>{photographer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {photographer.isOnline && (
                        <div className="absolute bottom-0 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">{photographer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{photographer.location?.address}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {photographer.services[0].styleSpecialty.slice(0, 2).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => navigate(`/photographer/${photographer._id}`)}
                    variant="default"
                    className="w-full"
                  >
                    Book now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
  