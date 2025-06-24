"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CategoryCard from "./CategoryCard";
import PhotoCard from "./PhotoCard";
import { useNavigate } from "react-router-dom";

// Sample data (would come from API in real implementation)
const categories = [
  { _id: "1", title: "Wedding" },
  { _id: "2", title: "Portrait" },
  { _id: "3", title: "Family" },
  { _id: "4", title: "Events" },
  { _id: "5", title: "Fashion" },
  { _id: "6", title: "Travel" },
  { _id: "7", title: "Architecture" },
  { _id: "8", title: "Food" },
];

const photos = [
  {
    id: "1",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531304/unnamed_5_i7qnb7.webp",
    alt: "Wedding couple by the lake",
    photographer: "Anita Sharma",
    category: "Wedding",
  },
  {
    id: "2",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_2_yjfx4l.webp",
    alt: "Family portrait in a garden",
    photographer: "Rahul Mehta",
    category: "Family",
  },
  {
    id: "3",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_mnfmjo.webp",
    alt: "Engagement photoshoot at sunset",
    photographer: "Priya Kapoor",
    category: "Engagement",
  },
  {
    id: "4",
    src: "https://res.cloudinary.com/deh2nuqeb/image/upload/v1741531305/unnamed_1_re5olq.webp",
    alt: "Traditional Indian wedding ceremony",
    photographer: "Vikram Singh",
    category: "Wedding",
  },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  // Rotate through images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photos[currentImageIndex].src})` }}
        />

        <div className="relative z-10 h-full flex items-center ">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Find Local Photographers in Your Community
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white">
              Connect with talented photographers near you for any occasion
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant={"outline"}
                onClick={() => navigate("/photographers")}
              >
                Exlpore Photographers
              </Button>
              <Button
                variant={"default"}
                onClick={() => navigate("/communities")}
              >
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Popular Photography Categories
            </h2>
            <p className="text-gray-600">
              Find photographers specializing in your specific needs
            </p>
          </div>

          <ScrollArea className="w-full pb-6">
            <div className="flex space-x-4">
              <CategoryCard
                key="all"
                title="All"
                isActive={activeCategory === "All"}
                onClick={() => setActiveCategory("All")}
              />
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  title={category.title}
                  isActive={activeCategory === category.title}
                  onClick={() => setActiveCategory(category.title)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Featured Photographers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Featured Community Members
              </h2>
              <p className="text-gray-600">
                Top-rated photographers in your area
              </p>
            </div>
            <a
              href="/photographers"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {photos.slice(0, 4).map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
