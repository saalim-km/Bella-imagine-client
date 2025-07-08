"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Menu, X, Plus } from "lucide-react";
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
import { useSocket } from "@/hooks/socket/useSocket";
import { handleError } from "@/utils/Error/error-handler.utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useGetAllNotifications } from "@/hooks/notifications/useNotifications";
import {
  getAllClientNotification,
  getAllVendorNotification,
} from "@/services/notification/notificationService";
import { TRole } from "@/types/interfaces/User";
import { setNotifications, setPage } from "@/store/slices/notificationSlice";
import { communityToast } from "../ui/community-toast";

interface IHeader {
  onClick?: () => void;
  isAuthPage?: boolean;
}

export default function Header({ onClick, isAuthPage = false }: IHeader) {
  const { socket } = useSocket();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });

  const { page, total, unReadCount, notifications } = useSelector(
    (state: RootState) => state.notification
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!user;
  const isAdminPage = location.pathname.startsWith("/admin");

  const queryFn =
    user?.role === "vendor"
      ? getAllVendorNotification
      : getAllClientNotification;
  const limit = 6;

  const { data: notificationsData, isLoading } = useGetAllNotifications(
    queryFn,
    user?.role as TRole,
    isLoggedIn,
    { limit: limit, page: page }
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fixed useEffect for handling notifications
  useEffect(() => {
    if (notificationsData?.data?.data) {
      const newNotifications = notificationsData.data.data;

      // For page 1, replace all notifications (fresh start)
      if (page === 1) {
        dispatch(
          setNotifications({
            notifications: newNotifications,
            total: notificationsData.data.total || 0,
            page: page,
            unReadCount: notificationsData.data.unReadTotal || 0,
          })
        );
      } else {
        // For subsequent pages, only append if we don't already have these notifications
        const existingIds = new Set(notifications.map((n) => n._id));
        const uniqueNewNotifications = newNotifications.filter(
          (notification: any) => !existingIds.has(notification._id)
        );

        if (uniqueNewNotifications.length > 0) {
          dispatch(
            setNotifications({
              notifications: [...notifications, ...uniqueNewNotifications],
              total: notificationsData.data.total || 0,
              page: page,
              unReadCount: notificationsData.data.unReadTotal || 0,
            })
          );
        } else {
          // Just update counts without adding duplicates
          dispatch(
            setNotifications({
              notifications: notifications,
              total: notificationsData.data.total || 0,
              page: page,
              unReadCount: notificationsData.data.unReadTotal || 0,
            })
          );
        }
      }
    }
  }, [notificationsData, dispatch, page]); // Removed notifications from dependencies to prevent infinite loop

  const logoutFunction = user?.role === "vendor" ? logoutVendor : logoutClient;
  const { mutate: logout } = useLogoutMutation(logoutFunction);

  const logoutUser = () => {
    logout(undefined, {
      onSuccess: () => {
        communityToast.logout();

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
          active
            ? "text-orange-500 dark:text-orange-400"
            : "hover:text-orange-500 dark:hover:text-orange-400"
        }`}
      >
        {children}
      </a>
    );
  };

  const shouldShowAuthButton = !isLoggedIn && !isAuthPage && !isAdminPage;

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-background ${
          scrolled
            ? "shadow-sm border-b border-border"
            : "border-b border-border"
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

              {!isAuthPage && !isAdminPage && isLoggedIn && (
                <nav className="hidden md:flex items-center space-x-1">
                  <NavLink to="/home" active={location.pathname === "/home"}>
                    Home
                  </NavLink>
                  <NavLink
                    to="/photographers"
                    active={location.pathname.startsWith("/photographers")}
                  >
                    Photographers
                  </NavLink>
                  <NavLink
                    to="/explore"
                    active={location.pathname.startsWith("/explore")}
                  >
                    Community
                  </NavLink>
                </nav>
              )}
            </div>

            {/* Right section - User controls */}
            <div className="flex items-center space-x-2">
              {isLoggedIn && !isAuthPage && (
                <>
                  <button
                    className="p-1 rounded-md flex flex-row items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => navigate("/community/submit")}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:inline">Create</span>
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 rounded-md relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={`Notifications (${unReadCount} new)`}
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
                      unReadCount={unReadCount}
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

              {isLoggedIn && !isAdminPage && !isAuthPage ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 transition-colors">
                      <div className="relative h-8 w-8">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar}
                            alt={`${user.name}`}
                            className="object-cover w-full h-full rounded-full"
                          />
                          <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {unReadCount > 0 && (
                          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                        )}
                      </div>
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
              ) : shouldShowAuthButton ? (
                <button
                  onClick={() => onClick?.()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  Sign Up
                </button>
              ) : null}

              <ThemeToggle />

              <button
                className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 dark:bg-background md:hidden mt-20 bg-background">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              {[
                { to: "/", label: "Home" },
                ...(isLoggedIn && !isAuthPage
                  ? [
                      { to: "/photographers", label: "Photographers" },
                      { to: "/explore", label: "Community" },
                      { to: "/community/submit", label: "Create Post" },
                      { to: "/profile", label: "Profile" },
                      { to: "/settings", label: "Settings" },
                      { to: "/messages", label: "Messages" },
                    ]
                  : []),
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

            {shouldShowAuthButton && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    onClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
                className="mt-4 w-full text-left px-2 py-1 text-sm font-medium text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
