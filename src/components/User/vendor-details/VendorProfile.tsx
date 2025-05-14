
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IVendorDetails } from "@/types/vendor";

interface VendorProfileProps {
  vendor: IVendorDetails;
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
      <div className="relative h-32 bg-gray-200">
        <div className="absolute -bottom-16 left-6">
          <Avatar className="h-28 w-28 border-4 border-white shadow-md">
            <AvatarImage className="object-cover" src={vendor.profileImage} alt={vendor.name} />
            <AvatarFallback className="text-lg bg-gray-400 text-white">
              {getInitials(vendor.name)}
            </AvatarFallback>
          </Avatar>
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
              <p className="text-gray-600">{vendor.description}</p>
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
              {vendor.categories?.map((category,indx)=> (
                <Badge variant={"outline"} className="rounded-2xl" key={indx}>{category.title}</Badge>
              ))}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {vendor.languages?.map((language,indx)=> (
                    <Badge variant={"outline"} className="rounded-2xl" key={indx}>{language}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Verification Status</h3>
              <div className="flex items-center">
              <span className="status-badge">
                {vendor.isVerified === "accept" ? (
                  <Badge className="border-green-500 text-green-600 rounded-2xl flex items-center gap-1" variant="outline">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Verified
                  </Badge>
                ) : vendor.isVerified === "pending" ? (
                  <XCircle size={14} className="mr-1 text-yellow-500" />
                ) : (
                  <XCircle size={14} className="mr-1 text-red-500" />
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
