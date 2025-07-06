import { useEffect, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { Message } from "@/types/interfaces/Chat";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  setConversations,
  setSelectedConversationId,
  setShowConversations,
  updateConversation,
  addMessage,
} from "@/store/slices/chatSlice";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/context/SocketContext";
import { TRole } from "@/types/interfaces/User";
import { useSocketEvents } from "@/hooks/chat/useSocketEvents";
import { handleError } from "@/utils/Error/error-handler.utils";

export function ChatInterface() {
  const dispatch = useDispatch();
  const {
    conversations,
    selectedConversationId,
    messages,
    users,
    showConversations,
  } = useSelector((state: RootState) => state.chat);
  const isMobile = useIsMobile();
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const { socket } = useSocket();
  const userFromRedux = client || vendor;

  const { fetchMessages } = useSocketEvents({
    userId: userFromRedux?._id ?? "",
    userType: userFromRedux?.role as TRole,
  });
  
  const selectedConversation = conversations.find(
    (conv) => conv._id === selectedConversationId
  );

  const recipientUser = selectedConversation
    ? users.find(
        (user) =>
          user._id !== userFromRedux?._id &&
          (user._id === selectedConversation.user._id ||
            user._id === selectedConversation.vendor._id)
      )
    : undefined;

  const memoizedFetchMessages = useCallback(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, [fetchMessages, selectedConversationId]);

  useEffect(() => {
    memoizedFetchMessages();
  }, [memoizedFetchMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      const updatedConversationList = conversations.map(conv => 
        conv._id === selectedConversationId 
          ? { ...conv, lastMessage: newMessage } 
          : conv
      );

      if (selectedConversationId) {
        const currentConversation = conversations.find(c => c._id === selectedConversationId);
        if (currentConversation) {
          dispatch(
            updateConversation({
              ...currentConversation,
              lastMessage: newMessage,
            })
          );
        }
      }

      dispatch(setConversations(updatedConversationList));
      dispatch(addMessage(newMessage));
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, dispatch, conversations, selectedConversationId]);

  const handleSendMessage = (message: Message) => {
    if (!userFromRedux || !selectedConversationId || !socket) return;

    const newMessage: Message = {
      senderId: userFromRedux._id,
      text: message.text,
      type: message.type,
      timestamp: new Date().toISOString(),
      conversationId: selectedConversationId,
      mediaKey: message.mediaKey || "",
      userType: userFromRedux.role as TRole,
    };

    socket.emit("send_message", {
      message: newMessage,
      recipentId: recipientUser?._id,
      recipentName: userFromRedux.name,
    });

    const updatedConversationList = conversations.map(conv => 
      conv._id === selectedConversationId
        ? { ...conv, lastMessage: newMessage }
        : conv
    );

    dispatch(setConversations(updatedConversationList));
  };

  const handleDeleteMessage = async () => {
    toast.info("Message deletion functionality coming soon");
  };

  const handleReactToMessage = async () => {
    toast.info("Reaction functionality coming soon");
  };

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId));
  };

  const toggleView = () => {
    dispatch(setShowConversations(!showConversations));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-chat-background">
      <div
        className={`${
          isMobile
            ? showConversations
              ? "block w-full"
              : "hidden"
            : "w-80 border-r"
        } `}
      >
        <ConversationList
          users={users}
          conversations={conversations}
          currentUserId={userFromRedux?._id ?? ""}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div
        className={`${
          isMobile ? (showConversations ? "hidden" : "block w-full") : "flex-1"
        } flex flex-col h-full`}
      >
        {selectedConversationId && recipientUser ? (
          <>
            <ChatHeader user={recipientUser} />
            <MessageList
              messages={messages}
              currentUserId={userFromRedux?._id ?? ""}
              users={users}
              onDeleteMessage={handleDeleteMessage}
              onReactToMessage={handleReactToMessage}
            />
            <MessageInput
              conversationId={selectedConversationId}
              onSendMessage={handleSendMessage}
            />

            {isMobile && (
              <button
                className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
                onClick={toggleView}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 12H5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 19L5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">Welcome to Chat</h2>
              <p className="text-muted-foreground max-w-md">
                Select a conversation to start chatting or create a new
                conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}