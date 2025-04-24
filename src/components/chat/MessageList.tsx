
import { useEffect, useRef } from "react";
import { Message, User } from "@/types/Chat";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  users: User[];
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

export function MessageList({
  messages,
  currentUserId,
  users,
  onDeleteMessage,
  onReactToMessage,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sort messages by timestamp
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  
  sortedMessages.forEach((message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Find sender for a message
  const getSender = (senderId: string): User => {
    return users.find((user) => user.id === senderId) || {
      id: senderId,
      name: "Unknown User",
      avatar: "",
      isOnline: false,
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex justify-center my-3">
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {formatDateHeader(date)}
            </span>
          </div>
          
          {dateMessages.map((message) => {
            const sender = getSender(message.senderId);
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <MessageItem
                key={message.id}
                message={message}
                sender={sender}
                isCurrentUser={isCurrentUser}
                onDelete={onDeleteMessage}
                onReact={onReactToMessage}
              />
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
