import { useEffect, useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { useGetAllNotifications } from "@/hooks/notifications/useNotifications";
import { markAllAsRead, setNotifications } from "@/store/slices/notificationSlice";
import { TRole } from "@/types/interfaces/User";

export type TNotificationType = "booking" | "chat" | "contest" | "review" | "system" | "custom";

export interface TNotification {
  _id: string;
  type: TNotificationType;
  message: string;
  isRead?: boolean;
  receiverId: string;
  receiverModel?: "Client" | "Vendor";
  senderId: string;
  senderModel?: "Client" | "Vendor";
  actionUrl?: string;
  meta?: Record<string, any>;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NotificationCardProps {
  page: number;
  setPage: (page: number) => void;
  queryFn: any;
  role: TRole;
  limit: number;
}

export default function NotificationCard({ page, setPage, queryFn, role, limit }: NotificationCardProps) {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: notificationsData, isLoading } = useGetAllNotifications(queryFn, role, true, { limit, page });
  const totalNotificaiton = notificationsData?.data.total || 0

  useEffect(() => {
    if (notificationsData?.data?.data) {
      dispatch(setNotifications({
        notifications: notificationsData.data.data,
        total: notificationsData.data.total,
        page,
      }));
    }
  }, [notificationsData, dispatch, page]);

  const handleShowMore = () => {
    if (totalNotificaiton > page * limit) {
      setPage(page + 1);
    }
  };

  const notifications = notificationsData?.data?.data || [];
  const hasNotifications = notifications.length > 0;
  const hasMore = totalNotificaiton > page * limit;

  return (
    <DropdownMenuContent className="w-80 p-0 bg-background border border-border">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Notifications</h3>
        </div>

        <div
          ref={scrollRef}
          className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {!hasNotifications ? (
            <p className="text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification: TNotification) => {
              const createdDate = notification.createdAt ? new Date(notification.createdAt) : null;

              return (
                <div
                  key={notification._id}
                  className={clsx(
                    "flex items-start gap-3 py-2 relative",
                    !notification.isRead && "bg-muted rounded-md px-2"
                  )}
                >
                  <div className="flex-shrink-0 mt-2">
                    <div
                      className={clsx(
                        "h-2 w-2 rounded-full",
                        notification.isRead ? "bg-muted" : "bg-primary"
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    {createdDate && (
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(createdDate, { addSuffix: true })}
                        {" • "}
                        {format(createdDate, "MMM d, yyyy h:mm a")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {isLoading && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Loading...
            </div>
          )}
        </div>

        {hasNotifications && (
          <>
            {hasMore && !isLoading && (
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleShowMore}
              >
                Show More
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => dispatch(markAllAsRead())}
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
          </>
        )}
      </div>
    </DropdownMenuContent>
  );
}