import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Upload, Tag as TagIcon, Loader2, Check, Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { IPostRequest } from "@/types/Community";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCloudinary } from "@/hooks/cloudinary/useCloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/utils/upload-cloudinary/cloudinary";

interface CreatePostFormProps {
  communityId: string;
  communityName: string;
  onSuccess?: (post: IPostRequest) => void;
}

export function CreatePostForm({ communityId, communityName, onSuccess }: CreatePostFormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { openWidget, isReady } = useCloudinary(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    },
    (results) => {
      const urls = results.map(res => res.info.secure_url);
      setImageUrls(prev => [...prev, ...urls]);
    }
  );

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmed = currentTag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags(prev => [...prev, trimmed]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const isFormValid = () => title.trim() !== "";

  const passesModeration = (text: string): boolean => {
    // Placeholder for future AI moderation
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return toast.error("Title is required.");

    if (!passesModeration(content)) {
      toast.error("Your content failed moderation.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost: IPostRequest = {
        _id: `post-${Date.now()}`,
        title,
        content,
        media: imageUrls.length > 0 ? imageUrls : undefined,
        userId: "user",
        communityId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        voteUpCount: 0,
        voteDownCount: 0,
        commentCount: 0,
        tags: tags.length > 0 ? tags : undefined,
      };

      console.log(newPost);
      onSuccess?.(newPost);
      toast.success("Post created!");
      navigate(-1);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-8xl mx-auto border shadow-sm  animate-fade-in mt-14">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">Create a Post</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Posting in <span className="font-medium">{communityName}</span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your post title"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts with the community"
              disabled={isSubmitting}
            />
          </div>

          {/* Cloudinary Upload */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex flex-wrap gap-4">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Uploaded ${idx}`}
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1  p-1 rounded-full shadow text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button type="button" onClick={openWidget} disabled={!isReady || isSubmitting}>
              <Upload className="h-4 w-4 mr-2" />
              Upload media
            </Button>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagKey}
                disabled={isSubmitting}
              />
              <Button type="button" onClick={addTag} size="sm" disabled={isSubmitting}>
                <TagIcon className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} className="flex items-center gap-1 px-2 py-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter or click Add to insert tag (max 5).
            </p>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/30 px-6 py-4 flex gap-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="ml-auto"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Posting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
