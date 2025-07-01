import { User, Users, Info } from "lucide-react";
import { Community, CommunityResponse } from "@/types/interfaces/Community";

interface CommunityHeaderProps {
  community: CommunityResponse;
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <div className="relative mb-8">
      <div className="h-40 md:h-60 w-full overflow-hidden relative z-0">
        <img
          src={
            community.coverImage ||
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?fit=crop&w=1200&h=300"
          }
          alt={community.name}
          className="w-full h-full object-cover"
        />
        {/* Dimming Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Content Section - with higher z-index */}
      <div className=" relative z-10 mt-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-8 md:-mt-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-background rounded-full p-1 shadow-lg">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center text-xl md:text-3xl font-bold overflow-hidden">
                {community.coverImage ? (
                  <img
                    src={community.iconImage}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  community.name.charAt(0)
                )}
              </div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg md:bg-transparent md:p-0 md:backdrop-blur-none">
              <h1 className="text-2xl md:text-3xl font-bold">
                {community.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{community.memberCount!.toLocaleString()} members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
