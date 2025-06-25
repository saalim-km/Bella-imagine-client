import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { useThemeConstants } from "@/utils/theme/theme.utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountTypeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { bgColor, textColor, buttonPrimary, buttonSecondary } = useThemeConstants();

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`p-6 rounded-2xl shadow-lg max-w-sm w-full relative flex flex-col items-center text-center ${bgColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
        >
          <X size={20} onClick={onClose} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">Bella Imagine</h2>

        {/* Subtitle */}
        <p className={`mb-4 text-sm ${textColor}`}>Select the account type</p>

        {/* Buttons */}
        <button
          onClick={() => navigate("/signup")}
          className={`w-full py-3 rounded-lg mb-2 text-lg font-medium transition bg-secondary text-foreground`}
        >
          User
        </button>
        <button
          className={`w-full py-3 rounded-lg text-lg font-medium transition bg-primary`}
          onClick={() => navigate('/vendor/signup')}
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
      </div>
    </div>
  );
};

export default AccountTypeModal;
