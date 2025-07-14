import React, { useState } from "react";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  UserCheck, 
  FileText,
  Globe,
  Languages,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { IVendor } from "@/services/vendor/vendorService";
import { IClient } from "@/services/client/clientService";

type IProfileInfo = Partial<IVendor | IClient>

interface ProfileInfoProps {
  data: IProfileInfo;
}

export function ProfileInfo({ data }: ProfileInfoProps) {
  const [showDocs, setShowDocs] = useState(false);
  const isVendor = "vendorId" in data && data.vendorId;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  
  const formattedDate = data?.createdAt 
    ? format(new Date(data.createdAt), "MMMM dd, yyyy")
    : null;



  return (
    <div className="space-y-4 dark:text-gray-300 border pb-6">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-orange-500 to-white dark:from-orange-600 h-32 w-full rounded-t-lg"></div>
      
      {/* Profile Content */}
      <div className="px-4 -mt-16">
        {/* Profile Header */}
        <div className="flex items-end gap-4 mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-white  overflow-hidden">
            {data.profileImage ? (
              <img 
                src={data.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserCheck className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-gray-600">Joined {formattedDate}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Personal Information */}
          <div className=" rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={data?.email} />
              <InfoItem icon={Phone} label="Phone" value={data?.phoneNumber?.toString()} />
              <InfoItem icon={MapPin} label="Location" value={data?.location?.address} />
            </div>
          </div>

          {/* Vendor Specific */}
          {isVendor && (
            <>
              <div className=" rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3 border-b pb-2">Vendor Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={UserCheck} label="Vendor ID" value={data.vendorId} />
                    {data.portfolioWebsite ? (
                      <a
                        href={data.portfolioWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600 flex items-start"
                      >
                        <InfoItem icon={Globe} label="Portfolio" value={data.portfolioWebsite} />
                      </a>
                    ) : (
                      <InfoItem icon={Globe} label="Portfolio" value={data.portfolioWebsite} />
                    )}
                    <InfoItem icon={Languages} label="Languages" value={data.languages?.join(", ")} />
                    
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Verification</p>
                        <span className={cn(
                          "text-sm",
                          data.isVerified === "accept" ? "text-green-600" :
                          data.isVerified === "reject" ? "text-red-600" : "text-yellow-600"
                        )}>
                          {data.isVerified === "accept" ? "Verified" :
                           data.isVerified === "reject" ? "Rejected" : "Pending"}
                        </span>
                      </div>
                    </div>
                </div>

                {/* Documents */}
                {data.verificationDocument && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDocs(!showDocs)}
                      className="text-orange-700 border-orange-700"
                    >
                      {showDocs ? "Hide Documents" : "Show Documents"}
                    </Button>
                    {showDocs && (
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <img 
                          src={data.verificationDocument} 
                          className="w-full max-h-64 object-contain rounded border"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {data.description && (
                  <div className="mt-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">Description</span>
                      </div>
                      {isDescriptionOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                    {isDescriptionOpen && (
                      <div className="mt-2 p-3  rounded">
                        <p className="text-sm">{data.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Categories */}
                {data.categories && data.categories.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Categories:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full"
                        >
                          {category?.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Additional Info */}
          <div className=" rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2">Additional Information</h2>
            <InfoItem 
              icon={Briefcase} 
              label="Blocked" 
              value={data?.isblocked ? "Yes" : "No"} 
              valueClassName={data?.isblocked ? "text-red-600" : "text-green-600"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  valueClassName
}: {
  icon: React.ComponentType<any>;
  label: string;
  value?: string | number | null;
  valueClassName?: string;
}) {
  const displayValue = value === null || value === undefined || value === "" 
    ? "Not provided" 
    : String(value);
  
  const isNotProvided = displayValue === "Not provided";

  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={cn(
          "text-sm",
          isNotProvided ? "text-gray-400 italic" : valueClassName
        )}>
          {displayValue}
        </p>
      </div>
    </div>
  );
}