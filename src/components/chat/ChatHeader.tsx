
import { User } from "@/types/interfaces/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

interface ChatHeaderProps {
  user: User;
}

export function ChatHeader({ user }: ChatHeaderProps) {
  
return (
  <div className="flex items-center justify-between px-4 py-3 border-b">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage className="object-cover" src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-chat-success animate-pulse-dot ring-2 ring-background" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <h2 className="font-semibold">{user.name}</h2>
          {user.isOnline && (
            <span className="h-2 w-2 rounded-full bg-chat-success animate-pulse" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {user.isOnline ? (
            <span className="text-chat-success">Online now</span>
          ) : (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last seen {formatLastSeen(user.lastSeen || '')}
            </span>
          )}
        </p>
      </div>
    </div>
  </div>
);
}

function formatLastSeen(lastSeen: string): string {
  const date = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}