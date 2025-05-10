
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Post } from "@/types/Community";

interface PhotosTabProps {
  posts: Post[];
  isMember: boolean;
  onCreatePost: () => void;
}

export function PhotosTab({ posts, isMember, onCreatePost }: PhotosTabProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const postsWithImages = posts.filter(post => post.images && post.images.length > 0);
  const allImages = postsWithImages.flatMap(post => post.images || []);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allImages
          .slice(0, 12)
          .map((image, idx) => (
            <div 
              key={idx} 
              className="aspect-square overflow-hidden rounded-md cursor-pointer"
              onClick={() => handleImageClick(image)}
            >
              <img 
                src={image} 
                alt="Community photo" 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-200" 
              />
            </div>
          ))}
        {postsWithImages.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-10 text-center bg-secondary/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No photos yet</h3>
            <p className="text-muted-foreground mb-4">
              Share your photography with this community
            </p>
            <Button onClick={onCreatePost} disabled={!isMember}>
              <Plus className="mr-2 h-4 w-4" /> Add Photos
            </Button>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-screen-md p-0 overflow-hidden bg-transparent border-none">
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-background/20 backdrop-blur-sm hover:bg-background/40"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={selectedImage || ""}
              alt="Full size"
              className="max-h-[80vh] max-w-full object-contain rounded-md"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
