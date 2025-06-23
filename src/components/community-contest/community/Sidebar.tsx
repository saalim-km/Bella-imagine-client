// src/components/Feed/Sidebar.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSuggestedUsers, mockTrendingPosts } from '@/utils/mockdata';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Trending Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Today</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTrendingPosts.map((post) => (
            <div key={post.id} className="border-b pb-3 last:border-b-0 last:pb-0">
              <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })} · {post.stats.likes} likes
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Suggested Photographers */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Photographers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockSuggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.followers.toLocaleString()} followers</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Profile</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Platform Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            We've just launched our new mobile app! Download it now for a better experience.
          </p>
          <Button variant="link" className="p-0 h-auto mt-2 text-sm">
            Learn more
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar