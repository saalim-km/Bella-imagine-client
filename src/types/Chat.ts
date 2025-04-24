
export type User = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
};

export type Reaction = {
  emoji: string;
  userId: string;
  username: string;
};

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'location';

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: MessageType;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  reactions: Reaction[];
  status: 'sent' | 'delivered' | 'read';
  isDeleted: boolean;
};

export type Conversation = {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
};
