import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
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
import { useSocket } from "@/context/SocketContext";
import { handleError } from "@/utils/Error/errorHandler";

interface IHeader {
  onClick?: () => void;
}

export default function Header({ onClick }: IHeader) {
  const { reconnect, socket } = useSocket();
  const { textColor, isDarkMode } = useThemeConstants();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });
  const { data: vendorNot } = useAllVendortNotification(
    user?.role === "vendor"
  );
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

  const isCommunityActive =
    location.pathname === "/community" || location.pathname === "/contests";

  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const logoutFunction = user?.role === "vendor" ? logoutVendor : logoutClient;
  const { mutate: logout } = useLogoutMutation(logoutFunction);

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: (data: any) => {
        toast.success(data.message);
        if (user?.role === "vendor") {
          dispatch(vendorLogout());
          if (socket) {
            socket.disconnect();
          }
        } else {
          dispatch(clientLogout());
          if (socket) {
            socket.disconnect();
          }
        }
      },
      onError: (error) => {
        handleError(error)
      },
    });
  };

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
      <a
        href={to}
        onClick={(e) => {
          e.preventDefault();
          navigate(to);
          setMobileMenuOpen(false);
        }}
        className={`relative text-base font-semibold ${textColor} cursor-pointer transition-colors px-3 py-1.5 rounded-md ${
          active
            ? "bg-gray-200/50 dark:bg-gray-700/50"
            : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
        }`}
        aria-current={active ? "page" : undefined}
      >
        {children}
        {active && (
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full" />
        )}
      </a>
    );
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-2 transition-all duration-300 backdrop-blur-3xl`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 hover:cursor-pointer transition-opacity hover:opacity-80"
        >
          <Logo />
          <span
            className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              isDarkMode ? "from-white to-gray-400" : "from-black to-gray-600"
            }`}
          >
          </span>
        </div>

        {location.pathname !== "/admin/login" && (
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/home" active={location.pathname === "/home"}>
              Home
            </NavLink>
            <NavLink to="/vendors" active={location.pathname === "/vendors"}>
              Photographers
            </NavLink>
            <NavLink to="/community" active={isCommunityActive}>
              Community
            </NavLink>
          </nav>
        )}

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

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn && !isAdminPage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative p-2 rounded-full hover:bg-gray-200/30 text-black dark:text-white transition-colors"
                  aria-label={`Notifications (${allNotifications.length} new)`}
                >
                  <Bell className="h-5 w-5" />
                  {allNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {allNotifications.length}
                    </span>
                  )}
                </button>
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
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 text-base font-medium text-black dark:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
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
                <DropdownMenuItem
                  className="text-base py-2"
                  onClick={() => navigate("/messages")}
                >
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
              <button
                onClick={() => onClick?.()}
                className="px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-base font-medium"
              >
                Sign Up
              </button>
            )
          )}

          <ThemeToggle />
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden shadow-lg bg-white dark:bg-neutral-900">
          <div className="flex flex-col p-4 space-y-4">
            <NavLink to="/" active={location.pathname === "/"}>
              Home
            </NavLink>
            <NavLink to="/vendors" active={location.pathname === "/vendors"}>
              Photographers
            </NavLink>
            {isLoggedIn && !isAdminPage && (
              <>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/settings">Settings</NavLink>
                <NavLink to="/messages">Messages</NavLink>
                <button
                  onClick={logoutUser}
                  className="text-left text-red-600 font-semibold px-3 py-1.5"
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
                  className="px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-base font-medium"
                >
                  Sign Up
                </button>
              )}
          </div>
        </nav>
      )}
    </motion.header>
  );
}
