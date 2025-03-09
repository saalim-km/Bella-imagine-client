import { Button } from "@/components/ui/button";
import Logo from "../common/Logo";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logoutClient } from "@/services/auth/authService";
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

interface IHeader {
  onClick?: () => void;
  logout ?: ()=> void;
}


export default function Header({ onClick  }: IHeader) {
  const dispatch = useDispatch()
  const {mutate : logout} = useLogoutMutation(logoutClient)

  const logoutUser = ()=> {
    logout(undefined,{
      onSuccess : (data : any)=> {
        console.log(data);
        toast.success(data.message)
        dispatch(clientLogout())
      },
      onError : (error)=> {
        console.log(error);
      }
    })
  }



  const client = useSelector((state: RootState) => state.client.client);
  const navigate = useNavigate();
  const location = useLocation();
  const {isDarkMode , textColor } = useThemeConstants()

  // Dynamic styles based on theme
  const hoverTextColor = isDarkMode ? "hover:text-gray-300" : "hover:text-black";

  const isLoggedIn = !!client; // Assuming client is null or undefined when not logged in

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
      <div className="flex flex-row gap-2 items-center">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={`px-4 py-2 rounded-md`}>
                {client.name} {/* Assuming client has a name property */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem >Messages</DropdownMenuItem>
              <DropdownMenuItem className="bg-red-500" onClick={logoutUser}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          location.pathname !== "/register" &&
          location.pathname !== "/login" && (
            <Button className={`px-4 py-2 rounded-md`} onClick={() => onClick?.()}>
              Sign Up
            </Button>
          )
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}