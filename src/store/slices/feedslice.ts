// src/features/feed/feedSlice.ts
import { FeedPost } from '@/utils/mockdata';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeedState {
  posts: FeedPost[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  filter: 'recent' | 'top' | 'trending';
}

const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
  filter: 'recent',
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<'recent' | 'top' | 'trending'>) {
      state.filter = action.payload;
      state.currentPage = 0;
      state.posts = [];
      state.hasMore = true;
    },
    fetchPostsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess(state, action: PayloadAction<FeedPost[]>) {
      state.posts = [...state.posts, ...action.payload];
      state.loading = false;
      state.currentPage += 1;
      state.hasMore = action.payload.length > 0;
    },
    fetchPostsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    toggleLike(state, action: PayloadAction<string>) {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.stats.likes += post.isLiked ? 1 : -1;
      }
    },
  },
});

export const { setFilter, fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, toggleLike } = feedSlice.actions;
export default feedSlice.reducer;