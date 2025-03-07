import { Button } from "@/components/ui/button";
import Logo from "../common/Logo";
import { useLocation, useNavigate } from "react-router";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

interface IHeader {
  onClick?: () => void;
}

export default function Header({ onClick }: IHeader) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme(); // Get current theme

  // Dynamic styles based on theme
  const isDarkMode = theme === "dark";
  const textColor = isDarkMode ? "text-white" : "text-gray-600";
  const hoverTextColor = isDarkMode ? "hover:text-gray-300" : "hover:text-black";

  return (
    <header className={`flex justify-between items-center px-6 py-4`}>
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Logo />
        <span className={`text-lg font-semibold ${textColor}`}>Bella Imagine</span>
      </div>

      {/* Navigation */}
      <nav className={`hidden md:flex space-x-6 ${textColor}`}>
        <a onClick={() => navigate("/")} className={`${hoverTextColor} hover:cursor-pointer`}>
          Home
        </a>
        <a onClick={() => navigate("/about")} className={`${hoverTextColor} hover:cursor-pointer`}>
          About
        </a>
        <a onClick={() => navigate("/vendors")} className={`${hoverTextColor} hover:cursor-pointer`}>
          Photographers
        </a>
        <a onClick={() => navigate("/contact")} className={`${hoverTextColor} hover:cursor-pointer`}>
          Contact
        </a>
      </nav>

      {/* Sign Up Button & Theme Toggle */}
      <div className="flex flex-row gap-2">
        {location.pathname !== "/register" && location.pathname !== "/login" && (
          <Button className={`px-4 py-2 rounded-md `} onClick={() => onClick?.()}>
            Sign Up
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
