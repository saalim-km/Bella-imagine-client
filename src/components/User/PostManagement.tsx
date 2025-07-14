// src/components/Profile/PostManagement.tsx
import React from 'react';
import { Button } from '../ui/button';
import { Edit, Trash2, Eye, Heart, MessageSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { UserPost } from '@/utils/mockdata';
import { openDeleteModal, openEditModal } from '@/store/slices/profileSlice';

interface PostManagementProps {
  post: UserPost;
}

const PostManagement: React.FC<PostManagementProps> = ({ post }) => {
  const dispatch = useDispatch();
  
  const statusBadge = {
    published: <Badge variant="default">Published</Badge>,
    draft: <Badge variant="secondary">Draft</Badge>,
    archived: <Badge variant="outline">Archived</Badge>,
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h2>
          <div className="flex items-center space-x-2">
            {statusBadge[post.status]}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{post.content}</p>
        
        {post.media && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.media.url} 
              alt="Post media" 
              className="w-full h-40 object-cover"
            />
          </div>
        )}
        
        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" /> {post.views.toLocaleString()}
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" /> {post.stats.likes.toLocaleString()}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" /> {post.stats.comments.toLocaleString()}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => dispatch(openEditModal(post.id))}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => dispatch(openDeleteModal(post.id))}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManagement;