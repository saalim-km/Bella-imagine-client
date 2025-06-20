// utils/showNotificationToast.ts
import { toast } from "sonner";
import { TNotification } from "./Notification";
import { Link } from "react-router-dom";

export const showNotificationToast = (notification: TNotification) => {
  const isBooking = notification.message.toLowerCase().includes("booking");
  const isChat = notification.message.toLowerCase().includes("message");

  toast.custom((t) => {
    return (
      <div className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 w-[300px] border border-muted">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="text-xl">
            {isBooking ? "📅" : isChat ? "💬" : "🔔"}
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {isBooking ? "New Booking" : isChat ? "New Message" : "Notification"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          {isChat && (
            <Link
              to={'/messages'}
              className="text-xs text-green-600 hover:underline"
            >
              Go to Messages
            </Link>
          )}
          <button
            onClick={() => toast.dismiss(t)}
            className="text-xs text-blue-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  });
};
