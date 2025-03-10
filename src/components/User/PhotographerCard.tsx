import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import '../../assets/css/photographer-card.css'
import { useThemeConstants } from "@/utils/theme/themeUtills";
import ToolTip from "../common/ToolTip";

interface PhotographerCardProps {
  portfolioImages: string[];
}

const PhotographerCard = ({ portfolioImages }: PhotographerCardProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { isDarkMode, bgColor, textColor, borderColor, buttonPrimary } =
    useThemeConstants();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjusted scroll speed
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Add event listeners to the window for mouseup and mousemove
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDragging)
        handleMouseMove(e as unknown as React.MouseEvent<HTMLDivElement>);
    };
    const handleWindowMouseUp = () => handleMouseUp();

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <div
      className={`flex flex-col p-6 mb-10 rounded-lg shadow-md  max-w-6xl mx-auto mt-16`}
    >
      {/* Top Section - Photographer Info and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gradient-to-br rounded-full p-0.5">
              <img
                src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719880/unnamed_fwjzvp.png"
                alt="Photographer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h3 className={`text-lg font-semibold ${textColor}`}>
                Daniele Torella
              </h3>
              <span className="bg-cyan-400 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                PRO+
              </span>
            </div>
            <p className={`text-sm ${textColor}`}>Rome, Italy</p>
          </div>
        </div>
        <div className="flex items-center">
          <ToolTip
            content="Add To Favourites"
            element={
              <Button
                variant="outline"
                className={`px-4 py-2 flex items-center gap-2 ${buttonPrimary} ${textColor}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"  
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isDarkMode ? "white" : "white"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </Button>
            }
          />
        </div>
      </div>

      {/* Carousel Section */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-3 mb-6 cursor-grab pb-2 hide-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {portfolioImages.map((src, index) => (
          <img
            key={index}
            src={src || "/placeholder.svg"}
            alt={`Portfolio ${index + 1}`}
            className="h-48 object-cover rounded-md flex-shrink-0"
            style={{ width: index === 0 ? "180px" : "240px" }}
            draggable="false"
          />
        ))}
      </div>

      {/* Bottom Section - Description and Pricing */}
      <div className="flex flex-col space-y-4">
        <p className={`text-sm ${textColor}`}>
          Documenting exclusive weddings around the world through cinematic,
          elegant, and timeless photographs. As seen in Vogue, Elle & Vanity
          Fair.
        </p>

        <div className="flex justify-between items-end">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-1 fill-yellow-500" />
            <span className="text-sm">4.9 (120 reviews)</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
            <Button
            variant="outline"
            className={`border ${borderColor} ${buttonPrimary} text-white hover:text-white`}
            >
            Visit Profile
            </Button>
          <Button className="bg-[#655b52] hover:bg-[#544941] text-white">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;
