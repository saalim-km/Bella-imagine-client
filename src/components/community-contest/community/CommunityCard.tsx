
import { useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Community } from "@/types/Community";


interface CommunityCardProps {
  community: Community;
  className?: string;
}

export function CommunityCard({ community, className }: CommunityCardProps) {
  const [memberCount, setMemberCount] = useState(community.memberCount);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsJoining(true);

  };

  return (
    <Card className={cn("hover-lift overflow-hidden h-full flex flex-col", className)}>
      <Link to={`/community/${community.slug}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={community.coverImage || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?fit=crop&w=600&h=300"}
            alt={community.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onLoad={(e) => e.currentTarget.classList.remove("image-loading")}
            onError={(e) => {
              e.currentTarget.classList.remove("image-loading");
              e.currentTarget.src = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?fit=crop&w=600&h=300";
            }}
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold line-clamp-1">{community.name}</h3>
          </div>
        </CardHeader>
      </Link>
      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-2">{community.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>{memberCount?.toLocaleString()} members</span>
        </div>
        <Button 
          size="sm" 
          variant={"outline"}
          onClick={handleJoinToggle}
          disabled={isJoining}
        >
          {"Join"}
        </Button>
      </CardFooter>
    </Card>
  );
}
