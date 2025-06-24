// src/components/Feed/Sidebar.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSuggestedUsers } from '@/utils/mockdata';
import { Button } from '@/components/ui/button';

const RightSidebar: React.FC = () => {
  return (
    <div className="space-y-6">      
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
    </div>
  );
};

export default RightSidebar