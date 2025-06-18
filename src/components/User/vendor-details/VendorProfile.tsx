"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Award,
  MessageCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IVendor } from "@/services/vendor/vendorService";
import { IVendorDetails } from "@/types/interfaces/vendor";

// Define the Vendor type
interface VendorProfileProps {
  vendor: IVendorDetails;
}

export default function VendorProfile({ vendor }: VendorProfileProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-xl overflow-hidden">
        <img src={vendor.workSamples[0].media[0]}/>
        <div className="absolute bottom-0 left-0 p-8 z-20">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-2">
            {vendor.name}
          </h1>
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{vendor.location?.address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">4.9 (124 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Left Column - Profile Image and Quick Actions */}
        <div className="space-y-6">
          <div className="relative">
            <div className="aspect-square w-full overflow-hidden rounded-xl border border-border/10">
              <img
                src={vendor.profileImage || "/placeholder.svg"}
                alt={vendor.name}
                className="object-cover w-full h-full"
              />
            </div>
            {vendor.isVerified === "accept" && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-foreground text-background px-4 py-1 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  <span className="text-xs uppercase tracking-wider">
                    Verified Pro
                  </span>
                </Badge>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2"
              onClick={() => setIsBookingOpen(true)}
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Book Now</span>
            </Button>
            <Button
              variant="outline"
              className="w-full border-border/20 hover:bg-muted/10 flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Message</span>
            </Button>
          </div>
        </div>

        {/* Right Column - Bio and Details */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {vendor.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">
                Specialties
              </h2>
              <a
                href="#services"
                className="text-sm uppercase tracking-wider flex items-center gap-1 group text-foreground/80 hover:text-foreground"
              >
                <span>View All Services</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {vendor.services[0]?.styleSpecialty?.map((specialty) => (
                <Badge
                  key={specialty}
                  variant="outline"
                  className="px-3 py-1 border-border/20 text-foreground/80 hover:text-foreground"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">
                Languages speak
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {vendor.languages?.map((lang) => (
                <Badge
                  key={lang}
                  variant="outline"
                  className="px-3 py-1 border-border/20 text-foreground/80 hover:text-foreground"
                >
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">Experience</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-border/10 rounded-lg bg-muted/5">
                {vendor.services[0] && (
                  <>
                    <div className="text-3xl font-serif text-foreground mb-1">
                      {vendor.services[0].yearsOfExperience}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Years Experience
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
