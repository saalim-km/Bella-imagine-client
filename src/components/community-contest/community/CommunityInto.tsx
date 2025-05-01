import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityInfoProps {
  communityId: string;
  description: string;
  memberCount: number;
  createdAt: string;
  isMember: boolean;
  isJoining: boolean;
  isLeaving : boolean;
  onJoinToggle: (communityId: string) => void;
  onLeaveToggle: (communityId: string) => void;
}

export function CommunityInfo({
  description,
  memberCount,
  isMember,
  createdAt,
  isJoining,
  isLeaving,
  communityId,
  onJoinToggle,
  onLeaveToggle
}: CommunityInfoProps) {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 mb-4">
      <h3 className="font-medium mb-2 flex items-center">
        <Info className="h-4 w-4 mr-2" /> About Community
      </h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="text-sm">
        <div className="flex justify-between py-1.5 border-t">
          <span>Created</span>
          <span>
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-t">
          <span>Members</span>
          <span>{memberCount.toLocaleString()}</span>
        </div>
      </div>
      {!isMember ? (
        <Button
          className="w-full mt-3"
          variant="default"
          onClick={() => onJoinToggle(communityId)}
          disabled={isJoining}
        >
          {isJoining ? "Processing..." : "Join Community"}
        </Button>
      ) : (
        <Button
          className="w-full mt-3"
          variant="outline"
          onClick={() => onLeaveToggle(communityId)}
          disabled={isLeaving}
        >
          {isLeaving ? "Processing..." : "Leave Community"}
        </Button>
      )}{" "}
    </div>
  );
}
