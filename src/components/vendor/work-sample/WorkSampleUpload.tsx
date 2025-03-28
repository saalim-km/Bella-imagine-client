import { useState, useEffect } from 'react';
import { useCloudinary } from '@/hooks/coudinary/useCloudinary';
import { toast } from 'sonner';
import TagInput from './TagInput';
import ImagePreview, { MediaItem } from "./ImagePreview"
import { 
  Upload, 
  Check, 
  Image as ImageIcon,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/utils/upload-cloudinary/cloudinary';
import { useVendorServices, useVendorWorkSampleUploadMutataion } from '@/hooks/vendor/useVendor';
import { IServiceResponse } from '@/types/vendor';
import { Spinner } from '@/components/ui/spinner';

// Types
interface Service {
  _id: string;
  serviceTitle: string;
}

interface WorkSampleFormData {
  service: string;
  vendor: string;
  title: string;
  description: string;
  media: MediaItem[];
  tags: string[];
  isPublished: boolean;
}

interface WorkSampleUploadProps {
  vendorId: string;
  handleCancelCreatingWorkSample() : void;
}

const WorkSampleUpload = ({ vendorId , handleCancelCreatingWorkSample}: WorkSampleUploadProps) => {
  const {mutate : createWorkSample} = useVendorWorkSampleUploadMutataion()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<WorkSampleFormData>({
    service: '',
    vendor: vendorId,
    title: '',
    description: '',
    media: [],
    tags: [],
    isPublished: false,
  });

    const { data , isLoading } = useVendorServices({page : 1 , limit : 20})
    const services : IServiceResponse[] = data?.data ?? [];
    console.log(services);
  
  const handleCloudinarySuccess = (results: any[]) => {
    const newMedia = results.map(result => ({
      url: result.info.secure_url,
      type: result.info.resource_type === 'video' ? 'video' as 'video' : 'image' as 'image',
      public_id: result.info.public_id
    }));
    
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, ...newMedia]
    }));
    
    toast(
     `${newMedia.length} file(s) uploaded successfully.`,
    );
  };
  const { openWidget, isReady: isCloudinaryReady , error : coudinaryErr } = useCloudinary(
    {
      cloudName: CLOUDINARY_CLOUD_NAME, 
      uploadPreset: CLOUDINARY_UPLOAD_PRESET, 
      cropping: true,
      croppingAspectRatio: 4/3,
      multiple: true,
      maxFiles: 10,
      resourceType: 'auto',
      clientAllowedFormats: ['image', 'video'],
      sources: ['local', 'url', 'camera', 'google_drive', 'dropbox','unsplash_ctadks'],
    },
    handleCloudinarySuccess
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };
  
  const handlePublishedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPublished: checked }));
  };
  
  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };
  
  const handleRemoveMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };
  
  const isFormValid = () => {
    return (
      formData.service.trim() !== '' &&
      formData.title.trim() !== '' &&
      formData.media.length > 0
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast(
         'Please fill in all required fields and upload at least one image.',
      );
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would be an API call
      console.log('Submitting work sample:', formData);
      createWorkSample(formData,{
        onSuccess : (data)=> {
            console.log(data);
        },
        onError : (err)=> {
            console.log(err);
        }
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast(
         'Work sample created successfully!',
      );
      
      // Reset form
      setFormData({
        service: '',
        vendor: vendorId,
        title: '',
        description: '',
        media: [],
        tags: [],
        isPublished: false,
      });
    } catch (error) {
      console.error('Error submitting work sample:', error);
      toast(
         'Failed to create work sample. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
const handleCancelCreating = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleCancelCreatingWorkSample();
  };

  if (isLoading) {
    return <Spinner/>;
  }


  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border shadow-sm animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-medium">Create Work Sample</CardTitle>
        <CardDescription>
          Showcase your best work to potential clients
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Service selection */}
          <div className="form-section" style={{ '--delay': 1 } as React.CSSProperties}>
            <Label htmlFor="service" className="text-sm font-medium">
              Service Category <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.service} 
              onValueChange={handleServiceChange}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a service category" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  services.map(service => (
                    <SelectItem key={service._id} value={service._id || ""}>
                      {service.serviceTitle}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Title */}
          <div className="form-section" style={{ '--delay': 2 } as React.CSSProperties}>
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title"
              disabled={isSubmitting}
              className="input-field"
            />
          </div>
          
          {/* Description */}
          <div className="form-section" style={{ '--delay': 3 } as React.CSSProperties}>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your work sample"
              rows={4}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>
          
          {/* Media upload */}
          <div className="form-section space-y-4" style={{ '--delay': 4 } as React.CSSProperties}>
            <Label className="text-sm font-medium">
              Media <span className="text-red-500">*</span>
            </Label>
            
            {formData.media.length > 0 ? (
              <div className="space-y-4">
                <ImagePreview 
                  media={formData.media} 
                  onRemove={handleRemoveMedia}
                  readOnly={isSubmitting}
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openWidget}
                  disabled={!isCloudinaryReady || isSubmitting}
                  className="mt-2"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add More
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "image-upload-area",
                  !isCloudinaryReady && "opacity-70 cursor-not-allowed"
                )}
                onClick={() => isCloudinaryReady && openWidget()}
              >
                <div className="rounded-full bg-secondary/70 p-4 hover:cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-primary/70 hover:cursor-pointer" />
                  <div className="mt-2 text-center">
                  <p className="text-sm font-medium hover:cursor-pointer" >
                    {isCloudinaryReady ? 'Click to upload' :  <Spinner/>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JPG, PNG, GIF (max 10MB each)
                  </p>
                </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Tags input - only show if media is uploaded */}
          {formData.media.length > 0 && (
            <div className="form-section" style={{ '--delay': 5 } as React.CSSProperties}>
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <TagInput
                value={formData.tags}
                onChange={handleTagsChange}
                placeholder="Add tags separated by commas..."
                readOnly={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add relevant tags to help clients find your work
              </p>
            </div>
          )}
          
          {/* Published switch */}
          <div className="form-section flex items-center justify-between pt-2" style={{ '--delay': 6 } as React.CSSProperties}>
            <div className="space-y-0.5">
              <Label htmlFor="isPublished" className="text-sm font-medium">
                Publish
              </Label>
              <p className="text-xs text-muted-foreground">
                Make this work sample visible to potential clients
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={handlePublishedChange}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-muted/30 px-6 py-4">
        <Button variant={"destructive"} onClick={handleCancelCreating}>cancel</Button>
          <Button
          variant={"outline"}
            type="submit"
            className="ml-auto"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Work Sample
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WorkSampleUpload;