
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message, User } from '@/types/Chat';

interface ChatState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: Message[];
  users: User[];
  loading: boolean;
  showConversations: boolean;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversationId: null,
  messages: [],
  users: [],
  loading: true,
  showConversations: true,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setSelectedConversationId: (state, action: PayloadAction<string | null>) => {
      state.selectedConversationId = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setShowConversations: (state, action: PayloadAction<boolean>) => {
      state.showConversations = action.payload;
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(conv => conv.id === action.payload.id);
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
  },
});

export const {
  setConversations,
  setSelectedConversationId,
  setMessages,
  setUsers,
  setLoading,
  setShowConversations,
  updateConversation,
  addMessage,
  updateMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
