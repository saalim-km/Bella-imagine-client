
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu"
import Logo from "../common/Logo"
import ThemeToggle from "../common/ThemeToggle"
import NotificationCard, { TNotification } from "../common/Notification"
import { useThemeConstants } from "@/utils/theme/themeUtills"
import { useLogoutMutation } from "@/hooks/auth/useLogout"
import { logoutClient, logoutVendor } from "@/services/auth/authService"
import { clientLogout } from "@/store/slices/clientSlice"
import { vendorLogout } from "@/store/slices/vendorSlice"
import { useAllVendortNotification } from "@/hooks/vendor/useVendor"
import { useAllClientNotification } from "@/hooks/client/useClient"
import type { RootState } from "@/store/store"

interface IHeader {
  onClick?: () => void
  logout?: () => void
}

export default function Header({ onClick }: IHeader) {
  const { textColor , isDarkMode } = useThemeConstants()
  const [scrolled, setScrolled] = useState(false)
  
  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor
    if (state.client.client) return state.client.client
    return null
  })

  const { data: vendorNot } = useAllVendortNotification(user?.role === "vendor")
  const { data: clientNot } = useAllClientNotification(user?.role === "client")
  
  const allNotifications: TNotification[] = user?.role === "vendor" 
    ? vendorNot?.notifications ?? [] 
    : clientNot?.notifications ?? []

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = !!user


  const isAdminPage = location.pathname.startsWith("/admin")
  // Add scroll effect similar to NavBar
  useState(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  // Determine logout function dynamically based on role
  const logoutFunction = user?.role === "vendor" ? logoutVendor : logoutClient
  const { mutate: logout } = useLogoutMutation(logoutFunction)

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: (data: any) => {
        toast.success(data.message)
        if (user?.role === "vendor") {
          dispatch(vendorLogout())
        } else {
          dispatch(clientLogout())
        }
      },
      onError: (error) => {
        console.log(error)
      },
    })
  }

  const NavLink = ({ children, onClick, active = false }: { 
    children: React.ReactNode; 
    onClick: () => void;
    active?: boolean;
  }) => {
    return (
      <motion.a
        onClick={onClick}
        className={`relative text-sm font-medium ${textColor}  cursor-pointer transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
        <motion.span
          className={`absolute -bottom-1 left-0 w-0 h-[2px]  rounded-full`}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.2 }}
        />
      </motion.a>
    );
  };

  return (
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          scrolled ? 'glass-effect backdrop-blur-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", overflowX: "hidden" }} // Prevent unwanted shifts
      >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
        onClick={()=> navigate('/')}
          className="flex items-center space-x-2 hover:cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Logo />
          <span className={`text-sm sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400`}>
        Bella Imagine
          </span>
        </motion.div>

        {/* Navigation */}
        {location.pathname !== "/admin/login" && (
          <div className={`hidden md:flex items-center space-x-8 `}>
        <NavLink onClick={() => navigate("/")}>
          Home
        </NavLink>
        <NavLink onClick={() => navigate("/vendors")}>
          Photographers
        </NavLink>
        {/* Add more nav links as needed */}
          </div>
        )}

        {/* Actions section */}
        <div className="flex items-center space-x-4">
        {isLoggedIn && !isAdminPage && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="p-2 rounded-full hover:bg-gray-200/20 transition-colors relative"
              whileHover={{ scale: 1.08 }}
            >
              <Bell className="h-5 w-5" />
              {allNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {allNotifications.length}
                </span>
              )}
            </motion.button>
          </DropdownMenuTrigger>
          <NotificationCard 
            notificationCount={allNotifications.length} 
            notifications={allNotifications || []}
          />
          </DropdownMenu>
        )}

          {isLoggedIn && !isAdminPage ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
          className="px-5 py-2 rounded-md glass-effect hover:bg-white/10 transition-all text-sm font-medium"
          whileHover={{ scale: 1.03 }}
            >
          {user.name}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
          <motion.button
            onClick={() => onClick?.()}
            className="px-5 py-2 rounded-md glass-effect hover:bg-white/10 transition-all text-sm font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Sign Up
          </motion.button>
        )
          )}
          
          <ThemeToggle />
        </div>
      </div>
        </motion.header>
  )
}