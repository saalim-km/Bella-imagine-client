
import { CommunityResponse } from "@/types/interfaces/Community";
import { CommunityCard } from "./CommunityCard";

interface CommunityGridProps {
  communities: CommunityResponse[];
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