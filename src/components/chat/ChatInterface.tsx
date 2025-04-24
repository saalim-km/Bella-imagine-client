
import { useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { Message, Reaction } from "@/types/Chat";
import { chatService } from "@/services/chat/chatService";
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

export function ChatInterface() {
  const dispatch = useDispatch();
  const {
    conversations,
    selectedConversationId,
    messages,
    users,
    loading,
    showConversations,
  } = useSelector((state : RootState) => state.chat);
  
  const isMobile = useIsMobile();
  const currentUserId = "current-user";

  const selectedConversation = conversations.find((conv) => conv.id === selectedConversationId);
  const recipientUser = selectedConversation?.participants.find(
    (user) => user.id !== currentUserId
  );

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await chatService.getConversations();
        dispatch(setConversations(fetchedConversations));
        
        const allUsers = new Map();
        fetchedConversations.forEach((conversation) => {
          conversation.participants.forEach((user) => {
            allUsers.set(user.id, user);
          });
        });
        
        dispatch(setUsers(Array.from(allUsers.values())));
        
        if (fetchedConversations.length > 0 && !selectedConversationId) {
          dispatch(setSelectedConversationId(fetchedConversations[0].id));
        }
        
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error loading conversations:", error);
        toast.error("Failed to load conversations");
        dispatch(setLoading(false));
      }
    };
    
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversationId) return;
    
    const loadMessages = async () => {
      try {
        const fetchedMessages = await chatService.getMessages(selectedConversationId);
        dispatch(setMessages(fetchedMessages));
        
        if (isMobile) {
          dispatch(setShowConversations(false));
        }
        
        const updatedConversations = conversations.map((conv) =>
          conv.id === selectedConversationId ? { ...conv, unreadCount: 0 } : conv
        );
        dispatch(setConversations(updatedConversations));
        
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
      }
    };
    
    loadMessages();
  }, [selectedConversationId]);

  const handleSendMessage = (newMessage: Message) => {
    dispatch(addMessage(newMessage));
    
    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversationId
        ? { ...conv, lastMessage: newMessage }
        : conv
    );
    
    dispatch(setConversations(updatedConversations));
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const success = await chatService.deleteMessage(messageId);
      
      if (success) {
        dispatch(updateMessage({ ...messages.find(m => m.id === messageId)!, isDeleted: true }));
        
        const updatedConversations = conversations.map((conv) => {
          if (conv.id === selectedConversationId && conv.lastMessage?.id === messageId) {
            return {
              ...conv,
              lastMessage: { ...conv.lastMessage, isDeleted: true },
            };
          }
          return conv;
        });
        
        dispatch(setConversations(updatedConversations));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleReactToMessage = async (messageId: string, emoji: string) => {
    try {
      // Find the message to update
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      // Create a reaction object
      const reaction: Reaction = {
        emoji,
        userId: currentUserId,
        username: "You" // In a real app, this would come from the user profile
      };

      // Check if user already reacted with this emoji
      const existingReactionIndex = message.reactions.findIndex(
        r => r.userId === currentUserId && r.emoji === emoji
      );

      let success;
      let updatedReactions;

      if (existingReactionIndex >= 0) {
        // Remove reaction if it already exists
        success = await chatService.removeReaction(messageId, currentUserId, emoji);
        updatedReactions = message.reactions.filter((_, index) => index !== existingReactionIndex);
      } else {
        // Add new reaction
        success = await chatService.addReaction(messageId, reaction);
        updatedReactions = [...message.reactions, reaction];
      }

      if (success) {
        // Update the message with new reactions
        dispatch(updateMessage({
          ...message,
          reactions: updatedReactions
        }));
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Failed to update reaction");
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId));
  };

  const toggleView = () => {
    dispatch(setShowConversations(!showConversations));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chat-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-chat-background">
      <div 
        className={`${
          isMobile 
            ? (showConversations ? "block w-full" : "hidden") 
            : "w-80 border-r"
        } bg-white`}
      >
        <ConversationList
          conversations={conversations}
          currentUserId={currentUserId}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div 
        className={`${
          isMobile 
            ? (showConversations ? "hidden" : "block w-full") 
            : "flex-1"
        } flex flex-col h-full`}
      >
        {selectedConversationId && recipientUser ? (
          <>
            <ChatHeader 
              user={recipientUser}
            />
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">Welcome to ChatterVerse</h2>
              <p className="text-muted-foreground max-w-md">
                Select a conversation to start chatting or create a new conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
