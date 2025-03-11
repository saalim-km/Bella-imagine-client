import { IClient } from "@/services/client/clientService";
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
  data?: IClient;
}

export function ProfileInfo({ data }: ProfileInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem icon={UserCheck} label="Full Name" value={data?.name} />
        <InfoItem icon={Mail} label="Email" value={data?.email} />
        <InfoItem icon={Phone} label="Phone" value={data?.phoneNumber?.toString()} />
        <InfoItem
          icon={Briefcase}
          label="Status"
          value={data?.isActive ? "Active" : "Inactive"}
        />
        <InfoItem
          icon={CalendarDays}
          label="Joined"
          value={data?.createdAt ? moment(data.createdAt).format("MMMM DD, YYYY") : "N/A"}
        />
        <InfoItem icon={MapPin} label="Location" value={data?.location} />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Additional Info</h3>
        <InfoItem
          icon={Briefcase}
          label="Blocked"
          value={data?.isblocked ? "Yes" : "No"}
        />
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
