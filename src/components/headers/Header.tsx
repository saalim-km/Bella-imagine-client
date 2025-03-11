import { Button } from "@/components/ui/button";
import Logo from "../common/Logo";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logoutClient } from "@/services/auth/authService";
import { logoutVendor } from "@/services/auth/authService";
import { toast } from "sonner";
import { clientLogout } from "@/store/slices/clientSlice";
import { useLogoutMutation } from "@/hooks/auth/useLogout";



import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // Use Shadcn/UI imports
import { useDispatch } from "react-redux";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { vendorLogout } from "@/store/slices/vendorSlice";

interface IHeader {
  onClick?: () => void;
  logout ?: ()=> void;
}


export default function Header({ onClick }: IHeader) {
  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, textColor } = useThemeConstants();

  const hoverTextColor = isDarkMode ? "hover:text-gray-300" : "hover:text-black";
  const isLoggedIn = !!user;

  // Determine logout function dynamically based on role
  const logoutFunction = user?.role === "vendor" ? logoutVendor : logoutClient;
  const { mutate: logout } = useLogoutMutation(logoutFunction);

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: (data: any) => {
        console.log(data);
        toast.success(data.message);
        if (user?.role === "vendor") {
          dispatch(vendorLogout());
        } else {
          dispatch(clientLogout());
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <header className="flex justify-between items-center sm:px-6 sm:py-2 sm:mx-28 md:mx-0 lg:mx-32 lg:py-2">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Logo />
        <span className={`text-sm sm:text-lg font-semibold ${textColor}`}>Bella Imagine</span>
      </div>

      {/* Navigation */}
      {location.pathname !== "/admin/login" && (
        <nav className={`hidden sm:flex space-x-4 sm:space-x-6 ${textColor}`}>
          <a onClick={() => navigate("/")} className={`${hoverTextColor} hover:cursor-pointer`}>
        Home
          </a>
          <a onClick={() => navigate("/vendors")} className={`${hoverTextColor} hover:cursor-pointer`}>
        Photographers
          </a>
        </nav>
      )}

      {/* Sign Up Button & Theme Toggle */}
      <div className="flex flex-row gap-2 items-center">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="px-2 py-1 sm:px-4 sm:py-2 rounded-md">{user.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 sm:w-56">
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem>Messages</DropdownMenuItem>
              <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          location.pathname !== "/register" &&
          location.pathname !== "/login" &&
          location.pathname !== "/admin/login" && (
            <Button className="px-2 py-1 sm:px-4 sm:py-2 rounded-md" onClick={() => onClick?.()}>
              Sign Up
            </Button>
          )
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
