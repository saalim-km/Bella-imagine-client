import { useNavigate } from "react-router-dom";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { IVendorsResponse } from "@/types/interfaces/User";
import { ImageWithFallback } from "./ImageFallBack";

interface PhotographerCardProps {
  vendorData: IVendorsResponse;
}

const PhotographerCard = ({ vendorData }: PhotographerCardProps) => {
  console.log("photographer card", vendorData);
  const navigate = useNavigate();

  const hourlyRate = vendorData?.services[0]?.sessionDurations.price || 0;
  const currency = "INR";
  const minimumHours = vendorData?.services[0]?.sessionDurations?.durationInHours || 0;

  const handleNavigate = () => navigate(`/photographer/${vendorData._id}`);

  return (
    <div className="bg-card border border-border/10 rounded-lg overflow-hidden mb-12 flex flex-col p-8">
      {/* Header Section */}
      <div className="mb-4 flex justify-start items-center">
        <div className="group cursor-pointer" onClick={handleNavigate}>
          <h2 className=" text-2xl text-foreground group-hover:text-primary/90 transition-colors">
            {vendorData.name}
          </h2>

          {vendorData.isVerified == "accept" && (
            <Badge className="bg-black dark:bg-white dark:text-black font-sans text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Pro
            </Badge>
          )}
        </div>

        {/* Location */}
        <div
          className="px-8 flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onClick={handleNavigate}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>{vendorData.location?.address}</span>
        </div>
      </div>

      {/* Main Content Section */}
      <div className=" grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        {/* Profile Section */}
        <div className="space-y-6">
          {/* Profile Image */}
          <div
            className="relative aspect-square overflow-hidden cursor-pointer"
            onClick={handleNavigate}
          >
            <div className="absolute inset-0 to-transparent opacity-0 transition-opacity z-10" />
            <ImageWithFallback
              src={vendorData.profileImage}
              alt={`${vendorData?.name || "Vendor"} profile`}
              className="w-full h-full object-cover"
              fallbackType="profile"
            />
          </div>

          {/* Pricing */}
          {hourlyRate > 0 && (
            <div className="space-y-1">
              <div className="text-2xl  text-foreground">
                {hourlyRate} {currency}

              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{minimumHours} hours minimum</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans text-sm uppercase tracking-wider"
            onClick={handleNavigate}
          >
            View Profile
          </Button>
        </div>

        {/* Portfolio Section */}
        <div className="space-y-6">
          {/* Portfolio Gallery */}
          <div className="relative w-full">
            <ScrollArea className="w-full rounded-md border border-border/10">
              <div className="flex space-x-4  overflow-x-auto">
                {vendorData.workSamples && vendorData.workSamples.length > 0 ? (
                  vendorData.workSamples.flatMap(
                    (work, workIndex) =>
                      work.media &&
                      work.media.map((src, mediaIndex) => (
                        <div
                          key={`${workIndex}-${mediaIndex}`}
                          className="relative flex-shrink-0 aspect-[4/5] w-64 overflow-hidden rounded-md group cursor-pointer"
                          onClick={handleNavigate}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                          <img
                            src={src || "/placeholder.svg"}
                            alt={`Portfolio ${workIndex + 1}-${mediaIndex + 1}`}
                            className="h-full w-full object-cover"
                            draggable="false"
                          />
                          <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowUpRight className="h-5 w-5" />
                          </div>
                        </div>
                      ))
                  )
                ) : (
                  <div className="h-64 w-full bg-muted/30 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">No portfolio images</p>
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2">
            <div className="w-4/8">
              <h3 className=" text-lg text-foreground">About</h3>
              <p className="text-muted-foreground leading-relaxed">
                {vendorData.description ||
                  "Documenting exclusive weddings around the world through cinematic, elegant and timeless photographs."}
              </p>
            </div>

            {/* Specialties/Tags (if available) */}
            {vendorData.services && vendorData.services.length > 0 && (
              <div className="flex-1">
                <h3 className=" text-lg text-foreground">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {vendorData.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted/30 text-muted-foreground text-xs rounded-full"
                    >
                      {service.serviceTitle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;
