import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Image, X } from "lucide-react";
import { useAllClientCategories } from "@/hooks/client/useClient";
import { Category } from "@/services/categories/categoryService";
import { uploadToCloudinary } from "@/utils/upload-cloudinary/cloudinary";
import { useAllClientContestQuery } from "@/hooks/contest/useContest";
import { toast } from "sonner";

const UploadPhoto = () => {
  
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [contest, setContest] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile , setImageFile] = useState<File>()
  const [uploading, setUploading] = useState(false);

  const {data : clientCategories } = useAllClientCategories()
  const categories : Category[] = clientCategories?.data || []
  
  const {data : clientContest} = useAllClientContestQuery({status: "",search : ""});
  const contests = clientContest?.data || []
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file)
    console.log(file);
    if (file) {

      if(!file.type) {
        toast.error('Image type is not supported.')
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("Please upload an image smaller than 10MB.")
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearImage = () => {
    setImagePreview(null);
    setImageFile(undefined)
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please provide a title for your photo.")
      return;
    }
    
    if (!imagePreview || !imageFile) {
      toast.error("Please upload an image.")
      return;
    }
    
    setUploading(true);


    const imageUrl = await uploadToCloudinary(imageFile)
    const data = {
        title : title,
        caption : caption,
        category : category,
        contest : contest,
        image : imageUrl
    }
    console.log('got the data : ',data);
    console.log(imageUrl);
  };
  
  return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Photo</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Share your best shot</CardTitle>
            <CardDescription>
              Upload a photo to share with the Bella Imagine community. You can also enter it into a contest.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                {imagePreview ? (
                  <div className="relative rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-[400px] w-full object-contain bg-black/5"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Label htmlFor="photo" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Image className="h-10 w-10 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Click to upload
                        </span>
                        <span className="text-xs text-muted-foreground">
                          JPG, PNG, GIF up to 10MB
                        </span>
                      </div>
                    </Label>
                  </div>
                )}
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your photo a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="Tell the story behind your photo"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Contest */}
              <div className="space-y-2">
                <Label htmlFor="contest">Contest (optional)</Label>
                <Select value={contest} onValueChange={setContest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Enter a contest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {contests.map((c) => (
                      <SelectItem key={c._id} value={c._id || ''}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? (
                  <>
                    <span className="animate-pulse">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
  );
};

export default UploadPhoto;