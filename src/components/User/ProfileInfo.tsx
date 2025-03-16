import { IProfileInfo } from "@/types/User";
import {
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  UserCheck,
} from "lucide-react";
import moment from "moment";

interface ProfileInfoProps {
  data : IProfileInfo
}

export function ProfileInfo({ data }: ProfileInfoProps) {
  const isVendor = "vendorId" in data;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem icon={UserCheck} label="Full Name" value={data?.name} />
        <InfoItem icon={Mail} label="Email" value={data?.email} />
        <InfoItem icon={Phone} label="Phone" value={data?.phoneNumber?.toString()} />
        <InfoItem icon={Briefcase} label="Status" value={data?.isActive ? "Active" : "Inactive"} />
        <InfoItem
          icon={CalendarDays}
          label="Joined"
          value={data?.createdAt ? moment(data.createdAt).format("MMMM DD, YYYY") : "N/A"}
        />
        <InfoItem icon={MapPin} label="Location" value={data?.location} />
      </div>

      {/* Vendor-Specific Info */}
      {isVendor && (
        <div className="mt-4 grid gap-2">
          <h3 className="font-semibold mb-2">Vendor Details</h3>
          <InfoItem icon={UserCheck} label="Vendor ID" value={data.vendorId} />
          <InfoItem icon={Mail} label="Portfolio" value={data.portfolioWebsite} />
          <InfoItem icon={CalendarDays} label="Languages I speak" value={data.languages?.join(", ")} />
          <InfoItem icon={Briefcase} label="Categories" value={data.categories?.join(", ")} />
          <InfoItem icon={UserCheck} label="Verified" value={data.isVerified ? "Yes" : "No"} />
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Additional Info</h3>
        <InfoItem icon={Briefcase} label="Blocked" value={data?.isblocked ? "Yes" : "No"} />
      </div>
    </div>
  );
}


function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{label}:</span>
      <span>{value || "N/A"}</span>
    </div>
  );
}
