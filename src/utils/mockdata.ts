// src/mock/feedData.ts
export interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  title: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
}

export const generateMockFeed = (count: number): FeedPost[] => {
  const mockPosts: FeedPost[] = [];
  const mediaTypes = ['image', 'video', undefined];
  
  for (let i = 0; i < count; i++) {
    const hasMedia = Math.random() > 0.3;
    const mediaType = hasMedia ? mediaTypes[Math.floor(Math.random() * 2)] : undefined;
    
    mockPosts.push({
      id: `post-${i}`,
      author: {
        name: `user${Math.floor(Math.random() * 1000)}`,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      },
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      title: `Post title ${i + 1}`,
      content: `This is the content of post ${i + 1}. ${Math.random() > 0.5 ? 'It has some more text to make it longer.' : ''}`,
      media: hasMedia ? {
        type: mediaType as 'image' | 'video',
        url: mediaType === 'image' 
          ? `https://picsum.photos/seed/${Math.random()}/800/600`
          : 'https://www.example.com/sample-video.mp4'
      } : undefined,
      stats: {
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 100),
      },
      isLiked: Math.random() > 0.7,
    });
  }
  
  return mockPosts;
};

export const mockTrendingPosts = generateMockFeed(5);
export const mockSuggestedUsers = Array.from({ length: 5 }, (_, i) => ({
  id: `user-${i}`,
  name: `photographer${i}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
  followers: Math.floor(Math.random() * 10000),
}));





export interface UserPost extends FeedPost {
  views: number;
  status: 'published' | 'draft' | 'archived';
}

export const generateMockProfilePosts = (count: number): UserPost[] => {
  const mockPosts: UserPost[] = [];
  const statuses: ('published' | 'draft' | 'archived')[] = ['published', 'draft', 'archived'];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * 3)];
    
    mockPosts.push({
      id: `user-post-${i}`,
      author: {
        name: 'currentUser',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      title: `My Post ${i + 1}`,
      content: `This is my post content ${i + 1}. It's ${status}.`,
      media: Math.random() > 0.5 ? {
        type: 'image',
        url: `https://picsum.photos/seed/profile-${i}/800/600`
      } : undefined,
      stats: {
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
      },
      isLiked: false,
      views: Math.floor(Math.random() * 10000),
      status,
    });
  }
  
  return mockPosts;
};