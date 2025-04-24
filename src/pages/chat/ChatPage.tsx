import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatList } from "@/components/chat/ChatList";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useChat } from "@/hooks/chat/useChat";
import { Navigate } from "react-router-dom";
import { ChatButton } from "@/components/chat/ChatButton";
import { setSelectedChatRoomId } from "@/store/slices/chatSlice";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatPageProps {
  userType: "Client" | "Vendor";
}

export function ChatPage({ userType }: ChatPageProps) {
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) =>
    userType === "Client" ? state.client.client?._id : state.vendor.vendor?._id
  );

  const user = useSelector((state: RootState) =>
    userType === "Client" ? state.client.client : state.vendor.vendor
  );
  console.log('userId : ',userId);
  console.log('user data : ',user);
  console.log("this is the user", user);
  
  const {
    contacts,
    messages: allMessages,
    selectedChatRoomId,
  } = useSelector((state: RootState) => state.chat);

  const { socket, fetchContacts, sendMessage, fetchChatHistory, sendTyping } =
    useChat(userId || "", userType);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    console.log('this is all messages from chat page', allMessages)
  }, [allMessages])

  useEffect(() => {
    if (socket && userId) {
      fetchContacts();
      dispatch(setSelectedChatRoomId(null));
    }
  }, [socket, userId, fetchContacts]);

  useEffect(() => {
    if (selectedChatRoomId && socket) {
      fetchChatHistory(selectedChatRoomId);
      console.log('history fetched ===>')
    }
  }, [selectedChatRoomId, socket, fetchChatHistory]);

  console.log("ChatPage render, socket:", socket, "selectedChatRoomId:", selectedChatRoomId);


  const handleSendMessage = (message: string) => {
    console.log(message);
    if (!selectedChatRoomId) return;
    const selectedContact = contacts.find(
      (c) => c.chatRoomId === selectedChatRoomId
    );
    if (!selectedContact) return;
    sendMessage(selectedChatRoomId, message, selectedContact.id);
  };

  const handleSelectContact = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    dispatch(setSelectedChatRoomId(contact?.chatRoomId || null));
    setIsChatOpen(true);
  };

  const selectedContact = contacts.find(
    (contact) => contact.chatRoomId === selectedChatRoomId
  );

  return (
    <>
      {!isChatOpen && (
        <ChatButton
          onClick={() => setIsChatOpen(true)}
          variant="outline"
          size="lg"
          tooltipText={`Chat with ${
            userType === "Client" ? "vendors" : "clients"
          }`}
        />
      )}
      {isChatOpen && (
        <div
          className={`container mx-auto py-6 px-4 ${
            isMobile ? "fixed inset-0 bg-background z-50" : ""
          }`}
        >
          <h1 className="text-2xl font-bold mb-6">
            {userType === "Client"
              ? "Your Vendor Conversations"
              : "Your Client Conversations"}
          </h1>
          <div
            className={`grid ${
              isMobile ? "grid-cols-1 gap-6" : "grid-cols-3 gap-6"
            }`}
          >
            <div className={isMobile && selectedChatRoomId ? "hidden" : ""}>
              <ChatList
                onSelectContact={handleSelectContact}
                selectedContactId={selectedContact?.id}
                title={userType === "Client" ? "Your Vendors" : "Your Clients"}
                userType={userType}
              />
            </div>
            <div
              className={`${isMobile ? "col-span-1" : "col-span-2"} ${
                isMobile && !selectedChatRoomId ? "hidden" : ""
              }`}
            >
              {selectedChatRoomId && selectedContact ? (
                <div className="relative">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      className="absolute top-4 left-4 z-10"
                      onClick={() => dispatch(setSelectedChatRoomId(null))}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <ChatInterface
                    recipientName={selectedContact.name}
                    recipientAvatar={selectedContact.avatar}
                    messages={allMessages[selectedChatRoomId] || []}
                    onSendMessage={handleSendMessage}
                    userType={userType}
                    onTyping={() => sendTyping(selectedChatRoomId)}
                    chatRoomId={selectedChatRoomId}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
                  <div className="text-center p-6">
                    <h3 className="text-xl font-medium mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a {userType === "Client" ? "vendor" : "client"}{" "}
                      from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!isMobile && (
            <Button className="mt-4" onClick={() => setIsChatOpen(false)}>
              Close Chat
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export const ClientChatPage = () => <ChatPage userType="Client" />;
export const VendorChatPage = () => <ChatPage userType="Vendor" />;
