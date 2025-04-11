"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import type { IVendorsResponse } from "@/types/User";
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PhotographerCardProps {
  vendorData: IVendorsResponse;
}

const PhotographerCard = ({ vendorData }: PhotographerCardProps) => {
  const navigate = useNavigate();
  const { textColor } = useThemeConstants();

  const hourlyRate = vendorData?.services[0]?.sessionDurations[0]?.price || 0;
  const currency = "INR";
  const minimumHours = vendorData?.services[0]?.sessionDurations[0]?.durationInHours || 0;

  return (
    <div className="rounded-lg shadow-md overflow-hidden max-w-7xl mx-auto mb-20">
      <div className="p-6 pb-0 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/photographer/${vendorData._id}`)}
        >
          <h2 className={`text-xl`}>{vendorData.name}</h2>
          {vendorData.isVerified === "accept" && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">PRO+</span>
          )}
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
        >
          <Bookmark className="h-4 w-4" />
          <span>save</span>
        </Button>
      </div>

      <div
        className="px-6 text-sm text-gray-500 cursor-pointer"
        onClick={() => navigate(`/photographer/${vendorData._id}`)}
      >
        {vendorData.location}
      </div>

      {/* Main content section */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
        {/* Profile image */}
        <div
          className="relative w-32 h-32 mx-auto md:mx-0"
          onClick={() => navigate(`/photographer/${vendorData._id}`)}
        >
          <div className="w-full h-full overflow-hidden cursor-pointer">
            <img
              src={vendorData.profileImage || "/placeholder.svg"}
              alt={vendorData.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Portfolio gallery */}
        <div className="flex flex-col">
          <ScrollArea className="w-full rounded-md border">
            <div className="flex w-max space-x-3 p-4">
              {vendorData.workSamples && vendorData.workSamples.length > 0 ? (
                vendorData.workSamples.map(
                  (work, workIndex) =>
                    work.media &&
                    work.media.map((src, mediaIndex) => (
                      <img
                        key={`${workIndex}-${mediaIndex}`}
                        src={src.url || "/placeholder.svg"}
                        alt={`Portfolio ${workIndex + 1}-${mediaIndex + 1}`}
                        className="h-52 object-cover rounded-md flex-shrink-0"
                        draggable="false"
                      />
                    ))
                )
              ) : (
                <div className="h-48 w-full bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">No portfolio images</p>
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Description */}
          <div className="">
            <p className={`text-sm ${textColor}`}>
              {vendorData.description ||
                "Documenting exclusive weddings around the world through cinematic, elegant and timeless photographs."}
            </p>
          </div>

          {/* Pricing and action buttons */}
          <div className="mt-2 flex justify-between">
            {hourlyRate && (
              <div className="mb-4">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {hourlyRate} {currency} <span className="text-sm font-normal">/ hour</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {minimumHours} hours minimum
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-end">
              <Button variant="outline" onClick={() => navigate(`/photographer/${vendorData._id}`)}>
                Visit profile
              </Button>
              <Button variant={"outline"}>Send message</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;