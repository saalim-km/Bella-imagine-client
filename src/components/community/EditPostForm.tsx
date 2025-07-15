import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Upload, ImageIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { communityToast } from "../ui/community-toast";
import { PostDetailsResponse } from "@/types/interfaces/Community";
import {
  editPostServiceClient,
  editPostServiceVendor,
} from "@/services/community/communityService";
import { useEditPost } from "@/hooks/community/useCommunity";
import { useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/utils/Error/error-handler.utils";

interface MediaItem {
  url: string;
  file?: File;
  isNew?: boolean;
  s3Key?: string;
}

interface EditPostFormProps {
  onSuccess?: () => void;
  post: PostDetailsResponse;
  user: {
    _id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export function EditPostForm({ onSuccess, user, post }: EditPostFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [postType, setPostType] = useState<"text" | "image">(
    post.media.length > 0 ? "image" : "text"
  );
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const queryCLient = useQueryClient()
  const mutateFn =
    user.role == "client" ? editPostServiceClient : editPostServiceVendor;
  const { mutate: editPost, isPending } = useEditPost(mutateFn);
  const MAX_MEDIA = 4;
  const MAX_TITLE_LENGTH = 300;
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  // Helper function to extract S3 key from URL
  const extractS3KeyFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.startsWith("/")
        ? urlObj.pathname.substring(1)
        : urlObj.pathname;
    } catch {
      return url; // Return as-is if not a valid URL
    }
  };

  // Initialize media state with existing post media
  useEffect(() => {
    if (post.media && post.media.length > 0) {
      setMedia(
        post.media.map((url) => ({
          url,
          s3Key: extractS3KeyFromUrl(url),
          isNew: false,
        }))
      );
    }
  }, [post.media]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Validate number of files
    if (media.length + files.length > MAX_MEDIA) {
      communityToast.error({
        title: `You can upload a maximum of ${MAX_MEDIA} files`,
      });
      return;
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.match(/(image\/.*|video\/.*)/)) {
        communityToast.error({
          title: `File ${file.name} is not an image or video`,
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        communityToast.error({
          title: `File ${file.name} exceeds maximum size of 100MB`,
        });
        return;
      }
    }

    // Add new files to media state
    const newMediaItems = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    setMedia((prev) => [...prev, ...newMediaItems]);
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => {
      const newMedia = [...prev];
      const removedItem = newMedia.splice(index, 1)[0];

      // Revoke object URL if it's a new file
      if (removedItem.file && removedItem.url.startsWith("blob:")) {
        URL.revokeObjectURL(removedItem.url);
      }

      return newMedia;
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const validateForm = () => {
    let isValid = true;

    // Title validation
    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
      isValid = false;
    } else {
      setTitleError("");
    }

    // Content validation for text posts
    if (postType === "text" && !content.trim()) {
      setContentError("Content is required for text posts");
      isValid = false;
    } else {
      setContentError("");
    }

    // Media validation for image posts
    if (postType === "image" && media.length === 0) {
      communityToast.error({
        title: "Please upload at least one image or video",
      });
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare the data to be logged
      const formData = {
        _id: post._id,
        title,
        content,
        tags,
        existingImageKeys: media
          .filter((item) => !item.isNew && item.s3Key)
          .map((item) => item.s3Key!),
        deletedImageKeys: post.media
          .map(extractS3KeyFromUrl)
          .filter((key) => !media.some((item) => item.s3Key === key)),
        newImages: media
          .filter((item) => item.isNew && item.file)
          .map((item) => item.file!),
      };

      editPost(formData, {
        onSuccess: (data) => {
          queryCLient.invalidateQueries({queryKey : ['user_posts']})
          communityToast.success({
            title: data.message,
            description: "Post has been updated successfully",
          });
          navigate(-1);
        },
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      handleError(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      media.forEach((item) => {
        if (item.file && item.url.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [media]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Edit Post
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Update your post content
        </p>
      </div>

      <Card className="bg-background">
        <CardHeader className="border-b">
          <div className="space-y-4">
            {/* Post Type Tabs */}
            <Tabs
              value={postType}
              onValueChange={(value) => setPostType(value as typeof postType)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="text"
                  className="flex items-center space-x-2"
                >
                  <Type className="h-4 w-4" />
                  <span>Post</span>
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="flex items-center space-x-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Images & Video</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError("");
                }}
                placeholder="An interesting title"
                className={`mt-1 ${titleError ? "border-red-500" : ""}`}
                maxLength={MAX_TITLE_LENGTH}
              />
              <div className="flex justify-between items-center mt-1">
                {titleError && (
                  <p className="text-red-500 text-sm">{titleError}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {title.length}/{MAX_TITLE_LENGTH}
                </p>
              </div>
            </div>

            {/* Content based on post type */}
            {postType === "text" && (
              <div>
                <Label className="text-sm font-medium">
                  Text <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (contentError) setContentError("");
                  }}
                  placeholder="What are your thoughts?"
                  className={`min-h-[200px] mt-1 ${
                    contentError ? "border-red-500" : ""
                  }`}
                />
                {contentError && (
                  <p className="text-red-500 text-sm mt-1">{contentError}</p>
                )}
              </div>
            )}

            {postType === "image" && (
              <div>
                <Label className="text-sm font-medium">Images & Video</Label>
                {media.length > 0 ? (
                  <div className="mt-2 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {media.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={file.url}
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMedia(index)}
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {media.length < MAX_MEDIA && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Add more ({MAX_MEDIA - media.length} remaining)
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    className="mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Drag and drop images or videos to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or click to browse • Up to {MAX_MEDIA} files • Max 100MB
                      each
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                />
              </div>
            )}

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags (optional)</Label>
              <div className="mt-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add a tag"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="flex justify-between items-center border-t p-6">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !title.trim() ||
                (postType === "text" && !content.trim()) ||
                (postType === "image" && media.length === 0) ||
                isPending
              }
              className="min-w-[100px]"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
