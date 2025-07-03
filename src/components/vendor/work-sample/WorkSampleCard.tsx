import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Image as ImageIcon } from "lucide-react";
import { IWorkSampleResponse } from "@/types/interfaces/vendor";

interface WorkSampleCardProps {
  workSample: IWorkSampleResponse;
  onEdit: () => void;
  onDelete: () => void;
}

const WorkSampleCard = ({
  workSample,
  onEdit,
  onDelete,
}: WorkSampleCardProps) => {
  const dateCreated = new Date(workSample.createdAt).toLocaleDateString();

return (
  <Card className="shadow-none h-full flex flex-col relative"> {/* Added relative here */}
    {/* Status Badge - now properly positioned */}
    <div className="absolute top-3 right-3 z-10"> {/* Added z-10 to ensure it stays on top */}
      <Badge
        variant="outline"
        className={`text-xs font-medium ${
          workSample.isPublished
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-yellow-100 text-yellow-800 border-yellow-200"
        }`}
      >
        {workSample.isPublished ? "Published" : "Draft"}
      </Badge>
    </div>

    {/* Media Gallery */}
    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
      {workSample.media.length > 0 ? (
        <img
          src={workSample.media[0]}
          alt={workSample.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </div>
      )}
      {workSample.media.length > 1 && (
        <Badge variant="secondary" className="absolute bottom-2 right-2">
          +{workSample.media.length - 1} more
        </Badge>
      )}
    </div>

    <CardHeader className="pb-2">
      <CardTitle className="text-lg line-clamp-2">
        {workSample.title}
      </CardTitle>
      {workSample.service && (
        <div className="flex items-center text-sm text-muted-foreground">
          <span>For: </span>
          <Badge variant="outline" className="ml-1 text-xs">
            {workSample.service.serviceTitle || "Unspecified Service"}
          </Badge>
        </div>
      )}
    </CardHeader>

    <CardContent className="flex-grow space-y-3">
      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-3">
        {workSample.description || "No description available"}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{dateCreated}</span>
        </div>
      </div>

      {/* Tags */}
      {workSample.tags && workSample.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {workSample.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {workSample.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{workSample.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </CardContent>

    <CardFooter className="flex justify-between pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="flex-1 mr-2"
      >
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex-1"
      >
        Delete
      </Button>
    </CardFooter>
  </Card>
);
};

export default WorkSampleCard;
