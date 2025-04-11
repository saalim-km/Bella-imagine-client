import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, Heart, MessageSquare, Play } from "lucide-react";
import { IWorkSampleResponse } from "@/types/vendor";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Use shadcn dialog for consistency
import { format } from "date-fns";

interface WorkSampleProps {
  workSample: IWorkSampleResponse;
}

const WorkSampleMinimal = ({ workSample }: WorkSampleProps) => {
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = (sampleId: string) => {
    setIsLiked(!isLiked);
    console.log("Toggling like for:", sampleId);
    // Add actual like toggle logic here (e.g., API call)
  };

  const handleMediaClick = (index: number) => {
    setInitialSlideIndex(index);
  };

  const getLikeCount = (sample: IWorkSampleResponse): number => sample.likes?.length || 0;
  const getCommentCount = (sample: IWorkSampleResponse): number => sample.comments?.length || 0;

  return (
    <Dialog>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">{workSample.title}</h2>

        {workSample.description && (
          <p className="text-muted-foreground mb-4 max-w-prose">
            {workSample.description}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {workSample.media.map((media, index) => (
            <DialogTrigger
              asChild
              key={`${media.url}-${index}`} // Ensure unique key
              onClick={() => handleMediaClick(index)}
            >
              <button
                type="button"
                className="rounded-md overflow-hidden cursor-pointer relative group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <AspectRatio ratio={1 / 1} className="bg-muted">
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={`${workSample.title} - media ${index + 1}`}
                      className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 relative">
                      <Play
                        size={32}
                        className="text-gray-600 dark:text-gray-400 transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                      <span className="sr-only">Play video</span>
                      <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={40} className="text-white opacity-80" fill="white" />
                      </div>
                    </div>
                  )}
                </AspectRatio>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </button>
            </DialogTrigger>
          ))}
        </div>
      </div>

      <DialogContent className="max-w-3xl lg:max-w-5xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{workSample.title}</DialogTitle>
          {workSample.description && (
            <p className="text-muted-foreground">{workSample.description}</p>
          )}
        </DialogHeader>

        <div className="flex-grow min-h-0">
          <Carousel
            opts={{ loop: workSample.media.length > 1, startIndex: initialSlideIndex }}
            className="w-full h-full flex flex-col"
          >
            <CarouselContent className="flex-grow items-center">
              {workSample.media.map((media, index) => (
                <CarouselItem
                  key={`${media.url}-dialog-${index}`}
                  className="flex items-center justify-center"
                >
                  <div className="w-full max-h-[65vh] flex items-center justify-center">
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt={`${workSample.title} - image ${index + 1}`}
                        className="object-contain w-auto h-auto max-w-full max-h-full rounded-md"
                      />
                    ) : (
                      <div className="relative w-full aspect-video bg-black flex items-center justify-center rounded-md overflow-hidden">
                        <video controls className="w-full h-full" preload="metadata">
                          <source src={media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {workSample.media.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90" />
              </>
            )}
          </Carousel>
        </div>

        <div className="flex-shrink-0 flex justify-between items-center text-sm text-muted-foreground pt-4 mt-auto border-t">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{format(new Date(workSample.createdAt), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeToggle(workSample._id || "")}
              className="flex items-center gap-1 px-2 h-auto"
            >
              <Heart
                size={16}
                className={`transition-colors ${isLiked ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`}
              />
              <span>{getLikeCount(workSample)}</span>
            </Button>
            <div className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>{getCommentCount(workSample)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkSampleMinimal;