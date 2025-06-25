// src/store/slices/communityPostsSlice.ts
import { ICommunityPostResponse } from '@/components/User/Home';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostsState {
  posts: ICommunityPostResponse[];
  total: number;
  page: number;
  limit: number;
}

const initialState: PostsState = {
  posts: [],
  total: 0,
  page: 1,
  limit: 5,
};

const communityPostsSlice = createSlice({
  name: 'communityPosts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<{ data: ICommunityPostResponse[]; total: number }>) => {
      state.posts = action.payload.data;
      state.total = action.payload.total;
    },
    addPost: (state, action: PayloadAction<ICommunityPostResponse>) => {
      state.posts.unshift(action.payload);
      state.total += 1;
    },
    updatePost: (state, action: PayloadAction<ICommunityPostResponse>) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
      state.total -= 1;
    },
    toggleLike: (state, action: PayloadAction<{ postId: string; isLiked: boolean }>) => {
      const post = state.posts.find(p => p._id === action.payload.postId);
      if (post) {
        post.isLiked = action.payload.isLiked;
        post.likeCount += action.payload.isLiked ? 1 : -1;
      }
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetPage: (state) => {
      state.page = 1;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.total = 0;
      state.page = 1;
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  toggleLike,
  incrementPage,
  resetPage,
  setLimit,
  clearPosts,
} = communityPostsSlice.actions;

export default communityPostsSlice.reducer;