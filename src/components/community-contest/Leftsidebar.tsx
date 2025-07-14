import { Button } from "@/components/ui/button";
import { CommunityResponse } from "@/types/interfaces/Community";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface LeftSideBarProps {
  communities: CommunityResponse[];
}

const LeftSidebar: React.FC<LeftSideBarProps> = ({ communities }) => {
  const navigate = useNavigate();
  console.log("got the communities in the leftsidebar : ", communities);
  return (
    <div className="w-80   border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen py-4 px-2 hidden md:block">
      <div className="space-y-2 flex flex-col">
        <div className="px-2 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Communities
        </div>

        {communities && (
          <>
            {communities.map((community) => {
              return (
                <CommunityItem
                  slug={community.slug || ""}
                  name={community.name}
                  members={community.memberCount || 0}
                  iconImage={community.iconImage || ""}
                />
              );
            })}
          </>
        )}

        <Button variant={"outline"} onClick={() => navigate("/communities")}>
          Explore communities
        </Button>
      </div>
    </div>
  );
};

const CommunityItem: React.FC<{
  name: string;
  members: number;
  iconImage: string;
  slug: string;
}> = ({ name, members, iconImage, slug }) => {
  return (
    <Link
      to={`/community/${slug}`}
      className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="flex items-center space-x-2">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={iconImage}
            alt={`${name}`}
            className="object-cover w-full h-full rounded-full"
          />
          <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-gray-500">{members} members</p>
        </div>
      </div>
    </Link>
  );
};

export default LeftSidebar;
