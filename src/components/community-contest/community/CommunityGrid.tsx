
import { Community } from "@/types/Community";
import { CommunityCard } from "./CommunityCard";

interface CommunityGridProps {
  communities: Community[];
}

export function CommunityGrid({ communities }: CommunityGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {communities.map((community) => (
        <CommunityCard key={community._id} community={community} />
      ))}
    </div>
  );
}
