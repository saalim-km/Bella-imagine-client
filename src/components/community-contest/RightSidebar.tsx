// src/components/Feed/Sidebar.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IVendorsResponse } from '@/types/interfaces/User';
import { Link } from 'react-router-dom';

const RightSidebar: React.FC<{vendors : IVendorsResponse[]}> = ({vendors}) => {
  return (
    <div className="space-y-6">      
      {/* Suggested Photographers */}
      <Card className='bg-background shadow-none'>
        <CardHeader className=''>
          <CardTitle>Suggested Photographers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vendors.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-8 h-8 mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
              </div>
              <Link to={`/photographer/${user._id}`}>
              <Button variant="link" size="sm">View Profile</Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar