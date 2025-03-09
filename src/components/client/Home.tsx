import { Badge } from "@/components/modals/badge";
import { Search } from "lucide-react";
import React from "react";
import { useThemeConstants } from "@/utils/theme/themeUtills";

interface Category {
  name: string;
  image: string;
}

interface Steps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface HomePage {
  categories: Category[];
  howItWorksSteps: Steps[];
}

export default function Home({ categories, howItWorksSteps }: HomePage) {
  const { isDarkMode, bgColor, textColor } = useThemeConstants(); // Use theme constants

  const tags = [
    "portrait",
    "wedding",
    "nature",
    "family",
    "event",
    "fashion",
    "travel",
    "street",
    "architecture",
    "macro",
  ];

  return (
    <div className={`min-h-screen ${bgColor} pt-14`}>
      <main className={`container mx-auto px-16 py-8`}>
        {/* Photography Grid Layout */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          {/* First row */}
          <div className="col-span-12 md:col-span-4">
            <img
              src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
              alt="Photography 1"
              className="w-full h-[250px] md:h-[200px] object-cover rounded-lg"
            />
          </div>
          <div className="col-span-12 md:col-span-8">
            <img
              src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
              alt="Photography 2"
              className="w-full h-[250px] md:h-[200px] object-cover rounded-lg"
            />
          </div>

          {/* Second row */}
          <div className="col-span-12 md:col-span-6">
            <img
              src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
              alt="Photography 3"
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="col-span-1">
                <img
                  src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
                  alt="Photography 4"
                  className="w-full h-[140px] md:h-[140px] object-cover rounded-lg"
                />
              </div>
              <div className="col-span-1">
                <img
                  src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
                  alt="Photography 5"
                  className="w-full h-[140px] md:h-[140px] object-cover rounded-lg"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <img
                  src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
                  alt="Photography 6"
                  className="w-full h-[140px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Third row */}
          <div className="col-span-12 md:col-span-8">
            <img
              src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
              alt="Photography 7"
              className="w-full h-[250px] object-cover rounded-lg"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <img
              src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740628126/samrat-khadka-93wlS7VA_jg-unsplash_nynmsw.jpg"
              alt="Photography 8"
              className="w-full h-[250px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="text-center space-y-4">
          <p className={textColor}>
            And thousands more of splendid{" "}
            <a href="/photos" className="text-[#157efb] hover:underline">
              photos
            </a>{" "}
            by topics:
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <Badge
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-[#1a1a23] hover:bg-[#2a2a33]"
                  : "bg-[#e5e7eb] hover:bg-[#cdc4bc]"
              } ${textColor}`}
            >
              #frozen
            </Badge>
            <Badge
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-[#1a1a23] hover:bg-[#2a2a33]"
                  : "bg-[#e5e7eb] hover:bg-[#cdc4bc]"
              } ${textColor}`}
            >
              #detail
            </Badge>
            <Badge
              variant="secondary"
              className={`${
                isDarkMode
                  ? "bg-[#1a1a23] hover:bg-[#2a2a33]"
                  : "bg-[#e5e7eb] hover:bg-[#cdc4bc]"
              } ${textColor}`}
            >
              #eyelash
            </Badge>
            {tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className={`${
                  isDarkMode
                    ? "bg-[#1a1a23] hover:bg-[#2a2a33]"
                    : "bg-[#e5e7eb] hover:bg-[#cdc4bc]"
                } ${textColor}`}
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className={`flex items-center gap-2 transition-colors duration-200 p-1.5 rounded ${
                isDarkMode
                  ? "bg-[#1a1a23] hover:bg-[#2a2a33]"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <Search className={`h-5 w-5 ${textColor}`} />
              <p className={`${textColor} text-sm`}>Search by tags</p>
            </button>
          </div>
        </div>

        {/* Photography Categories Section */}
        <div className={`my-16 py-8 `}>
          <h2
            className={`text-3xl font-light text-center ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            } mb-10`}
          >
            Photography Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                  <span className="text-white text-xl font-medium p-4">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="my-16 py-12">
          <h2
            className={`text-3xl font-light text-center ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            } mb-16`}
          >
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`${
                    isDarkMode ? "bg-[#1a1a23]" : "bg-gray-100"
                  } rounded-full p-5 mb-4 w-16 h-16 flex items-center justify-center`}
                >
                  {step.icon}
                </div>
                <h3
                  className={`text-xl font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  } mb-2`}
                >
                  {step.title}
                </h3>
                <p className={`${textColor} text-sm`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
