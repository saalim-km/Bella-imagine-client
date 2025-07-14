// src/store/slices/communityDetailsSlice.ts
import type { ICommunityPostResponse } from "@/components/User/Home"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CommunityDetailState {
  posts: ICommunityPostResponse[]
  total: number
  page: number
  limit: number
  currentCommunityId: string | null
  isLoading: boolean
  error: string | null
}

const initialState: CommunityDetailState = {
  posts: [],
  total: 0,
  page: 1,
  limit: 3,
  currentCommunityId: null,
  isLoading: false,
  error: null,
}

const communityDetailSlice = createSlice({
  name: "communityDetail",
  initialState,
  reducers: {
    setCurrentCommunity: (state, action: PayloadAction<string>) => {
      state.currentCommunityId = action.payload
      // Reset pagination and posts when community changes
      state.posts = []
      state.page = 1
      state.total = 0
      state.isLoading = true
    },
    setPosts: (state, action: PayloadAction<{
      data: ICommunityPostResponse[]
      total: number
      replace: boolean
    }>) => {
      if (action.payload.replace) {
        state.posts = action.payload.data
      } else {
        // Filter out duplicates and append new posts
        const existingIds = new Set(state.posts.map(post => post._id?.toString()))
        const newPosts = action.payload.data.filter(
          post => !existingIds.has(post._id?.toString())
        )
        state.posts = [...state.posts, ...newPosts]
      }
      state.total = action.payload.total
      state.isLoading = false
    },
    addPost: (state, action: PayloadAction<ICommunityPostResponse>) => {
      state.posts.unshift(action.payload)
      state.total += 1
    },
    updatePost: (state, action: PayloadAction<ICommunityPostResponse>) => {
      const index = state.posts.findIndex(
        post => post._id?.toString() === action.payload._id?.toString()
      )
      if (index !== -1) {
        state.posts[index] = action.payload
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(
        post => post._id?.toString() !== action.payload
      )
      state.total = Math.max(0, state.total - 1)
    },
    toggleLikeCommunity: (
      state, 
      action: PayloadAction<{
        postId: string
        isLiked: boolean
      }>
    ) => {
      const post = state.posts.find(
        p => p._id?.toString() === action.payload.postId
      )
      if (post) {
        post.isLiked = action.payload.isLiked
        post.likeCount += post.isLiked ? 1 : -1
      }
    },
    incrementPage: (state) => {
      state.page += 1
    },
    resetState: () => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setCurrentCommunity,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  toggleLikeCommunity,
  incrementPage,
  resetState,
  setLoading,
  setError,
} = communityDetailSlice.actions

export default communityDetailSlice.reducer