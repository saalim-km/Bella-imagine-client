// import { Client } from "@/services/client/clientService";
import {
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  UserCheck,
} from "lucide-react";
import moment from "moment";

// interface ProfileInfoProps {
//   data ? : Client;
// }

export function ProfileInfo({ data } : {data ?: any}) {
  return (
    <div className="space-y-4 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoItem
          icon={UserCheck}
          label="Full Name"
          value={`salim`}
        />
        <InfoItem icon={Mail} label="Email" value={'saalimkm@gmail.com'} />
        <InfoItem icon={Phone} label="Phone" value={'11111111111'} />
        <InfoItem icon={Briefcase} label="Status" value={'active'} />
        <InfoItem
          icon={CalendarDays}
          label="Joined"
          value={'april 15'}
        />
        <InfoItem icon={MapPin} label="Location" value="N/A" />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Additional Info</h3>
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
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{label}:</span>
      <span>{value || "N/A"}</span>
    </div>
  );
}
