import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, X } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import NotificationCard, { TNotification } from "../common/Notification";
import { useThemeConstants } from "@/utils/theme/themeUtills";
import { useLogoutMutation } from "@/hooks/auth/useLogout";
import { logoutClient, logoutVendor } from "@/services/auth/authService";
import { clientLogout } from "@/store/slices/clientSlice";
import { vendorLogout } from "@/store/slices/vendorSlice";
import { useAllVendortNotification } from "@/hooks/vendor/useVendor";
import { useAllClientNotification } from "@/hooks/client/useClient";
import type { RootState } from "@/store/store";

interface IHeader {
  onClick?: () => void;
}

export default function Header({ onClick }: IHeader) {
  const { textColor, isDarkMode } = useThemeConstants();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });

  const { data: vendorNot } = useAllVendortNotification(user?.role === "vendor");
  const { data: clientNot } = useAllClientNotification(user?.role === "client");

  const allNotifications: TNotification[] = useMemo(
    () =>
      user?.role === "vendor"
        ? vendorNot?.notifications ?? []
        : clientNot?.notifications ?? [],
    [vendorNot, clientNot, user?.role]
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user;
  const isAdminPage = location.pathname.startsWith("/admin");

  // Scroll effect
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  // Logout logic
  const logoutFunction = user?.role === "vendor" ? logoutVendor : logoutClient;
  const { mutate: logout } = useLogoutMutation(logoutFunction);

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: (data: any) => {
        toast.success(data.message);
        if (user?.role === "vendor") {
          dispatch(vendorLogout());
        } else {
          dispatch(clientLogout());
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  // Navigation link component
  const NavLink = ({
    children,
    to,
    active = false,
  }: {
    children: React.ReactNode;
    to: string;
    active?: boolean;
  }) => {
    return (
      <motion.a
        href={to}
        onClick={(e) => {
          e.preventDefault();
          navigate(to);
          setMobileMenuOpen(false);
        }}
        className={`relative text-base font-semibold ${textColor} cursor-pointer transition-colors px-3 py-2 rounded-md ${
          active ? "bg-gray-200/50 dark:bg-gray-700/50" : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-current={active ? "page" : undefined}
      >
        {children}
        {active && (
          <motion.span
            className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full"
            layoutId="underline"
          />
        )}
      </motion.a>
    );
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 hover:cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Logo />
          <span
            className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              isDarkMode
                ? "from-white to-gray-400"
                : "from-black to-gray-600"
            }`}
          >
            Bella Imagine
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        {location.pathname !== "/admin/login" && (
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={location.pathname === "/"}>Home</NavLink>
            <NavLink to="/vendors" active={location.pathname === "/vendors"}>
              Photographers
            </NavLink>
          </nav>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-200/20"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Actions Section (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn && !isAdminPage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="relative p-2 rounded-full hover:bg-gray-200/30 text-black dark:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Notifications (${allNotifications.length} new)`}
                >
                  <Bell className="h-5 w-5" />
                  {allNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {allNotifications.length}
                    </span>
                  )}
                </motion.button>
              </DropdownMenuTrigger>
              <NotificationCard
                notificationCount={allNotifications.length}
                notifications={allNotifications}
              />
            </DropdownMenu>
          )}

          {isLoggedIn && !isAdminPage ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="px-4 py-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 text-base font-medium text-black dark:text-white transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {user.name}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="text-base py-2"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="text-base py-2"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base py-2">
                  Messages
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logoutUser}
                  className="text-base py-2 text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            location.pathname !== "/register" &&
            location.pathname !== "/login" &&
            location.pathname !== "/admin/login" && (
              <motion.button
                onClick={() => onClick?.()}
                className="px-5 py-2 rounded-lg transition-colors text-base font-medium"
                whileHover={{ scale: 1.03 }}
              >
                Sign Up
              </motion.button>
            )
          )}

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="md:hidden shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col p-4 space-y-4">
              <NavLink to="/" active={location.pathname === "/"}>Home</NavLink>
              <NavLink to="/vendors" active={location.pathname === "/vendors"}>
                Photographers
              </NavLink>
              {isLoggedIn && !isAdminPage && (
                <>
                  <NavLink to="/profile">Profile</NavLink>
                  <NavLink to="/settings">Settings</NavLink>
                  <NavLink to="#">Messages</NavLink>
                  <button
                    onClick={logoutUser}
                    className="text-left text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isLoggedIn &&
                location.pathname !== "/register" &&
                location.pathname !== "/login" &&
                location.pathname !== "/admin/login" && (
                  <button
                    onClick={() => {
                      onClick?.();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg  text-base font-medium"
                  >
                    Sign Up
                  </button>
                )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}