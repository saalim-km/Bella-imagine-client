import type React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Upload, ImageIcon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useCreatePost,
  useGetAllCommunities,
} from "@/hooks/community-contest/useCommunity";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { CreatePostInput } from "@/services/community-contest/communityService";
import { communityToast } from "../ui/community-toast";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addPost } from "@/store/slices/feedslice";

interface CreatePostFormProps {
  communityId?: string;
  onSuccess?: () => void;
}

export function CreatePostForm({
  communityId,
  onSuccess,
}: CreatePostFormProps) {
  const { data: communitiesData } = useGetAllCommunities({
    limit: 1000,
    page: 1,
    membership: "member",
  });
  const { mutate: createPost } = useCreatePost();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [communityError, setCommunityError] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(communityId || "");
  const [postType, setPostType] = useState<"text" | "image">("text");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const queryClient = useQueryClient();
  const dispatch = useDispatch()

  const communities = communitiesData?.data?.data || [];

  const MAX_MEDIA = 4;
  const MAX_TITLE_LENGTH = 300;
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

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

    setMedia((prev) => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
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

    // Community validation
    if (!selectedCommunity) {
      setCommunityError("Please select a community");
      communityToast.error({
        title: "Select a community",
        description: "Please select a community to create post",
      });
      isValid = false;
    } else {
      setCommunityError("");
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("communityId", selectedCommunity);
      // Determine mediaType based on uploaded files
      let mediaType: "image" | "video" | "mixed" | "none" = "none";
      if (media.length > 0) {
        const hasImages = media.some((file) => file.type.startsWith("image/"));
        const hasVideos = media.some((file) => file.type.startsWith("video/"));

        if (hasImages && hasVideos) {
          mediaType = "mixed";
        } else if (hasImages) {
          mediaType = "image";
        } else if (hasVideos) {
          mediaType = "video";
        }
      }
      formData.append("mediaType", mediaType);

      media.forEach((file) => formData.append("media", file));

      tags.forEach((tag) => formData.append("tags", tag));

      createPost(formData as unknown as CreatePostInput, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["community-post"] });
          communityToast.success({ title: "Post created successfully!" });
          dispatch(addPost(data.data))
          navigate(-1);
        },
      });
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Create a post
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Share your thoughts with the community
        </p>
      </div>

      <Card>
        <CardHeader className="border-b bg-background">
          <div className="space-y-4">
            {/* Community Selection */}
            {communities.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Join a community to post.
              </div>
            ) : (
              <div>
                <Label className="text-sm font-medium">
                  Choose a community <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCommunity}
                  onValueChange={(value) => {
                    setSelectedCommunity(value);
                    setCommunityError("");
                  }}
                >
                  <SelectTrigger
                    className={`w-full mt-1 py-6 ${
                      communityError ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Search for a community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community._id} value={community._id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={community.iconImage}
                              alt={`${community.name}`}
                              className="object-cover w-full h-full rounded-full"
                            />
                            <AvatarFallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full">
                              {community.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{community.name}</p>
                            <p className="text-xs text-gray-500">
                              {community.memberCount} members
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {communityError && (
                  <p className="text-red-500 text-sm mt-1">{communityError}</p>
                )}
              </div>
            )}

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
          <CardContent className="p-6 space-y-6 bg-background">
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
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="w-full h-32 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md border">
                              <span className="text-sm text-gray-500">
                                Video file
                              </span>
                            </div>
                          )}
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

          <div className="flex justify-between items-center border-t p-6 bg-background">
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
                !selectedCommunity ||
                (postType === "text" && !content.trim())
              }
              className="min-w-[100px]"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
