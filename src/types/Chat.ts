import { TRole } from "./User";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: TRole;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
};

export type Reaction = {
  emoji: string;
  userId: string;
  username: string;
};

export type MessageType = 'text' | 'image' | 'location' | 'video' | 'document'

export type Message = {
  _id?: string;  
  senderId: string;
  text: string;
  timestamp?: string;
  conversationId : string;
  type: MessageType;
  mediaKey?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  reactions?: Reaction[];
  isRead ?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  userType ?: TRole;
  isDeleted?: boolean;
};

export type Conversation = {
  _id: string;
  client : User;
  vendor : User;
  lastMessage?: Message;
  unreadCount: number;
};
