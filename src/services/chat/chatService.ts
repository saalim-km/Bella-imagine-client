
import { Conversation, Message, Reaction, User } from "@/types/Chat";

// Mock data for development purposes
import { mockUsers, mockConversations, mockMessages } from "@/utils/mockData";

/**
 * Chat API Service
 * 
 * This service provides methods for interacting with the chat backend API.
 * Currently using mock data, but these methods should be replaced with actual API calls.
 */
export const chatService = {
  /**
   * Fetch all conversations for the current user
   * @returns Promise<Conversation[]>
   */
  getConversations: async (): Promise<Conversation[]> => {
    // API INTEGRATION POINT: Replace with actual API call to fetch conversations
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockConversations);
      }, 500);
    });
  },

  /**
   * Fetch messages for a specific conversation
   * @param conversationId The ID of the conversation
   * @returns Promise<Message[]>
   */
  getMessages: async (conversationId: string): Promise<Message[]> => {
    // API INTEGRATION POINT: Replace with actual API call to fetch messages for a conversation
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredMessages = mockMessages.filter(
          (message) => message.id.startsWith(conversationId)
        );
        resolve(filteredMessages);
      }, 500);
    });
  },

  /**
   * Send a new message
   * @param conversationId The conversation ID
   * @param message The message content
   * @returns Promise<Message>
   */
  sendMessage: async (conversationId: string, message: Partial<Message>): Promise<Message> => {
    // API INTEGRATION POINT: Replace with actual API call to send a message
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
  },

  /**
   * Delete a message
   * @param messageId The message ID to delete
   * @returns Promise<boolean>
   */
  deleteMessage: async (messageId: string): Promise<boolean> => {
    // API INTEGRATION POINT: Replace with actual API call to delete a message
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  },

  /**
   * Add a reaction to a message
   * @param messageId The message ID
   * @param reaction The reaction to add
   * @returns Promise<boolean>
   */
  addReaction: async (messageId: string, reaction: Reaction): Promise<boolean> => {
    // API INTEGRATION POINT: Replace with actual API call to add a reaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  },

  /**
   * Remove a reaction from a message
   * @param messageId The message ID
   * @param userId The user ID who added the reaction
   * @param emoji The emoji to remove
   * @returns Promise<boolean>
   */
  removeReaction: async (messageId: string, userId: string, emoji: string): Promise<boolean> => {
    // API INTEGRATION POINT: Replace with actual API call to remove a reaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  },

  /**
   * Update user online status
   * @param userId The user ID
   * @param isOnline The online status
   * @returns Promise<boolean>
   */
  updateOnlineStatus: async (userId: string, isOnline: boolean): Promise<boolean> => {
    // API INTEGRATION POINT: Replace with actual API call to update online status
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  },

  /**
   * Update message status (read/delivered)
   * @param messageId The message ID
   * @param status The new status
   * @returns Promise<boolean>
   */
  updateMessageStatus: async (messageId: string, status: 'delivered' | 'read'): Promise<boolean> => {
    // API INTEGRATION POINT: Replace with actual API call to update message status
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  },

  /**
   * Upload media (image, video, file)
   * @param file The file to upload
   * @returns Promise<{ url: string, type: string, name?: string, size?: number }>
   */
  uploadMedia: async (file: File): Promise<{ url: string, type: string, name?: string, size?: number }> => {
    // API INTEGRATION POINT: Replace with actual API call to upload media
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
  },

  /**
   * Share location
   * @param location The location coordinates and address
   * @returns Promise<{ latitude: number, longitude: number, address?: string }>
   */
  shareLocation: async (): Promise<{ latitude: number, longitude: number, address?: string }> => {
    // API INTEGRATION POINT: Replace with actual API call to send location
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Typically this would include a reverse geocoding API call to get the address
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
  },

  /**
   * Get user by ID
   * @param userId The user ID
   * @returns Promise<User>
   */
  getUser: async (userId: string): Promise<User | undefined> => {
    // API INTEGRATION POINT: Replace with actual API call to get user details
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(user => user.id === userId);
        resolve(user);
      }, 300);
    });
  },
};
