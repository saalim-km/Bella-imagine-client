import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Star, Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneNumberModal from "../modals/PhoneNumberModal";

export default function VendorDetails() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const buttonPrimary = isDarkMode
    ? "bg-gray-800 hover:bg-gray-700"
    : "bg-[#8B5A2B] hover:bg-[#704832]";
  const buttonSecondary = isDarkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-800 hover:bg-gray-700";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  const [selectedCategory, setSelectedCategory] = useState("Wedding");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pricing = {
    Wedding: [
      { total: "12 000 INR INR . 2 hour", hourly: "6 000 INR / hour" },
      { total: "60 000 INR INR . 6 hour", hourly: "10 000 INR / hour" },
      { total: "100 000 INR INR . 10 hour", hourly: "10 000 INR / hour" },
    ],
    Couples: [
      { total: "10 000 INR INR . 2 hour", hourly: "5 000 INR / hour" },
      { total: "50 000 INR INR . 6 hour", hourly: "8 333 INR / hour" },
      { total: "80 000 INR INR . 10 hour", hourly: "8 000 INR / hour" },
    ],
    Portrait: [
      { total: "8 000 INR INR . 2 hour", hourly: "4 000 INR / hour" },
      { total: "40 000 INR INR . 6 hour", hourly: "6 667 INR / hour" },
      { total: "60 000 INR INR . 10 hour", hourly: "6 000 INR / hour" },
    ],
    Family: [
      { total: "15 000 INR INR . 2 hour", hourly: "7 500 INR / hour" },
      { total: "75 000 INR INR . 6 hour", hourly: "12 500 INR / hour" },
      { total: "120 000 INR INR . 10 hour", hourly: "12 000 INR / hour" },
    ],
  };

  const portfolioImages = Array(16).fill(
    "https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719962/unnamed_1_wkcshf.png"
  );
  const imagesPerPage = 8;
  const totalPages = Math.ceil(portfolioImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = portfolioImages.slice(
    startIndex,
    startIndex + imagesPerPage
  );

  function handleOnClick() {
    setIsModalOpen(true)
  }

  function handleOnClose() {
    setIsModalOpen((prevState)=> !prevState)
  }
  return (
    <div className={`p-6 max-w-5xl mx-auto ${bgColor}`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-start space-x-4">
          <img
            src="https://res.cloudinary.com/deh2nuqeb/image/upload/v1740719880/unnamed_fwjzvp.png"
            alt="Photographer"
            className="w-28 h-28 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Photographer Salim K M</h2>
            </div>
            <p className={textColor}>Kochi, India</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">4.9 (120 reviews)</span>
            </div>
            <p className={`${textColor} text-sm mt-1`}>
              Documenting exclusive weddings around the world through the
              cinematic, elegant and timeless photographs. As seen in VOGUE,
              Elle & Vanity Fair.
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <p className={textColor}>. Less than a week on Bella Imagine</p>
              <p className={textColor}>
                . I can speak Malayalam, English, Tamil, Hindi
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-auto mt-4 md:mt-0">
          <Button
            className={`${buttonPrimary} text-white text-sm rounded-md w-full py-6 font-semibold`}
          >
            Book Slot
          </Button>
          <Button
            className={`${buttonSecondary} text-white text-sm rounded-md w-full py-6 font-semibold`}
          >
            Send message
          </Button>
          <Button
            variant="outline"
            className={`${borderColor} ${textColor} flex items-center justify-center gap-2 w-full py-6 rounded-md font-semibold`}
            onClick={() => setIsModalOpen(true)}
          >
            <Phone className="w-4 h-4" />
            <span>Show the number</span>
          </Button>
        </div>

      </div>

      {/* Pricing Section */}
      <div className="mb-16 mt-10">
        <div className="flex justify-center space-x-2 mb-4">
          {["Wedding", "Couples", "Portrait", "Family"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-black text-white border-black dark:bg-gray-700 dark:border-gray-700"
                  : `${borderColor} ${textColor} hover:bg-gray-100 dark:hover:bg-gray-800`
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center space-x-4"
          >
            {pricing[selectedCategory as keyof typeof pricing].map(
              (price, index) => (
                <div key={index} className="flex-1 text-center max-w-[150px]">
                  <p className="font-semibold text-sm">{price.total}</p>
                  <p className={`${textColor} text-xs`}>{price.hourly}</p>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Portfolio Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {currentImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Portfolio ${startIndex + index + 1}`}
            className="w-full h-auto object-cover rounded-md"
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          className={`${borderColor} ${textColor} px-3 py-1.5 text-sm rounded-md`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className={`px-4 py-2 ${textColor} text-sm`}>
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          className={`${borderColor} ${textColor} px-3 py-1.5 text-sm rounded-md`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>


      <PhoneNumberModal isModalOpen = {isModalOpen} onClose={handleOnClose} onClick = {handleOnClick}/>
    </div>
  );
}
