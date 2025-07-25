import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/hooks/auth/useLogout";
import { logoutAdmin } from "@/services/auth/authService";
import { adminLogout } from "@/store/slices/adminSlice";
import ThemeToggle from "@/components/common/ThemeToggle";
import { handleError } from "@/utils/Error/error-handler.utils";
import { communityToast } from "../ui/community-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  // Fetch unread notifications count
  // const { data: notificationsData } = useNotifications({ page: 1, limit: 5 })
  // const notifications = notificationsData?.data || []
  // const unreadCount = notifications.filter((n) => !n.read).length
  const dispatch = useDispatch();
  const { mutate: logout } = useLogoutMutation(logoutAdmin);

  function handleLogout() {
    logout(undefined, {
      onSuccess: (data) => {
        communityToast.success({ title: data?.message });

        dispatch(adminLogout());
      },
      onError: (error) => {
        handleError(error);
      },
    });
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <div className="ml-auto flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </Button> */}
                  </DropdownMenuTrigger>
                  {/* <DropdownMenuContent align="end" className="w-[300px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
                        <div className="flex w-full justify-between">
                          <p className="font-medium">{notification.title}</p>
                          {!notification.read && (
                            <Badge variant="secondary" className="ml-auto">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent> */}
                </DropdownMenu>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
