import type { ICommunityPostResponse } from "@/components/User/Home"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface PostsState {
  posts: ICommunityPostResponse[]
  total: number
  page: number
  limit: number
}

const initialState: PostsState = {
  posts: [],
  total: 0,
  page: 1,
  limit: 5,
}

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<{ data: ICommunityPostResponse[]; total: number }>) => {
      // For pagination, append new posts instead of replacing
      if (state.page === 1) {
        state.posts = action.payload.data
      } else {
        // Remove duplicates and append new posts
        const existingIds = new Set(state.posts.map((post) => post._id?.toString()))
        const newPosts = action.payload.data.filter((post) => !existingIds.has(post._id?.toString()))
        state.posts = [...state.posts, ...newPosts]
      }
      state.total = action.payload.total
    },
    addPost: (state, action: PayloadAction<ICommunityPostResponse>) => {
      state.posts.unshift(action.payload)
      state.total += 1
    },
    updatePost: (state, action: PayloadAction<ICommunityPostResponse>) => {
      const index = state.posts.findIndex((post) => post._id?.toString() === action.payload._id?.toString())
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload }
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id?.toString() !== action.payload)
      state.total = Math.max(0, state.total - 1)
    },
    toggleLike: (state, action: PayloadAction<{ postId: string; isLiked: boolean }>) => {
      const post = state.posts.find((p) => p._id?.toString() === action.payload.postId)
      if (post) {
        const wasLiked = post.isLiked
        post.isLiked = action.payload.isLiked

        // Update like count based on the change
        if (wasLiked && !action.payload.isLiked) {
          // Was liked, now unliked
          post.likeCount = Math.max(0, post.likeCount - 1)
        } else if (!wasLiked && action.payload.isLiked) {
          // Was not liked, now liked
          post.likeCount += 1
        }
      }
    },
    incrementPage: (state) => {
      state.page += 1
    },
    resetPage: (state) => {
      state.page = 1
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    clearPosts: (state) => {
      state.posts = []
      state.total = 0
      state.page = 1
    },
  },
})

export const { setPosts, addPost, updatePost, deletePost, toggleLike, incrementPage, resetPage, setLimit, clearPosts } =
  feedSlice.actions

export default feedSlice.reducer
