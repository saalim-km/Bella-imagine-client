
import { useState } from "react";
import { Conversation, User } from "@/types/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { formatMessagePreview } from "@/utils/format/formatters";

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const otherUser = getOtherUser(conversation, currentUserId);
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const otherUser = getOtherUser(conversation, currentUserId);
          return (
            <div
              key={conversation.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-accent transition-colors ${
                selectedConversationId === conversation.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="relative mr-3">
                <Avatar>
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {otherUser.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-chat-success animate-pulse-dot ring-1 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{otherUser.name}</h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  {conversation.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                      {formatMessagePreview(conversation.lastMessage)}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Start a conversation</p>
                  )}
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-chat-primary  text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t mt-auto">
        <button className="w-full flex items-center justify-center space-x-2 p-2 rounded-md bg-chat-primary  hover:bg-chat-secondary transition-colors">
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>
    </div>
  );
}

// Helper function to get the other user in a conversation
function getOtherUser(conversation: Conversation, currentUserId: string): User {
  return conversation.participants.find((user) => user.id !== currentUserId) || conversation.participants[0];
}

// Helper function to format message timestamp
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }
}
