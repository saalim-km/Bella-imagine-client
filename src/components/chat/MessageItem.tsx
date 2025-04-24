
import { useState, useRef } from "react";
import { Message, User } from "@/types/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Trash, Copy } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatFileSize, formatTime } from "@/lib/formatters";

interface MessageItemProps {
  message: Message;
  sender: User;
  isCurrentUser: boolean;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

// Common emoji reactions
const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "👏", "🙏"];

export function MessageItem({ message, sender, isCurrentUser, onDelete, onReact }: MessageItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  // Styles based on user
  const messageStyles = isCurrentUser
    ? "bg-chat-primary text-white rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-lg ml-auto"
    : "bg-muted rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg";

  const isImage = message.type === "image";
  const isVideo = message.type === "video";
  const isFile = message.type === "file";
  const isLocation = message.type === "location";

  const renderMessageContent = () => {
    if (message.isDeleted) {
      return (
        <div className="italic text-muted-foreground">
          This message was deleted
        </div>
      );
    }

    switch (message.type) {
      case "text":
        return <p className="whitespace-pre-wrap break-words">{message.text}</p>;
      case "image":
        return (
          <div className="relative">
            <img
              src={message.mediaUrl}
              alt="Image"
              className="rounded-md max-w-xs max-h-60 object-contain"
            />
            {message.text && <p className="mt-1 whitespace-pre-wrap break-words">{message.text}</p>}
          </div>
        );
      case "video":
        return (
          <div className="relative">
            <video
              src={message.mediaUrl}
              controls
              className="rounded-md max-w-xs max-h-60 object-contain"
            />
            {message.text && <p className="mt-1 whitespace-pre-wrap break-words">{message.text}</p>}
          </div>
        );
      case "file":
        return (
          <div className="flex items-center bg-background/10 p-2 rounded-md">
            <div className="bg-background/20 p-2 rounded-md mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              {message.fileSize && (
                <p className="text-xs opacity-70">{formatFileSize(message.fileSize)}</p>
              )}
            </div>
          </div>
        );
      case "location":
        return (
          <div className="rounded-md overflow-hidden">
            <div className="bg-background/10 p-2 flex items-center">
              <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="font-medium text-sm">{message.location?.address || "Shared location"}</p>
                <p className="text-xs opacity-70">
                  {message.location?.latitude.toFixed(6)}, {message.location?.longitude.toFixed(6)}
                </p>
              </div>
            </div>
            {/* This would typically show a map, but we're using placeholder for demo */}
            <div className="bg-muted-foreground/10 h-32 flex items-center justify-center">
              <span className="text-xs">Map would render here</span>
            </div>
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap break-words">{message.text}</p>;
    }
  };

  return (
    <div 
      className={`flex mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      ref={messageRef}
    >
      {!isCurrentUser && (
        <div className="mr-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="max-w-[75%]">
        <div className={`p-3 relative ${messageStyles}`}>
          {renderMessageContent()}
          <div className="text-xs opacity-70 mt-1 text-right">
            {formatTime(message.timestamp)}
            {isCurrentUser && (
              <span className="ml-1">
                {message.status === "sent" && "✓"}
                {message.status === "delivered" && "✓✓"}
                {message.status === "read" && "✓✓"}
              </span>
            )}
          </div>
        </div>

        {/* Reactions display */}
        {message.reactions.length > 0 && (
          <div className={`flex mt-1 gap-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            {message.reactions.map((reaction, index) => (
              <div 
                key={index}
                className="bg-background rounded-full px-1.5 py-0.5 text-xs flex items-center shadow-sm border"
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span className="text-xs text-muted-foreground">{reaction.username}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message actions */}
        <div className={`flex mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
          <div className="flex space-x-1">
            <Popover open={showReactionMenu} onOpenChange={setShowReactionMenu}>
              <PopoverTrigger asChild>
                <button 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowReactionMenu(true)}
                >
                  React
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align={isCurrentUser ? "end" : "start"}>
                <div className="flex space-x-1">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-xl hover:bg-accent p-1 rounded transition-colors"
                      onClick={() => {
                        onReact(message.id, emoji);
                        setShowReactionMenu(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                <DropdownMenuItem 
                  className="text-sm cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(message.text)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </DropdownMenuItem>
                {isCurrentUser && !message.isDeleted && (
                  <DropdownMenuItem 
                    className="text-destructive text-sm cursor-pointer"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(message.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
