// src/features/profile/profileThunks.ts
import { generateMockProfilePosts } from '@/utils/mockdata';
import { AppDispatch } from '../store';
import { fetchProfilePostsStart, fetchProfilePostsSuccess, fetchProfilePostsFailure } from './profileSlice';

export const fetchProfilePosts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchProfilePostsStart());
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const posts = generateMockProfilePosts(15);
    
    dispatch(fetchProfilePostsSuccess(posts));
  } catch (error) {
    dispatch(fetchProfilePostsFailure(error.message));
  }
};