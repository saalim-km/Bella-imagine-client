
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message, User } from '@/types/Chat';
import { TRole } from '@/types/User';
import { string } from 'zod';

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
      const index = state.conversations.findIndex(conv => conv._id === action.payload._id);
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(msg => msg._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    updateContactStatus: (state , action : PayloadAction<{userId : string , userType : TRole , status : true | false}>)=> {
      state.users = state.users.map((user) : User => {
        return user._id === action.payload.userId ? {...user, isOnline: action.payload.status} : user;
      });
    },
    updateLastSeen : (state , action : PayloadAction<{userId : string , lastSeen : string}>)=> {
      state.users = state.users.map((user):  User=> {
        return user._id === action.payload.userId ? {...user,lastSeen : action.payload.lastSeen} : user;
      })
    }
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
  updateContactStatus,
  updateLastSeen
} = chatSlice.actions;

export default chatSlice.reducer;
