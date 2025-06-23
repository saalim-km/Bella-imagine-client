import { generateMockFeed } from "@/utils/mockdata";
import { fetchPostsFailure, fetchPostsStart, fetchPostsSuccess } from "./feedslice";
import { AppDispatch } from "../store";


export const fetchPosts = (page: number, filter: 'recent' | 'top' | 'trending') => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPostsStart());
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock data based on filter
    let posts;
    if (filter === 'recent') {
      posts = generateMockFeed(10).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (filter === 'top') {
      posts = generateMockFeed(10).sort((a, b) => b.stats.likes - a.stats.likes);
    } else {
      // trending - combination of recent and likes
      posts = generateMockFeed(10)
        .sort((a, b) => (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) + (b.stats.likes - a.stats.likes));
    }
    
    // Simulate pagination - return empty array after page 2
    const result = page < 2 ? posts : [];
    
    dispatch(fetchPostsSuccess(result));
  } catch (error) {
    dispatch(fetchPostsFailure(error.message));
  }
};