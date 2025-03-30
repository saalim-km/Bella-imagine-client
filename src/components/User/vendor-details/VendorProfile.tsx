
import React from "react";
import { IVendorsResponse } from "@/types/User";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Award, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tags from "./Tags";

interface VendorProfileProps {
  vendor: IVendorsResponse;
}

const VendorProfile: React.FC<VendorProfileProps> = ({ vendor }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <div className="relative h-32 bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="absolute -bottom-16 left-6">
          <Avatar className="h-28 w-28 border-4 border-white shadow-md">
            <AvatarImage src={vendor.profileImage} alt={vendor.name} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getInitials(vendor.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`status-badge ${vendor.isActive ? 'active' : 'inactive'}`}>
            {vendor.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      <CardContent className="pt-20 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-2xl font-bold">{vendor.name}</h1>
              <div className="flex items-center text-gray-500 mt-1 space-x-1">
                <MapPin size={16} />
                <span>{vendor.location}</span>
              </div>
            </div>
            
            <div>
              <p className="text-gray-700">{vendor.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Award size={16} className="text-primary" />
              <span>{vendor.yearsOfExperience} years of experience</span>
            </div>
            
            {vendor.portfolioWebsite && (
              <div>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a 
                    href={vendor.portfolioWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Globe size={16} />
                    Portfolio Website
                  </a>
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
              {vendor.categories.map((category,indx)=> (
                <Badge key={indx}>{category.title}</Badge>
              ))}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {vendor.languages?.map((language,indx)=> (
                    <Badge key={indx}>{language}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Verification Status</h3>
              <div className="flex items-center">
                <span className={`status-badge ${vendor.isVerified}`}>
                  {vendor.isVerified === "accept" && (
                    <CheckCircle2 size={14} className="mr-1" />
                  )}
                  {vendor.isVerified === "reject" && (
                    <XCircle size={14} className="mr-1" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorProfile;
