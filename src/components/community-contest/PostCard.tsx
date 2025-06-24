// src/components/Feed/PostCard.tsx
import React from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { toggleLike } from '@/store/slices/feedslice';
import { FeedPost } from '@/utils/mockdata';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: FeedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch();

  const handleLike = () => {
    dispatch(toggleLike(post.id));
  };

  return (
    <div className="  rounded-lg  overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
        
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
        
        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
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
  );
};

export default PostCard;