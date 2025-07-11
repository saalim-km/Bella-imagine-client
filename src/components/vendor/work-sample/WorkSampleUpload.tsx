import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useDropzone } from 'react-dropzone';
import { Check, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useVendorServices, useVendorWorkSampleUploadMutataion, useUpdateWorkSample } from '@/hooks/vendor/useVendor';
import { IServiceResponse, IWorkSampleRequest, IWorkSampleResponse } from '@/types/interfaces/vendor';
import { Spinner } from '@/components/ui/spinner';
import { handleError } from '@/utils/Error/error-handler.utils';
import TagInput from './TagInput';

// Helper function to extract S3 key from presigned URL
const extractS3KeyFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  return pathname.startsWith('/') ? pathname.substring(1) : pathname; // Remove leading slash if present
};

interface MediaItem {
  url: string; // URL for preview (blob for new files, presigned URL for existing)
  file?: File; // Raw File object containing binary data for new uploads
  isNew?: boolean; // Flag to indicate new uploads
  s3Key?: string; // S3 key for existing images
}

interface WorkSampleFormData {
  _id?: string;
  service: string;
  vendor: string;
  title: string;
  description: string;
  media: string[]; // Backend expects string[] (S3 keys)
  tags: string[];
  isPublished: boolean;
}

interface InternalFormData extends Omit<WorkSampleFormData, 'media'> {
  media: MediaItem[];
}

interface WorkSampleUploadProps {
  vendorId: string;
  handleCancelCreatingWorkSample: () => void;
  workSampleData?: IWorkSampleResponse;
}

