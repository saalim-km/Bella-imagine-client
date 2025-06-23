"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Menu, X, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import NotificationCard from "./Notification";
import { useLogoutMutation } from "@/hooks/auth/useLogout";
import { logoutClient, logoutVendor } from "@/services/auth/authService";
import { clientLogout } from "@/store/slices/clientSlice";
import { vendorLogout } from "@/store/slices/vendorSlice";
import type { RootState } from "@/store/store";
import { useSocket } from "@/context/SocketContext";
import { handleError } from "@/utils/Error/error-handler.utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useGetAllNotifications } from "@/hooks/notifications/useNotifications";
import { getAllClientNotification, getAllVendorNotification } from "@/services/notification/notificationService";
import { TRole } from "@/types/interfaces/User";
import { setNotifications, setPage } from "@/store/slices/notificationSlice";

interface IHeader {
  onClick?: () => void;
}

export default function Header({ onClick }: IHeader) {
  const { socket } = useSocket();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });
  const { page, total, unReadCount } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user;
  const isAdminPage = location.pathname.startsWith("/admin");

  const queryFn = user?.role === "vendor" ? getAllVendorNotification : getAllClientNotification;
  const limit = 6;
  const { data: notificationsData, isLoading } = useGetAllNotifications(
    queryFn,
    user?.role as TRole,
    isLoggedIn,
    { limit: page * limit, page: page }
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (notificationsData?.data?.data) {
      dispatch(setNotifications({
        notifications: notificationsData.data.data,
        total: notificationsData.data.total || 0,
        page: page,
        unReadCount: notificationsData.data.unReadTotal
      }));
    }
  }, [notificationsData, dispatch, page]);

  const logoutFunction = user?.role === "vendor" ? logoutVendor : logoutClient;
  const { mutate: logout } = useLogoutMutation(logoutFunction);

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: (data: any) => {
        toast.success(data.message);
        if (user?.role === "vendor") {
          dispatch(vendorLogout());
          if (socket) socket.disconnect();
        } else {
          dispatch(clientLogout());
          if (socket) socket.disconnect();
        }
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
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
        className={`px-2 py-1 text-sm font-medium rounded-md ${
          active ? "text-blue-500 dark:text-blue-400" : ""
        }`}
      >
        {children}
      </a>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center h-12 justify-between">
            {/* Left section - Logo and navigation */}
            <div className="flex items-center space-x-4">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                className="flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">BI</span>
                </div>
              </a>

              {location.pathname !== "/admin/login" && (
                <nav className="hidden md:flex items-center space-x-1">
                  <NavLink to="/home">Home</NavLink>
                  <NavLink to="/photographers">Photographers</NavLink>
                  <NavLink to="/explore">Community</NavLink>
                </nav>
              )}
            </div>

            {/* Right section - User controls */}
            <div className="flex items-center space-x-2">
              {isLoggedIn && (
                <>
                  <button 
                    className="p-1 rounded-md"
                    onClick={() => navigate("/community/submit")}
                  >
                    <Plus className="h-5 w-5" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 rounded-md relative"
                        aria-label={`Notifications (${total} new)`}
                      >
                        <Bell className="h-5 w-5" />
                        {unReadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {unReadCount}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <NotificationCard
                      userType={user.role as TRole}
                      page={page}
                      setPage={(newPage) => dispatch(setPage(newPage))}
                      totalNotifications={total}
                      limit={limit}
                      isLoading={isLoading}
                    />
                  </DropdownMenu>
                </>
              )}

              {isLoggedIn && !isAdminPage ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar}
                          alt={`${user.name}`}
                          className="object-cover w-full h-full rounded-full" // Fixed: Added object-cover and full dimensions
                        />
                        <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer"
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="cursor-pointer"
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/messages")}
                      className="cursor-pointer"
                    >
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logoutUser}
                      className="cursor-pointer text-red-500"
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
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    Sign Up
                  </button>
                )
              )}

              <ThemeToggle />

              <button
                className="md:hidden p-1 rounded-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {mobileMenuOpen && (
          <div className="md:hidden p-2 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search BellaImagine"
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 dark:bg-gray-900 md:hidden mt-14">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/photographers", label: "Photographers" },
                { to: "/explore", label: "Community" },
                ...(isLoggedIn ? [
                  { to: "/create-post", label: "Create Post" },
                  { to: "/profile", label: "Profile" },
                  { to: "/settings", label: "Settings" },
                  { to: "/messages", label: "Messages" },
                ] : []),
              ].map((item) => (
                <NavLink 
                  key={item.label} 
                  to={item.to} 
                  active={location.pathname === item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {!isLoggedIn && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    onClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}

            {isLoggedIn && (
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="mt-4 w-full text-left px-2 py-1 text-sm font-medium text-red-500 rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}