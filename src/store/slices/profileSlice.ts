// src/features/profile/profileSlice.ts
import { PostDetailsResponse } from '@/types/interfaces/Community';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  posts: PostDetailsResponse[];
  loading: boolean;
  error: string | null;
  activeTab: 'published' | 'drafts' | 'archived';
  editModal: {
    isOpen: boolean;
    postId: string | null;
  };
  deleteModal: {
    isOpen: boolean;
    postId: string | null;
  };
}

const initialState: ProfileState = {
  posts: [],
  loading: false,
  error: null,
  activeTab: 'published',
  editModal: {
    isOpen: false,
    postId: null,
  },
  deleteModal: {
    isOpen: false,
    postId: null,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<'published' | 'drafts' | 'archived'>) {
      state.activeTab = action.payload;
    },
    fetchProfilePostsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProfilePostsSuccess(state, action: PayloadAction<PostDetailsResponse[]>) {
      state.posts = action.payload;
      state.loading = false;
    },
    fetchProfilePostsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    openEditModal(state, action: PayloadAction<string>) {
      state.editModal.isOpen = true;
      state.editModal.postId = action.payload;
    },
    closeEditModal(state) {
      state.editModal.isOpen = false;
      state.editModal.postId = null;
    },
    updatePost(state, action: PayloadAction<{id: string; title: string; content: string}>) {
      const post = state.posts.find(p => p._id === action.payload.id);
      if (post) {
        post.title = action.payload.title;
        post.content = action.payload.content;
      }
    },
    openDeleteModal(state, action: PayloadAction<string>) {
      state.deleteModal.isOpen = true;
      state.deleteModal.postId = action.payload;
    },
    closeDeleteModal(state) {
      state.deleteModal.isOpen = false;
      state.deleteModal.postId = null;
    },
    deletePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post: PostDetailsResponse) => post._id !== action.payload);
    },
  },
});

export const {
  setActiveTab,
  fetchProfilePostsStart,
  fetchProfilePostsSuccess,
  fetchProfilePostsFailure,
  openEditModal,
  closeEditModal,
  updatePost,
  openDeleteModal,
  closeDeleteModal,
  deletePost,
} = profileSlice.actions;

export default profileSlice.reducer;