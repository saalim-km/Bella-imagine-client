import React, { useState } from "react";
import { 
  CalendarDays, 
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
import { useThemeConstants } from "@/utils/theme/theme.utils";
import { Button } from "../ui/button";
import { IVendor } from "@/services/vendor/vendorService";
import { IClient } from "@/services/client/clientService";

interface Category {
  id?: string;
  title?: string;
}

type VerificationStatus = "accept" | "reject" | "pending";

type IProfileInfo = Partial<IVendor | IClient>

interface ProfileInfoProps {
  data: IProfileInfo;
  className?: string;
}

export function ProfileInfo({ data, className }: ProfileInfoProps) {
  const [showDocs,setisShowDocs] = useState(false)
  const {textColor} = useThemeConstants()
  const isVendor = "vendorId" in data && data.vendorId;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  
  // Format creation date
  const formattedDate = data?.createdAt 
    ? format(new Date(data.createdAt), "MMMM dd, yyyy")
    : null;

  return (
    <div className={`space-y-6 }`}>
      {/* General Information */}
      <section className="rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <h2 className="text-base font-medium mb-4 ">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <InfoItem icon={UserCheck} label="Full Name" value={data?.name} />
          <InfoItem icon={Mail} label="Email" value={data?.email} />
          <InfoItem icon={Phone} label="Phone" value={data?.phoneNumber?.toString()} />
          <InfoItem 
            icon={Briefcase} 
            label="Status" 
            value={data?.isActive ? "Active" : "Inactive"} 
            valueClassName={data?.isActive ? "text-status-active font-medium" : "text-status-inactive font-medium"}
          />
          <InfoItem icon={CalendarDays} label="Joined" value={formattedDate} />
          <InfoItem icon={MapPin} label="Location" value={data?.location?.address} />
        </div>
      </section>

      {/* Vendor-Specific Information */}
      {isVendor && (
        <section className=" rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
          <h2 className="text-base font-medium mb-4 ">Vendor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <InfoItem icon={UserCheck} label="Vendor ID" value={data.vendorId} />
            <InfoItem icon={Globe} label="Portfolio" value={data.portfolioWebsite} />
            <InfoItem icon={Languages} label="Languages" value={data.languages?.join(", ")} />
            
            {/* Verification Status */}
            <div className="flex items-center gap-2 py-2 px-1 rounded-lg transition-all duration-300 ">
              <div className="flex items-center justify-center w-8 h-8 rounded-full ">
                <UserCheck className="h-4 w-4 " />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm ">Verification</span>
                <div className="mt-1">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      data.isVerified === "accept"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : data.isVerified === "reject"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    )}
                  >
                    {data.isVerified === "accept"
                      ? "Verified"
                      : data.isVerified === "reject"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Show Docs Button and Documents */}
          {isVendor && (
            <>
              <Button 
                onClick={() => setisShowDocs(!showDocs)} 
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 mt-2"
              >
                {showDocs ? "Hide Docs" : "Show Docs"}
              </Button>
              {showDocs && data.verificationDocument && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <img 
                      src={data.verificationDocument} 
                      className="w-full h-auto  object-cover rounded-md shadow-sm"
                    />
                </div>
              )}
            </>
          )}

          {/* Description */}
          {data.description && (
            <div className="mt-4">
              <div 
                className="flex items-center justify-between cursor-pointer py-2"
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 " />
                  <span className="font-medium text-sm ">Description</span>
                </div>
                {isDescriptionOpen ? (
                  <ChevronUp className="h-4 w-4 " />
                ) : (
                  <ChevronDown className="h-4 w-4 " />
                )}
              </div>
              {isDescriptionOpen && (
                <div className="mt-2 text-sm p-3 rounded-md">
                  {data.description}
                </div>
              )}
            </div>
          )}

          {/* Categories */}
          {data.categories && data.categories.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 py-2">
                <Briefcase className="h-4 w-4 " />
                <span className="font-medium text-sm ">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {data.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {category?.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Additional Info */}
      <section className=" rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <h2 className="text-base font-medium mb-4 ">Additional Information</h2>
        <InfoItem 
          icon={Briefcase} 
          label="Blocked" 
          value={data?.isblocked ? "Yes" : "No"} 
          valueClassName={!data?.isblocked ? "text-status-active font-medium" : "text-status-inactive font-medium"} 
        />
      </section>
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
    <div className="flex items-center gap-2 py-2 px-1 rounded-lg transition-all duration-300 ">
      <div className="flex items-center justify-center w-8 h-8 rounded-full ">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-sm ">{label}</span>
        <span className={cn(
          "font-normal ",
          isNotProvided && "  italic text-sm",
          valueClassName
        )}>
          {displayValue}
        </span>
      </div>
    </div>
  );
}