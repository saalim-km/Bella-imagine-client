import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; 
import Logo from "../Logo";
import { useNavigate } from "react-router";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountTypeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
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
            className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full relative flex flex-col items-center text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Icon at the top */}
            <div className="mb-4">
              <Logo/> {/* Replace with actual icon path */}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-2">Bella Imagine</h2>

            {/* Subtitle */}
            <p className="text-gray-600 mb-4 text-sm">
              Select the account type
            </p>

            {/* Buttons */}
            <button onClick={()=> navigate("/register")} className="w-full py-3 bg-[#2F2E2E] text-white rounded-lg mb-2 text-lg font-medium">
              Customer
            </button>
            <button className="w-full py-3 bg-[#85786F] text-white rounded-lg text-lg font-medium">
              Photographer
            </button>

            {/* Terms and conditions */}
            <p className="text-gray-500 text-xs mt-4">
              By creating an account, you confirm that you accept the{" "}
              <a href="#" className="text-blue-500 underline">
                website rule
              </a>{" "}
              and the{" "}
              <a href="#" className="text-blue-500 underline">
                privacy policy
              </a>.
            </p>

            {/* Sign-in link */}
            <p className="text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <a onClick={()=> navigate("/login")} className="text-blue-500 underline hover:cursor-pointer">Sign in.</a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountTypeModal;
