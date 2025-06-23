import { Button } from "@/components/ui/button";
import { Bookmark, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LeftSidebar: React.FC = () => {
  const navigate  = useNavigate()
  return (
    <div className="w-60   border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen py-4 px-2 hidden md:block">
      <div className="space-y-2 flex flex-col">
        <div className="px-2 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Communities
        </div>
        
        <CommunityItem name="r/photography" members="4.2m" />
        <CommunityItem name="r/portraits" members="1.1m" />
        <CommunityItem name="r/landscape" members="850k" />
        <CommunityItem name="r/streetphotography" members="620k" />
        <CommunityItem name="r/weddingphotography" members="320k" />

        <Button variant={'outline'} onClick={()=> navigate('/communities')}>
          Explore communities
        </Button>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
          <Link 
            to="/profile" 
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved Posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CommunityItem: React.FC<{ name: string; members: string }> = ({ name, members }) => {
  return (
    <a 
      href={`/r/${name.substring(2)}`} 
      className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
          {name.charAt(1)}
        </div>
        <span>{name}</span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{members}</span>
    </a>
  );
};

export default LeftSidebar
