// slices/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Contact {
  id: string; // clientId or vendorId
  chatRoomId: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  status?: "online" | "offline";
}

interface Message {
  _id: string;
  chatRoomId: string;
  content: string;
  senderId: string;
  senderType: "Client" | "Vendor";
  read: boolean;
  createdAt: Date;
}

export interface IChatRoom {
  _id?: string 
  clientId: string;
  vendorId: string;
  bookingId: string;
  lastMessage: {
    content: string,
    senderId: string ,
    senderType: "Client" | "Vendor"
    createdAt: Date 
  },
  unreadCountClient: number;
  unreadCountVendor: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatState {
  contacts: Contact[];
  messages: { [chatRoomId: string]: Message[] };
  selectedChatRoomId: string | null;
}

const initialState: ChatState = {
  contacts: [],
  messages: {},
  selectedChatRoomId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{ chatRoomId: string; messages: Message[] }>
    ) => {
      // Ensure messages is an array
      console.log('chat room id =>',action.payload.chatRoomId, 'messages =>', action.payload.messages)
      const messages = Array.isArray(action.payload.messages) ? action.payload.messages : [];
      state.messages[action.payload.chatRoomId] = messages
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const chatRoomId = action.payload.chatRoomId;
      // Ensure chatRoomId key is an array
      if (!Array.isArray(state.messages[chatRoomId])) {
        console.warn(`state.messages[${chatRoomId}] was not an array, resetting to []`, state.messages[chatRoomId]);
        state.messages[chatRoomId] = [];
      }
      state.messages[chatRoomId].push(action.payload);

      const contact = state.contacts.find((c) => c.chatRoomId === chatRoomId);
      if (contact) {
        contact.lastMessage = action.payload.content;
        contact.lastMessageTime = new Date(action.payload.createdAt).toISOString();
        if (
          (action.payload.senderType === "Vendor" && state.selectedChatRoomId !== chatRoomId) ||
          (action.payload.senderType === "Client" && state.selectedChatRoomId !== chatRoomId)
        ) {
          contact.unreadCount = (contact.unreadCount || 0) + 1;
        }
      }
    },
    setSelectedChatRoomId: (state, action: PayloadAction<string | null>) => {
      state.selectedChatRoomId = action.payload;
      if (action.payload) {
        const contact = state.contacts.find((c) => c.chatRoomId === action.payload);
        if (contact) contact.unreadCount = 0;
      }
    },
    updateContactStatus: (
      state,
      action: PayloadAction<{ contactId: string; status: "online" | "offline" }>
    ) => {
      state.contacts = state.contacts.map((contact) =>
        contact.id === action.payload.contactId
          ? { ...contact, status: action.payload.status }
          : contact
      );
    },
  },
});

export const {
  setContacts,
  setMessages,
  addMessage,
  setSelectedChatRoomId,
  updateContactStatus,
} = chatSlice.actions;
export default chatSlice.reducer;