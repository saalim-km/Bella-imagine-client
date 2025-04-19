import { Conversation, Message, Reaction, User } from "@/types/Chat";
import { mockUsers, mockConversations, mockMessages } from "../../components/chat/mockData";

/**
 * Fetch all conversations for the current user
 * @returns Promise<Conversation[]>
 */
export const getConversations = async (): Promise<Conversation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConversations);
    }, 500);
  });
};

/**
 * Fetch messages for a specific conversation
 * @param conversationId The ID of the conversation
 * @returns Promise<Message[]>
 */
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredMessages = mockMessages.filter(
        (message) => message.id.startsWith(conversationId)
      );
      resolve(filteredMessages);
    }, 500);
  });
};

/**
 * Send a new message
 * @param conversationId The conversation ID
 * @param message The message content
 * @returns Promise<Message>
 */
export const sendMessage = async (conversationId: string, message: Partial<Message>): Promise<Message> => {
  return new Promise((resolve) => {
    const newMessage: Message = {
      id: `${conversationId}-${Date.now()}`,
      senderId: "current-user", // This would come from auth
      text: message.text || "",
      timestamp: new Date().toISOString(),
      type: message.type || "text",
      mediaUrl: message.mediaUrl,
      mediaType: message.mediaType,
      fileName: message.fileName,
      fileSize: message.fileSize,
      location: message.location,
      reactions: [],
      status: "sent",
      isDeleted: false,
    };
    setTimeout(() => {
      resolve(newMessage);
    }, 300);
  });
};

/**
 * Delete a message
 * @param messageId The message ID to delete
 * @returns Promise<boolean>
 */
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Add a reaction to a message
 * @param messageId The message ID
 * @param reaction The reaction to add
 * @returns Promise<boolean>
 */
export const addReaction = async (messageId: string, reaction: Reaction): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Remove a reaction from a message
 * @param messageId The message ID
 * @param userId The user ID who added the reaction
 * @param emoji The emoji to remove
 * @returns Promise<boolean>
 */
export const removeReaction = async (messageId: string, userId: string, emoji: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Update user online status
 * @param userId The user ID
 * @param isOnline The online status
 * @returns Promise<boolean>
 */
export const updateOnlineStatus = async (userId: string, isOnline: boolean): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Update message status (read/delivered)
 * @param messageId The message ID
 * @param status The new status
 * @returns Promise<boolean>
 */
export const updateMessageStatus = async (messageId: string, status: 'delivered' | 'read'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * Upload media (image, video, file)
 * @param file The file to upload
 * @returns Promise<{ url: string, type: string, name?: string, size?: number }>
 */
export const uploadMedia = async (file: File): Promise<{ url: string, type: string, name?: string, size?: number }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        resolve({
          url: reader.result as string,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'file',
          name: file.name,
          size: file.size,
        });
      }, 1000);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Share location
 * @param location The location coordinates and address
 * @returns Promise<{ latitude: number, longitude: number, address?: string }>
 */
export const shareLocation = async (): Promise<{ latitude: number, longitude: number, address?: string }> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Location address would be determined by reverse geocoding API"
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

/**
 * Get user by ID
 * @param userId The user ID
 * @returns Promise<User>
 */
export const getUser = async (userId: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(user => user.id === userId);
      resolve(user);
    }, 300);
  });
};
