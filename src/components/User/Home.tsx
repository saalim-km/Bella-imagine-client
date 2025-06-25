"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Camera, Users, Zap, TrendingUp, Clock, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

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
    _id : string;
    name : string;
    profileImage : string
  }
  isLiked : boolean;
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

// Extended interfaces for the home page
interface PhotographerProfile {
  _id: string
  name: string
  avatar: string
  location: string
  specialties: string[]
  isOnline: boolean
  responseTime: string
  rating: number
  completedSessions: number
  joinedDate: string
  isVerified: boolean
  currentlyBooking: boolean
}

interface CommunityActivity {
  type: "post" | "booking" | "join" | "achievement"
  photographer: PhotographerProfile
  content: string
  timestamp: string
  engagement?: number
}

// Mock data
const categories = [
  { _id: "1", title: "Wedding", count: 156 },
  { _id: "2", title: "Portrait", count: 234 },
  { _id: "3", title: "Family", count: 189 },
  { _id: "4", title: "Events", count: 98 },
  { _id: "5", title: "Fashion", count: 67 },
  { _id: "6", title: "Travel", count: 145 },
  { _id: "7", title: "Architecture", count: 78 },
  { _id: "8", title: "Food", count: 92 },
]

const featuredPosts: ICommunityPost[] = [
  {
    _id: "1" as any,
    communityId: "comm1" as any,
    userId: "user1" as any,
    title: "Golden Hour Magic at Marina Bay",
    content: "Just wrapped up an incredible engagement shoot! The lighting was absolutely perfect...",
    media: [
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/unnamed_5_i7qnb7.webp",
      "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_2_yjfx4l.webp",
    ],
    mediaType: "image",
    likeCount: 47,
    commentCount: 12,
    tags: ["engagement", "goldenhour", "marina"],
    comments: [],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2" as any,
    communityId: "comm1" as any,
    userId: "user2" as any,
    title: "Traditional Wedding Ceremony Highlights",
    content: "Honored to capture this beautiful traditional ceremony. Every moment was magical...",
    media: ["https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_1_re5olq.webp"],
    mediaType: "image",
    likeCount: 89,
    commentCount: 23,
    tags: ["wedding", "traditional", "ceremony"],
    comments: [],
    createdAt: "2024-01-14T15:20:00Z",
  },
  {
    _id: "3" as any,
    communityId: "comm1" as any,
    userId: "user3" as any,
    title: "Family Portrait Session in the Park",
    content: "Love capturing genuine family moments. This session was full of laughter and joy...",
    media: ["https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_mnfmjo.webp"],
    mediaType: "image",
    likeCount: 34,
    commentCount: 8,
    tags: ["family", "portrait", "outdoor"],
    comments: [],
    createdAt: "2024-01-13T09:45:00Z",
  },
]

const onlinePhotographers: PhotographerProfile[] = [
  {
    _id: "1",
    name: "Anita Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Mumbai, India",
    specialties: ["Wedding", "Portrait"],
    isOnline: true,
    responseTime: "~5 min",
    rating: 4.9,
    completedSessions: 127,
    joinedDate: "2023-03-15",
    isVerified: true,
    currentlyBooking: true,
  },
  {
    _id: "2",
    name: "Rahul Mehta",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Delhi, India",
    specialties: ["Family", "Events"],
    isOnline: true,
    responseTime: "~2 min",
    rating: 4.8,
    completedSessions: 89,
    joinedDate: "2023-06-20",
    isVerified: true,
    currentlyBooking: true,
  },
  {
    _id: "3",
    name: "Priya Kapoor",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Bangalore, India",
    specialties: ["Fashion", "Portrait"],
    isOnline: true,
    responseTime: "~3 min",
    rating: 4.9,
    completedSessions: 156,
    joinedDate: "2022-11-10",
    isVerified: true,
    currentlyBooking: false,
  },
  {
    _id: "4",
    name: "Vikram Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Jaipur, India",
    specialties: ["Wedding", "Traditional"],
    isOnline: false,
    responseTime: "~15 min",
    rating: 4.7,
    completedSessions: 203,
    joinedDate: "2022-08-05",
    isVerified: true,
    currentlyBooking: true,
  },
]

const recentActivity: CommunityActivity[] = [
  {
    type: "booking",
    photographer: onlinePhotographers[0],
    content: "just completed a wedding session",
    timestamp: "2 min ago",
    engagement: 12,
  },
  {
    type: "post",
    photographer: onlinePhotographers[1],
    content: "shared new family portrait tips",
    timestamp: "5 min ago",
    engagement: 34,
  },
  {
    type: "join",
    photographer: onlinePhotographers[2],
    content: "joined the Fashion Photography community",
    timestamp: "12 min ago",
  },
  {
    type: "achievement",
    photographer: onlinePhotographers[3],
    content: "reached 200 completed sessions milestone",
    timestamp: "1 hour ago",
    engagement: 67,
  },
]

export default function CommunityHome() {
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("All")

  // Rotate through featured posts every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPostIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const currentPost = featuredPosts[currentPostIndex]

  return (
    <main className="min-h-screen bg-gradient-to-br">
      {/* Hero Section - Community Showcase */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentPost.media[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Community Highlight
                </Badge>
                <Badge variant="outline" className="text-white border-white/30">
                  {currentPost.tags[0]}
                </Badge>
              </div>

              <h1 className="text-5xl font-bold mb-4 text-white leading-tight">{currentPost.title}</h1>
              <p className="text-xl mb-6 text-orange-100 leading-relaxed">{currentPost.content}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4" />
                  <span>{currentPost.likeCount} likes</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Camera className="w-4 h-4" />
                  <span>{currentPost.commentCount} comments</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="community-gradient hover:opacity-90 text-white"
                  onClick={() => navigate("/photographers")}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Find Photographers
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30"
                  onClick={() => navigate("/community")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Navigation Dots */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          {featuredPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPostIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentPostIndex ? "" : "/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Live Community Activity */}
      <section className="py-12 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">Live Community Activity</h2>
              <p className="text-gray-600 dark:text-gray-400">See what's happening right now in our photography community</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>

          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 rounded-xl p-4 border shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={activity.photographer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{activity.photographer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {activity.photographer.isOnline && (
                        <div className="absolute top-0 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-200 truncate">{activity.photographer.name}</span>
                        {activity.photographer.isVerified && <Star className="w-3 h-3 text-orange-500 fill-current" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        {activity.engagement && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>{activity.engagement}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>


      {/* Online Photographers - Instant Booking */}
      <section className="py-16 bg-gradient-to-r ">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-200">Available Right Now</h2>
              <p className="text-gray-600 dark:text-gray-400">Connect instantly with online photographers in your area</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/photographers")}>
              <span>View all photographers</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onlinePhotographers.map((photographer) => (
              <div
                key={photographer._id}
                className=" rounded-xl p-6 border transition-all group shadow-sm cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={photographer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{photographer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {photographer.isOnline && (
                      <div className="absolute top-0 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-orange-500 fill-current" />
                    <span className="text-sm font-medium">{photographer.rating}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">{photographer.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{photographer.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {photographer.specialties.slice(0, 2).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sessions completed</span>
                    <span className="font-medium">{photographer.completedSessions}</span>
                  </div>
                </div>

                <Button
                  className={`w-full ${
                    photographer.currentlyBooking
                      ? "community-gradient hover:opacity-90"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!photographer.currentlyBooking}
                >
                  {photographer.currentlyBooking ? (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Book
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Busy
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
