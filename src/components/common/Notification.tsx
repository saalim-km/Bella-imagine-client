import { useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Check, ClapperboardIcon } from "lucide-react";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import {
  markAllAsRead,
  setNotifications,
} from "@/store/slices/notificationSlice";
import type { RootState } from "@/store/store";
import {
  useClearNotifications,
  useUpdateNotification,
} from "@/hooks/notifications/useNotifications";
import {
  deleteClientNotifications,
  deleteVendorNotifications,
  updateClientNotificationService,
  updateVendorNotificationService,
} from "@/services/notification/notificationService";
import { handleError } from "@/utils/Error/error-handler.utils";
import { TRole } from "@/types/interfaces/User";
import { useQueryClient } from "@tanstack/react-query";

export type TNotificationType =
  | "booking"
  | "chat"
  | "contest"
  | "review"
  | "system"
  | "custom";

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
  totalNotifications: number;
  limit: number;
  isLoading: boolean;
  userType: TRole;
  unReadCount: number;
}

export default function NotificationCard({
  page,
  setPage,
  totalNotifications,
  limit,
  isLoading,
  userType,
  unReadCount,
}: NotificationCardProps) {

  const queryClient = useQueryClient()
  const mutateFn =
    userType === "client"
      ? updateClientNotificationService
      : updateVendorNotificationService;
  const { mutate: markAdRead } = useUpdateNotification(mutateFn);

  const clearMutateFn =
    userType === "client"
      ? deleteClientNotifications
      : deleteVendorNotifications;
  const { mutate: clearNotifications } = useClearNotifications(clearMutateFn);

  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );

  const handleShowMore = () => {
    if (totalNotifications > page * limit) {
      setPage(page + 1);
    }
  };

  const hasNotifications = notifications.length > 0;
  const hasMore = totalNotifications > page * limit;

  function handleMarkAsRead() {
    markAdRead(undefined, {
      onSuccess: (data) => {
        if (data.success) {
          dispatch(markAllAsRead());
        }
      },
      onError: (err) => {
        handleError(err);
      },
    });
  }

  function handleClearNotifications() {
    clearNotifications(undefined, {
      onSuccess: (data) => {
        if (data.success) {
          dispatch(
            setNotifications({
              notifications: [],
              total: 0,
              unReadCount: 0,
              page: 1,
            })
          );
          queryClient.removeQueries({queryKey : ["notifications"]})
          queryClient.invalidateQueries({queryKey : ['notifications']})
        }
      },
      onError: (err) => {
        handleError(err);
      },
    });
  }

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
            <p className="text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map((notification: TNotification) => {
              const createdDate = notification.createdAt
                ? new Date(notification.createdAt)
                : null;

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
            <div className="flex items-center">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleMarkAsRead}
                disabled={!unReadCount}
              >
                <Check className="h-4 w-4" />
                Mark all as read
              </Button>
              <Button
                variant="link"
                size="sm"
                className="h-7 text-xs"
                onClick={handleClearNotifications}
              >
                clear notifications
              </Button>
            </div>
          </>
        )}
      </div>
    </DropdownMenuContent>
  );
}
