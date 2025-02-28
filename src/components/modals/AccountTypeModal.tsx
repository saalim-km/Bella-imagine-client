import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Logo from "../Logo";
import { useNavigate } from "react-router";
import { useTheme } from "@/context/ThemeContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountTypeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get current theme

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Dynamic styles based on theme
  const isDarkMode = theme === "dark";
  const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const buttonPrimary = isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-900 hover:bg-gray-800";
  const buttonSecondary = isDarkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-[#85786F] hover:bg-[#6d645c]";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking outside modal
        >
          <motion.div
            className={`p-6 rounded-2xl shadow-lg max-w-sm w-full relative flex flex-col items-center text-center border ${borderColor} ${bgColor}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <div className="mb-4">
              <Logo />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-2">Bella Imagine</h2>

            {/* Subtitle */}
            <p className={`mb-4 text-sm ${textColor}`}>Select the account type</p>

            {/* Buttons */}
            <button
              onClick={() => navigate("/register")}
              className={`w-full py-3 rounded-lg mb-2 text-lg font-medium transition ${buttonPrimary} text-white`}
            >
              Customer
            </button>
            <button
              className={`w-full py-3 rounded-lg text-lg font-medium transition ${buttonSecondary} text-white`}
            >
              Photographer
            </button>

            {/* Terms and Conditions */}
            <p className={`text-xs mt-4 ${textColor}`}>
              By creating an account, you confirm that you accept the{" "}
              <a href="#" className="text-blue-500 underline">
                website rules
              </a>{" "}
              and the{" "}
              <a href="#" className="text-blue-500 underline">
                privacy policy
              </a>.
            </p>

            {/* Sign-in link */}
            <p className={`text-sm mt-4 ${textColor}`}>
              Already have an account?{" "}
              <a onClick={() => navigate("/login")} className="text-blue-500 underline hover:cursor-pointer">
                Sign in.
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountTypeModal;