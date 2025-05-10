import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutTabProps {
  communityName: string;
  description: string;
  memberCount: number;
  postCount: number;
  isMember: boolean;
  communityId: string;
  rules: string[];
  createdAt: string;
}

export function AboutTab({
  communityName,
  description,
  memberCount,
  postCount,
  isMember,
  createdAt,
  communityId,
  rules,
}: AboutTabProps) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">About {communityName}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Created
              </h3>
              <p>
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Members
              </h3>
              <p>{memberCount.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Posts
              </h3>
              <p>{postCount}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-3">Community Rules</h3>
            <ul className="space-y-2">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="font-medium mr-2">{index + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isMember && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/communities/${communityId}/settings`}>
              <Settings className="h-4 w-4 mr-2" /> Community Settings
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
