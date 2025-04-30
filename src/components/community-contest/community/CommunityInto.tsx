
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityInfoProps {
  description: string;
  memberCount: number;
  createdAt : string;
  isMember: boolean;
  isJoining: boolean;
  onJoinToggle: () => void;
}

export function CommunityInfo({
  description,
  memberCount,
  isMember,
  createdAt,
  isJoining,
  onJoinToggle,
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
          <span>{
            new Date(createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )
            }</span>
        </div>
        <div className="flex justify-between py-1.5 border-t">
          <span>Members</span>
          <span>{memberCount.toLocaleString()}</span>
        </div>
      </div>
      <Button 
        className="w-full mt-3" 
        variant={isMember ? "outline" : "default"}
        onClick={onJoinToggle}
        disabled={isJoining}
      >
        {isJoining ? "Processing..." : isMember ? "Leave Community" : "Join Community"}
      </Button>
    </div>
  );
}