const ImagePreview = React.memo(({ item, index, onRemove }: { item: MediaItem; index: number; onRemove: (index: number) => void }) => {
  const [preview, setPreview] = useState<string | null>(item.url);

  useEffect(() => {
    if (item.file) {
      const objectUrl = URL.createObjectURL(item.file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [item.file]);

  return (
    <div className="relative group rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105">
      {preview && (
        <img
          src={preview}
          alt={`Preview ${item.file?.name || `image-${index}`}`}
          className="w-full h-32 object-cover"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 bg-red-500 rounded-full hover:bg-red-600"
          aria-label={`Remove ${item.file?.name || `image-${index}`}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-black bg-opacity-50 text-white">{index + 1}</div>
    </div>
  );
});

const WorkSampleUpload = ({ vendorId, handleCancelCreatingWorkSample, workSampleData }: WorkSampleUploadProps) => {
  // Initialize with workSampleData if editing, otherwise empty
  const initialMediaKeys = useMemo(() => 
    workSampleData?.media?.map(extractS3KeyFromUrl) || [], 
    [workSampleData?.media]
  );
  const initialInternalData: InternalFormData = {
    service: workSampleData?.service._id || '',
    vendor: workSampleData?.service.vendor || vendorId,
    description: workSampleData?.description || '',
    isPublished: workSampleData?.isPublished ?? false,
    media: workSampleData?.media
      ? workSampleData.media.map((url) => ({ url, s3Key: extractS3KeyFromUrl(url), isNew: false }))
      : [],
    tags: workSampleData?.tags || [],
    title: workSampleData?.title || '',
    _id: workSampleData?._id,
  };

  const [formData, setFormData] = useState<InternalFormData>(initialInternalData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading } = useVendorServices({ page: 1, limit: 20 });
  const { mutate: createWorkSample } = useVendorWorkSampleUploadMutataion();
  const { mutate: updateWorkSample } = useUpdateWorkSample();
  const services: IServiceResponse[] = data?.data.data ?? [];

  const validateFiles = (files: File[]): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return 'Only JPEG and PNG images are allowed.';
      }
      if (file.size > maxSize) {
        return 'Each image must be under 10MB.';
      }
    }
    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const totalImages = formData.media.length + acceptedFiles.length;
    if (totalImages > 10) {
      toast.error('Cannot upload more than 10 images.');
      return;
    }
    if (totalImages < 3) {
      toast.warning('You need at least 3 images.');
    }

    const error = validateFiles(acceptedFiles);
    if (error) {
      toast.error(error);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      media: [
        ...prev.media,
        ...acceptedFiles.map((file) => ({
          url: URL.createObjectURL(file),
          file,
          isNew: true,
        })),
      ],
    }));
    toast.success(`${acceptedFiles.length} image(s) added.`);
  }, [formData.media]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true,
    disabled: isSubmitting,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleRemoveMedia = (index: number) => {
    setFormData((prev) => {
      const mediaItem = prev.media[index];
      if (mediaItem.file && mediaItem.url.startsWith('blob:')) {
        URL.revokeObjectURL(mediaItem.url);
      }
      return {
        ...prev,
        media: prev.media.filter((_, i) => i !== index),
      };
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedMedia = [...formData.media];
    const [movedItem] = reorderedMedia.splice(result.source.index, 1);
    reorderedMedia.splice(result.destination.index, 0, movedItem);
    setFormData((prev) => ({ ...prev, media: reorderedMedia }));
  };

  const isFormValid = useMemo(() => {
    return (
      formData.service.trim() &&
      formData.title.trim() &&
      formData.media.length >= 3 &&
      formData.media.length <= 10
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error('Please fill all required fields and upload 3–10 images.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      
      // Add basic form fields
      formDataToSubmit.append('vendor', formData.vendor);
      formDataToSubmit.append('service', formData.service);
      formDataToSubmit.append('title', formData.title);
      if (formData.description) {
        formDataToSubmit.append('description', formData.description);
      }
      formDataToSubmit.append('isPublished', String(formData.isPublished));
      
      // Add tags
      formData.tags.forEach((tag) => formDataToSubmit.append('tags', tag));
      
      if (formData._id) {
        // Update existing work sample
        formDataToSubmit.append('_id', formData._id);
        
        // Add existing image keys
        const existingImageKeys = formData.media
          .filter((item) => !item.isNew && item.s3Key)
          .map((item) => item.s3Key!);
        existingImageKeys.forEach((key) => formDataToSubmit.append('existingImageKeys', key));
        
        // Add new images as binary
        const newImages = formData.media
          .filter((item) => item.isNew && item.file)
          .map((item) => item.file!);
        newImages.forEach((file) => formDataToSubmit.append('newImages', file));
        
        // Add deleted image keys
        const deletedImageKeys = initialMediaKeys.filter(
          (key) => !formData.media.some((item) => item.s3Key === key)
        );
        deletedImageKeys.forEach((key) => formDataToSubmit.append('deletedImageKeys', key));

        updateWorkSample(formDataToSubmit, {
          onSuccess: (data) => {
            toast.success(data.message);
            handleCancelCreatingWorkSample();
          },
          onError: (err) => {
            handleError(err);
          },
          onSettled: () => setIsSubmitting(false),
        });
      } else {
        // Create new work sample
        // Add new images as binary
        const newImages = formData.media
          .filter((item) => item.isNew && item.file)
          .map((item) => item.file!);
        newImages.forEach((file) => formDataToSubmit.append('media', file));

        createWorkSample(formDataToSubmit, {
          onSuccess: (data) => {
            toast.success(data.message);
            setFormData({
              service: '',
              vendor: vendorId,
              title: '',
              description: '',
              media: [],
              tags: [],
              isPublished: false,
            });
            handleCancelCreatingWorkSample();
          },
          onError: (err) => {
            handleError(err);
          },
          onSettled: () => setIsSubmitting(false),
        });
      }
    } catch (error) {
      toast.error('Failed to process work sample. Please try again.');
      setIsSubmitting(false);
    } finally {
      formData.media.forEach((item) => item.file && URL.revokeObjectURL(item.url));
    }
  };

  useEffect(() => {
    return () => {
      formData.media.forEach((item) => item.file && URL.revokeObjectURL(item.url));
    };
  }, [formData.media]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r p-6">
        <CardTitle className="text-2xl font-semibold">
          {workSampleData?._id ? 'Edit Work Sample' : 'Create Work Sample'}
        </CardTitle>
        <CardDescription>
          {workSampleData?._id ? 'Update your portfolio showcase' : 'Add a new showcase to your portfolio'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="service" className="text-sm font-medium">
              Service Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.service} onValueChange={handleServiceChange} disabled={isSubmitting}>
              <SelectTrigger className="w-full focus:ring-2">
                <SelectValue placeholder="Select a service category" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service._id} value={service._id || ''}>
                    {service.serviceTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
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
              className="focus:ring-2"
            />
          </div>

          <div className="space-y-2">
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
              className="focus:ring-2 resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">
                Images <span className="text-red-500">*</span> ({formData.media.length}/10)
              </Label>
              <span className="text-xs text-muted-foreground">
                {formData.media.length < 3 ? `Need ${3 - formData.media.length} more image(s)` : 'Good to go!'}
              </span>
            </div>
            <Progress value={(formData.media.length / 10) * 100} className="h-2" />
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-2">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop images here' : 'Drag & drop or click to upload images'}
                </p>
                <p className="text-xs text-muted-foreground">JPEG, PNG (max 10MB each, 3–10 images)</p>
              </div>
            </div>
            
            {formData.media.length > 0 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
                    >
                      {formData.media.map((item, index) => (
                        <Draggable key={`${item.url}-${index}`} draggableId={`${item.url}-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ImagePreview item={item} index={index} onRemove={handleRemoveMedia} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {formData.media.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <TagInput
                value={formData.tags}
                onChange={handleTagsChange}
                placeholder="Press enter after typing tag...."
                readOnly={isSubmitting}
                className="focus:ring-2"
              />
              <p className="text-xs text-muted-foreground">Add relevant tags to help clients find your work</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="isPublished" className="text-sm font-medium">
                Publish
              </Label>
              <p className="text-xs text-muted-foreground">Make this work sample visible to clients</p>
            </div>
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={handlePublishedChange}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>

        <CardFooter className="p-6 flex justify-between">
          <Button
            variant="destructive"
            onClick={handleCancelCreatingWorkSample}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {workSampleData?._id ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {workSampleData?._id ? 'Update Work Sample' : 'Save Work Sample'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WorkSampleUpload;