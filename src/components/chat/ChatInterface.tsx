// components/chat/ChatInterface.tsx
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { addMessage, setMessages } from "@/store/slices/chatSlice";
import { useSocket } from "@/context/SocketContext";

interface Message {
  _id: string;
  chatRoomId: string;
  content: string;
  senderId: string;
  senderType: "Client" | "Vendor";
  read: boolean;
  createdAt: Date;
}

interface ChatInterfaceProps {
  recipientName: string;
  recipientAvatar?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  onTyping?: () => void;
  className?: string;
  userType: "Client" | "Vendor";
  chatRoomId: string;
}

export function ChatInterface({
  recipientName = "John Doe",
  recipientAvatar = "/placeholder.svg?height=40&width=40",
  messages = [],
  onSendMessage,
  onTyping,
  className,
  userType = "Client",
  chatRoomId,
}: ChatInterfaceProps) {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const socket = useSocket();

  const userId = useSelector((state: RootState) =>
    userType === "Client" ? state.client.client?._id : state.vendor.vendor?._id
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("hello", messages);
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log('-----------socket - chat room id - userId-------------', socket, chatRoomId, userId)
    if (socket && chatRoomId && userId) {
      socket.emit("messageRead", { chatRoomId, userId, userType });

      socket.on("message", (message: Message) => {
        dispatch(addMessage(message));
        scrollToBottom();
      });

      socket.on("messagesUpdated", (updatedMessages: Message[]) => {
        console.log("Received messagesUpdated:", updatedMessages); // Debug log
        dispatch(setMessages({ chatRoomId, messages: updatedMessages }));
      });

      socket.on("chatUpdate", (chatRoom: any) => {
        console.log(`${userType} chat updated:`, chatRoom);
      });

      return () => {
        socket.off("message");
        socket.off("messagesUpdated");
        socket.off("chatUpdate");
      };
    }
  }, [socket, chatRoomId, userId, userType, dispatch]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (newMessage.trim()) {
      onTyping?.();
    }
  };

  return (
    <Card className={cn("flex flex-col h-[600px] w-full", className)}>
      <div className="flex items-center p-4 border-b space-x-2">
        <Avatar className="w-12 h-12">
          <AvatarImage src={recipientAvatar} alt={`${recipientName}`} />
          <AvatarFallback>
            {recipientName.split(" ")[0][0].toUpperCase()}
            {recipientName.split(" ")[1][0]
              ? recipientName.split(" ")[1][0].toUpperCase()
              : ""}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{recipientName}</h3>
          <p className="text-sm text-muted-foreground">
            {userType === "Client" ? "Vendor" : "Client"}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          Array.isArray(messages) &&
          messages.map((message) => (
            <div
              key={message._id}
              className={cn(
                "flex",
                message.senderType === userType
                  ? "justify-end"
                  : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.senderType === userType
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="break-words">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {isTyping && <p className="text-sm text-muted-foreground">Typing...</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 flex-shrink-0"
            type="button"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              handleTyping();
              handleKeyDown(e);
            }}
            placeholder="Type your message..."
            className="min-h-[80px] resize-none"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full h-10 w-10 flex-shrink-0 p-0"
            type="button"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
