import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { chatAxiosInstance } from "@/api/chat.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { toast } from "sonner";
import { useChat } from "@/hooks/chat/useChat";

interface ClientOneToOneChatPageProps {
  vendorId: string;
  onClose?: () => void;
}

function ClientOneToOneChatPage({ vendorId, onClose }: ClientOneToOneChatPageProps) {
  const userId = useSelector<RootState>((state) => state.client.client?._id);
  const userType = "Client";
  const { socket, messages, sendMessage, fetchChatHistory } = useChat(userId as string || "", userType);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [vendor, setVendor] = useState<{ name: string; avatar?: string } | null>(null);

  useEffect(() => {
    if (!userId || !socket) return;

    const initializeChat = async () => {
      try {
        const vendorResponse = await clientAxiosInstance.get(`/client/vendors/${vendorId}`);
        const vendorData = vendorResponse.data;
        setVendor({
          name: `${vendorData.firstName} ${vendorData.lastName}` || "Unknown Vendor",
          avatar: vendorData.profileImage || "/placeholder.svg?height=48&width=48",
        });

        const chatResponse = await chatAxiosInstance.get(`/${userId}/${userType.toLowerCase()}`);
        const chatRooms = chatResponse.data;
        const existingRoom = chatRooms.find((room: any) => room.vendorId === vendorId);

        if (existingRoom) {
          setChatRoomId(existingRoom._id);
          fetchChatHistory(existingRoom._id);
        } else {
          const newRoomResponse = await chatAxiosInstance.post("/create", {
            clientId: userId,
            vendorId,
          });
          setChatRoomId(newRoomResponse.data._id);
          fetchChatHistory(newRoomResponse.data._id);
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast.error("Failed to load chat");
      }
    };

    initializeChat();
  }, [userId, vendorId, socket, fetchChatHistory]);

  const handleSendMessage = (message: string) => {
    if (!chatRoomId) return;
    sendMessage(chatRoomId, message, vendorId);
  };

  return (
    <div className="relative p-4">
      {onClose && (
        <Button variant="ghost" className="absolute top-2 left-2" onClick={onClose}>
          Close
        </Button>
      )}
      {vendor && chatRoomId ? (
        <ChatInterface
          recipientName={vendor.name}
          recipientAvatar={vendor.avatar}
          messages={messages.filter((m) => m.chatRoomId === chatRoomId)}
          onSendMessage={handleSendMessage}
          userType="Client"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading chat...</p>
        </div>
      )}
    </div>
  );
}

export default ClientOneToOneChatPage;