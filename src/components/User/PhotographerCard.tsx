"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useThemeConstants } from "@/utils/theme/themeUtills"
import type { IVendorsResponse } from "@/types/User"
import { useNavigate } from "react-router-dom"

interface PhotographerCardProps {
  vendorData: IVendorsResponse
}

const PhotographerCard = ({ vendorData }: PhotographerCardProps) => {
  const navigate = useNavigate()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const { textColor, borderColor } = useThemeConstants()

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
    carouselRef.current.style.cursor = "grabbing"
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab"
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab"
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 0.6
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMouseMove(e as unknown as React.MouseEvent<HTMLDivElement>)
    }
    const handleWindowMouseUp = () => handleMouseUp()

    window.addEventListener("mousemove", handleWindowMouseMove)
    window.addEventListener("mouseup", handleWindowMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove)
      window.removeEventListener("mouseup", handleWindowMouseUp)
    }
  }, [isDragging, startX, scrollLeft])


  const hourlyRate = vendorData.services[0].sessionDurations[0].price
  const currency = "INR"
  const minimumHours = vendorData.services[0].sessionDurations[0].durationInHours

  return (
    <div className=" rounded-lg shadow-md overflow-hidden max-w-7xl mx-auto mb-20">
      <div className="p-6 pb-0 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=> navigate(`/photographer/${vendorData._id}`)}>
          <h2 className={`text-xl`}>{vendorData.name}</h2>
          {vendorData.isVerified === "accept" && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">PRO+</span>
          )}
        </div>
        <Button variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-gray-600">
          <Bookmark className="h-4 w-4" />
          <span>save</span>
        </Button>
      </div>

      <div className="px-6 text-sm text-gray-500 cursor-pointer" onClick={()=> navigate(`/photographer/${vendorData._id}`)}>{vendorData.location}</div>

      {/* Main content section */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
        {/* Profile image - hexagonal */}
        <div className="relative w-32 h-32 mx-auto md:mx-0" onClick={()=> navigate(`/photographer/${vendorData._id}`)}>
            <div
            className="w-full h-full overflow-hidden cursor-pointer"
            >
            <img
              src={vendorData.profileImage || "/placeholder.svg"}
              alt={vendorData.name}
              className="w-full h-full object-cover rounded-full"
            />
            </div>
        </div>

        {/* Portfolio gallery */}
        <div className="flex flex-col">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto space-x-3 cursor-grab pb-4"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={isDragging ? handleMouseMove : undefined}
            style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
          >
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
                  )),
              )
            ) : (
              <div className="h-48 w-full bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">No portfolio images</p>
              </div>
            )}
          </div>

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
                <div className="text-sm text-gray-500 dark:text-gray-400">{minimumHours} hours minimum</div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-end">
              <Button
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
              WhatsApp
              </Button>
              <Button variant="outline" className={`border ${borderColor} border-blue-600 dark:text-blue-400 text-blue-600`} onClick={()=> navigate(`/vendor/${vendorData._id}`)}>
              Visit profile
              </Button>
              <Button variant={"outline"}>Send message</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotographerCard

