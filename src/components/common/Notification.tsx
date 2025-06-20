import { format, formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react"
import { DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface TNotification {
  _id: string
  message : string
  isRead : boolean
  receiverId ?: string
  createdAt : string
  updatedAt : string
}


interface NotificationCardProps {
  notificationCount: number
  notifications : TNotification[]
}

export default function NotificationCard({ notifications = [] }: NotificationCardProps) {
  
    console.log("Notifications:", notifications.length > 0 ? notifications : "No notifications");
  
    return (
      <DropdownMenuContent className="w-80 p-0 bg-background border border-border">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Notifications</h3>
          </div>
  
          {/* Check if there are notifications */}
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            <>
              {/* Print notifications when at least one exists */}
              {console.log("Rendering notifications:", notifications)}
  
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification._id} className="flex items-start gap-3 py-2 relative">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })} 
                        {" • "}
                        {format(new Date(notification.createdAt), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                    <button className="absolute right-0 top-2 text-muted-foreground hover:text-foreground">
                      <span className="sr-only">Remove notification</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

            {
                notifications.length > 0 ?
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                Mark all as read
              </Button> :
              ""
            }
        </div>
      </DropdownMenuContent>
    );
  }
  

