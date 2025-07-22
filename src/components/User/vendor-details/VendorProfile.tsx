"use client"
import { MapPin, Star, Award, Calendar, MessageSquare, Loader2, Globe, Camera } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { IVendorDetails } from "@/types/interfaces/vendor"
import { ImageWithFallback } from "../ImageFallBack"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { createConversationClient, createConversationVendor } from "@/services/chat/chatService"
import { useCreateConversation } from "@/hooks/chat/useChat"
import { handleError } from "@/utils/Error/error-handler.utils"
import { useNavigate } from "react-router-dom"

interface VendorProfileProps {
  vendor: IVendorDetails
}

export function VendorProfile({ vendor }: VendorProfileProps) {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => {
    if (state.client.client) return state.client.client
    if (state.vendor.vendor) return state.vendor.vendor
    return undefined
  })

  const profileImage = vendor?.profileImage
  const mutateFn = user?.role === "client" ? createConversationClient : createConversationVendor

  const { mutate: createConversation, isPending } = useCreateConversation(mutateFn)

  function handleSendMessage() {
    createConversation(
      {
        userId: user?._id ? user._id : "",
        vendorId: vendor._id ? vendor._id : "",
      },
      {
        onSuccess: () => {
          navigate("/messages")
        },
        onError: (error) => {
          handleError(error)
        },
      },
    )
  }

  if (!user || !user._id) {
    return <p>user not found please try again later , or please relogin to continue</p>
  }

  const totalPhotos = vendor?.workSamples?.reduce((acc, sample) => acc + (sample.media?.length || 0), 0) || 0

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto lg:mx-0">
                <ImageWithFallback
                  src={profileImage || "/placeholder.svg?height=256&width=256"}
                  alt={`${vendor?.name || "Vendor"} profile`}
                  className="object-cover w-full h-full"
                  fallbackType="profile"
                />
              </div>
              {vendor?.isVerified === "accept" && (
                <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-16 lg:translate-x-0">
                  <Badge className="bg-orange-500 text-white border-0 shadow-lg px-3 py-1.5 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Verified Pro
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {`Photographer ${vendor.name}`}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor?.location?.address || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Available for bookings</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                {vendor?.description ||
                  "Professional photographer specializing in capturing life's most precious moments with artistic vision and technical expertise."}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{totalPhotos}</div>
                <div className="text-sm text-muted-foreground">Photos</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{vendor?.services?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Services</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {vendor?.services?.[0]?.yearsOfExperience || 0}
                </div>
                <div className="text-sm text-muted-foreground">Years Exp.</div>
              </div>  
            </div>

            {/* Languages & Specialties */}
            <div className="space-y-4">
              {vendor?.languages && vendor.languages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {vendor.languages.map((lang, index) => (
                      <Badge
                        key={`${lang}-${index}`}
                        variant="secondary"
                        className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {vendor?.services?.[0]?.styleSpecialty && vendor.services[0].styleSpecialty.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {vendor.services[0].styleSpecialty.slice(0, 6).map((specialty, index) => (
                      <Badge
                        key={`${specialty}-${index}`}
                        variant="outline"
                        className="px-3 py-1 border-border text-foreground hover:bg-muted"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {vendor.services[0].styleSpecialty.length > 6 && (
                      <Badge variant="outline" className="px-3 py-1">
                        +{vendor.services[0].styleSpecialty.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {user._id !== vendor._id && (
              <div className="flex gap-3 pt-4">
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2.5"
                  onClick={handleSendMessage}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <MessageSquare className="w-4 h-4 mr-2" />
                  )}
                  Send Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
