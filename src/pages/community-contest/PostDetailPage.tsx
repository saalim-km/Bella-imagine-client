import React from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import CommunityLayout from '@/components/layout/CommunityLayout';
import { useGetPostDetails } from '@/hooks/community-contest/useCommunity';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams();
  if(!postId) {
    return <p>postid is required to fetch detials , please try again later</p>
  }

  const {data} = useGetPostDetails(postId)
  // In a real app, you would fetch this data based on postId
  const post = {
    id: '1',
    title: 'My latest landscape photography work',
    content: 'Just wanted to share some photos from my recent trip to the mountains. The lighting was perfect during golden hour!',
    author: {
      name: 'Jane Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
    timestamp: '2023-05-15T10:30:00Z',
    stats: {
      likes: 124,
      comments: 23,
      shares: 5,
    },
    isLiked: false,
    media: {
      type: 'image',
      url: 'https://example.com/landscape.jpg',
    },
  };

  const comments = [
    {
      id: '1',
      author: {
        name: 'John Smith',
        avatar: 'https://example.com/avatar2.jpg',
      },
      content: 'Amazing shots! The composition is perfect.',
      timestamp: '2023-05-15T11:30:00Z',
      likes: 12,
      isLiked: false,
    },
    {
      id: '2',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://example.com/avatar3.jpg',
      },
      content: 'What camera settings did you use for these?',
      timestamp: '2023-05-15T12:45:00Z',
      likes: 8,
      isLiked: true,
    },
  ];

  return (
    <CommunityLayout>
      <div className="space-y-6">
        {/* Post Content */}
        <div className=" rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">{post.author.name}</h3>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-200">{post.title}</h2>
            <p className="text-gray-700 dark:text-gray-400 mb-4">{post.content}</p>
            
            {post.media && (
              <div className="mb-4 rounded-lg overflow-hidden">
                {post.media.type === 'image' ? (
                  <img 
                    src={post.media.url} 
                    alt="Post media" 
                    className="w-full h-auto max-h-96 object-cover"
                  />
                ) : (
                  <video controls className="w-full">
                    <source src={post.media.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center border-t pt-3">
              <div className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.stats.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  <span>{post.stats.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
                  <Share2 className="w-4 h-4 mr-1" />
                  <span>{post.stats.shares}</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <div className=" rounded-lg shadow-sm border p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://example.com/current-user.jpg" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
                placeholder="Add a comment..."
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button>Post Comment</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
          
          {comments.map((comment) => (
            <div key={comment.id} className=" rounded-lg shadow-sm border p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-900 dark:text-gray-100">{comment.author.name}</h4>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-200">{comment.content}</p>
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`flex items-center ${comment.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default PostDetailPage;