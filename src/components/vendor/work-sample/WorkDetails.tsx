import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IWorkSampleResponse } from "@/types/interfaces/vendor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface WorkSampleDetailsProps {
  workSample: IWorkSampleResponse;
}

const WorkSampleDetails = ({ workSample }: WorkSampleDetailsProps) => {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader className="relative">
          <CardTitle className="text-2xl">{workSample.title}</CardTitle>
          <Badge
            variant="outline"
            className={`
              absolute top-4 right-4
              ${workSample.isPublished 
                ? "bg-green-500 text-white border-green-600" 
                : "bg-yellow-300 text-gray-800 border-yellow-400"
              }
            `}
          >
            {workSample.isPublished ? "Published" : "Draft"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Media Carousel */}
          {workSample.media.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {workSample.media.map((mediaItem, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      {mediaItem.type === "image" ? (
                        <img
                          src={mediaItem.url}
                          alt={`${workSample.title} - Media ${index + 1}`}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={mediaItem.url}
                          controls
                          className="w-full h-96 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No Media Available</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {workSample.description || "No description provided."}
            </p>
          </div>

          {/* Service and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Service</h3>
              <p>{workSample?.service ? workSample?.service.serviceTitle : "N/A"}</p>
              {/* Note: Replace with actual service title if populated */}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {workSample.tags?.length ? (
                  workSample.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No tags</span>
                )}
              </div>
            </div>
          </div>

          {/* Likes and Comments */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Engagement</h3>
            <p>Likes: {workSample.likes?.length}</p>
            <Separator className="my-4" />
            <h4 className="font-semibold mb-2">Comments</h4>
            {(workSample.comments ?? []).length > 0 ? (
              <ScrollArea className="h-40 w-full rounded-md border p-4">
                {(workSample.comments ?? []).map((comment, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm font-medium">
                      User {/* Replace with actual user name if populated */}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {comment.text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">No comments yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkSampleDetails;