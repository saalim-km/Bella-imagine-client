import { useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { Message, Reaction } from "@/types/Chat";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  setConversations,
  setSelectedConversationId,
  setMessages,
  setUsers,
  setLoading,
  setShowConversations,
  updateConversation,
  addMessage,
  updateMessage,
} from "@/store/slices/chatSlice";
import { ConversationList } from "./ConversationList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSocket } from "@/context/SocketContext";
import { TRole } from "@/types/User";
import { useSocketEvents } from "@/hooks/chat/useSocketEvents";

export function ChatInterface() {
  const dispatch = useDispatch();
  const {
    conversations,
    selectedConversationId,
    messages,
    users,
    showConversations,
  } = useSelector((state: RootState) => state.chat);
  console.log("conversations from : chatinterface", conversations);
  console.log("users from chatinterface", users);
  const isMobile = useIsMobile();
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const { socket } = useSocket();
  const userFromRedux = client ? client : vendor;
  const { fetchMessages } = useSocketEvents({
    userId: userFromRedux?._id as string,
    userType: userFromRedux?.role as TRole,
  });
  const selectedConversation = conversations.find(
    (conv) => conv._id === selectedConversationId
  );

  const recipientUser = selectedConversation
    ? userFromRedux?._id === selectedConversation.client._id
      ? selectedConversation.vendor
      : selectedConversation.client
    : undefined;

  console.log("recipent user : ", recipientUser);

  useEffect(() => {
    console.log("conversation useeffect riggered", selectedConversationId);
    fetchMessages(selectedConversationId as string);
  }, [selectedConversationId]);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (newMessage: Message) => {
        console.log("new message event trigger ❌❌❌❌❌❌❌",newMessage);
        dispatch(addMessage(newMessage));
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [socket, dispatch, messages]);

  const handleSendMessage = (message: Message) => {
    console.log("initial message : ", message);
    const newMessage: Message = {
      senderId: userFromRedux?._id as string,
      text: message.text || "",
      type: message.type,
      timestamp : new Date().toISOString(),
      conversationId: selectedConversationId as string,
      mediaUrl: message.mediaUrl || "",
      userType: userFromRedux?.role as TRole,
    };
    console.log("new message : ", newMessage);
    if (!socket) return;

    socket.emit("send_message", {
      message: newMessage,
      recipentId: recipientUser?._id,
    });

    const updatedConversations = conversations.map((conv) =>
      conv._id === selectedConversationId
        ? { ...conv, lastMessage: newMessage }
        : conv
    );

    dispatch(setConversations(updatedConversations));
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      console.log(messageId);
      // const success = await chatService.deleteMessage(messageId);

      // if (success) {
      //   dispatch(
      //     updateMessage({
      //       ...messages.find((m) => m._id === messageId)!,
      //       isDeleted: true,
      //     })
      //   );

      //   const updatedConversations = conversations.map((conv) => {
      //     if (
      //       conv._id === selectedConversationId &&
      //       conv.lastMessage?._id === messageId
      //     ) {
      //       return {
      //         ...conv,
      //         lastMessage: { ...conv.lastMessage, isDeleted: true },
      //       };
      //     }
      //     return conv;
      //   });

      //   dispatch(setConversations(updatedConversations));
      // }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleReactToMessage = async (messageId: string, emoji: string) => {
    try {
      // Find the message to update
      const message = messages.find((m) => m._id === messageId);
      if (!message) return;

      // Create a reaction object
      const reaction: Reaction = {
        emoji,
        userId: userFromRedux?._id!,
        username: "You", // In a real app, this would come from the user profile
      };

      // Check if user already reacted with this emoji
      const existingReactionIndex = message?.reactions?.findIndex(
        (r) => r.userId === userFromRedux?._id! && r.emoji === emoji
      );

      let success;
      let updatedReactions;

      // if (existingReactionIndex! >= 0) {
      //   // Remove reaction if it already exists
      //   success = await chatService.removeReaction(
      //     messageId,
      //     userFromRedux?._id!,
      //     emoji
      //   );
      //   updatedReactions = message.reactions!.filter(
      //     (_, index) => index !== existingReactionIndex
      //   );
      // } else {
      //   // Add new reaction
      //   success = await chatService.addReaction(messageId, reaction);
      //   updatedReactions = [...message.reactions!, reaction];
      // }

      if (success) {
        // Update the message with new reactions
        dispatch(
          updateMessage({
            ...message,
            reactions: updatedReactions,
          })
        );
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Failed to update reaction");
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    console.log("selected conversation id : ", conversationId);
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
          currentUserId={userFromRedux?._id!}
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
              currentUserId={userFromRedux?._id!}
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