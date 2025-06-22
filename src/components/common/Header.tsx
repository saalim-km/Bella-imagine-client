import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Menu, X } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import NotificationCard from "./Notification";
import { useThemeConstants } from "@/utils/theme/theme.utils";
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
  const { isDarkMode } = useThemeConstants();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => {
    if (state.vendor.vendor) return state.vendor.vendor;
    if (state.client.client) return state.client.client;
    return null;
  });
  const { page, total , unReadCount} = useSelector((state: RootState) => state.notification);
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
    { limit : page * limit, page : page }
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
        page : page,
        unReadCount : notificationsData.data.unReadTotal
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
        className={`relative text-sm uppercase tracking-widest /80 hover: transition-colors duration-300 group ${
          active ? "" : ""
        }`}
      >
        {children}
        <span
          className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
            active ? "w-full" : ""
          }`}
        />
      </a>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${
          scrolled ? "py-3 backdrop-blur-md" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="relative group"
            >
              <span
                className={`font-serif text-2xl tracking-tight ${
                  isDarkMode
                    ? "from-white to-gray-400"
                    : "from-black to-gray-600"
                }`}
              >
                BellaImagine
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {location.pathname !== "/admin/login" && (
            <nav className="hidden lg:flex items-center gap-12">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/vendors">Photographers</NavLink>
              <NavLink to="/explore">Community</NavLink>
            </nav>
          )}

          <button
            className="lg:hidden hover:/80 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden lg:flex items-center gap-6">
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative /80 hover: transition-colors duration-300"
                    aria-label={`Notifications (${total} new)`}
                  >
                    <Bell className="h-5 w-5" />
                    {unReadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
            )}

            {isLoggedIn && !isAdminPage ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full overflow-hidden border border-white/20 hover/10 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={user.avatar}
                          alt={`${user.name} avatar`}
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="flex items-center justify-center w-full h-full bg-muted text-foreground">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 backdrop-blur-md">
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="text-base py-2 hover/10"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="text-base py-2 hover/10"
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/messages")}
                    className="text-base py-2 hover/10"
                  >
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutUser}
                    className="text-base py-2 text-red-400 hover/10"
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
                  className="px-6 py-2 border border-white/20 text-sm uppercase tracking-widest hover hover:text-black transition-all duration-300"
                >
                  Sign Up
                </button>
              )
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden text-black">
          <div className="container h-full mx-auto px-6 py-8 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="font-serif text-2xl tracking-tight">BellaImagine</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="hover:/80 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-8 mt-16">
              {[
                { to: "/", label: "Home" },
                { to: "/vendors", label: "Photographers" },
                { to: "/community", label: "Community" },
                ...(isLoggedIn && !isAdminPage
                  ? [
                      { to: "/profile", label: "Profile" },
                      { to: "/settings", label: "Settings" },
                      { to: "/messages", label: "Messages" },
                    ]
                  : []),
              ].map((item) => (
                <div key={item.label}>
                  <NavLink to={item.to} active={location.pathname === item.to}>
                    {item.label}
                  </NavLink>
                </div>
              ))}
              {isLoggedIn && !isAdminPage && (
                <div>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="text-3xl font-light text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            <div className="mt-auto">
              {!isLoggedIn &&
                location.pathname !== "/register" &&
                location.pathname !== "/login" &&
                location.pathname !== "/admin/login" && (
                  <div>
                    <button
                      onClick={() => {
                        onClick?.();
                        setMobileMenuOpen(false);
                      }}
                      className="inline-block px-8 py-3 border border-white/20 text-sm uppercase tracking-widest hover hover:text-black transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}