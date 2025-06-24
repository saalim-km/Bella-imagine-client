// src/components/Feed/PostSkeleton.tsx
import React from 'react';

const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
          <div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        
        <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
        
        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex space-x-4">
            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;