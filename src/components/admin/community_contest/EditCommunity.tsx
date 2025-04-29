import { useState, useEffect } from "react";
import { useCloudinary } from "@/hooks/cloudinary/useCloudinary";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Upload, AlertCircle } from "lucide-react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/utils/upload-cloudinary/cloudinary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCreateCommunityMutation } from "@/hooks/community-contest/useCommunity";
import { Community } from "@/types/Community";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/errorHandler";

interface CommunityFormProps {
  initialData?: {
    name: string;
    description: string;
    rules: string[];
    coverImageUrl: string | null;
    iconImageUrl: string | null;
    isPrivate: boolean;
    isFeatured: boolean;
  };
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Community name is required"),
  description: Yup.string().required("Description is required"),
});

export function EditCommunityForm({ initialData, isSubmitting }: CommunityFormProps) {
    const location = useLocation()
    console.log('location here : ',location.pathname);
  const navigate = useNavigate()
  const [rules, setRules] = useState<string[]>(initialData?.rules || []);
  const [newRule, setNewRule] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(initialData?.coverImageUrl || null);
  const [iconImageUrl, setIconImageUrl] = useState<string | null>(initialData?.iconImageUrl || null);
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const {mutate : createCommunity} = useCreateCommunityMutation()

  // Handler for cover image upload
  const handleCoverUploadSuccess = (results: any[]) => {
    console.log("Cover upload results:", results);
    setUploadingCover(false);

    if (!results || results.length === 0) {
      console.error("No results from cover upload");
      setDebugInfo({ message: "No results returned from cover upload" });
      return;
    }

    const result = results[0];
    if (!result.info) {
      console.error("Missing info object in cover upload result");
      setDebugInfo({ message: "Missing info in cover upload result", data: result });
      return;
    }

    setCoverImageUrl(result.info.secure_url);
    console.log("Cover image URL set to:", result.info.secure_url);
  };

  // Handler for icon image upload
  const handleIconUploadSuccess = (results: any[]) => {
    console.log("Icon upload results:", results);
    setUploadingIcon(false);

    if (!results || results.length === 0) {
      console.error("No results from icon upload");
      setDebugInfo({ message: "No results returned from icon upload" });
      return;
    }

    const result = results[0];
    if (!result.info) {
      console.error("Missing info object in icon upload result");
      setDebugInfo({ message: "Missing info in icon upload result", data: result });
      return;
    }

    setIconImageUrl(result.info.secure_url);
    console.log("Icon image URL set to:", result.info.secure_url);
  };

  // Cloudinary hook for cover image
  const { openWidget: openCoverWidget, isReady: isCoverReady, isLoading: isCoverLoading, error: coverError } = useCloudinary(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      multiple: false,
      folder: "community/cover",
      cropping: true,
      croppingAspectRatio: 4 / 3,
      clientAllowedFormats: ["image"],
      sources: ["local", "url", "camera"],
      defaultSource: "local",
    },
    handleCoverUploadSuccess
  );

  // Cloudinary hook for icon image
  const { openWidget: openIconWidget, isReady: isIconReady, isLoading: isIconLoading, error: iconError } = useCloudinary(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      multiple: false,
      folder: "community/icon",
      cropping: true,
      croppingAspectRatio: 1,
      clientAllowedFormats: ["image"],
      sources: ["local", "url", "camera"],
      defaultSource: "local",
    },
    handleIconUploadSuccess
  );

  const handleOpenCoverWidget = () => {
    setUploadingCover(true);
    console.log("Opening cover widget, isReady:", isCoverReady);
    try {
      openCoverWidget();
    } catch (error) {
      console.error("Error opening cover widget:", error);
      setUploadingCover(false);
      setDebugInfo({ message: "Error opening cover widget", error });
    }
  };

  const handleOpenIconWidget = () => {
    setUploadingIcon(true);
    console.log("Opening icon widget, isReady:", isIconReady);
    try {
      openIconWidget();
    } catch (error) {
      console.error("Error opening icon widget:", error);
      setUploadingIcon(false);
      setDebugInfo({ message: "Error opening icon widget", error });
    }
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([newRule, ...rules]);
      setNewRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRule();
    }
  };

  return (
    <Formik
      initialValues={{
        name: initialData?.name || "",
        description: initialData?.description || "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const formData:Partial<Community> = {
          ...values,
          rules,
          coverImageUrl: coverImageUrl ?? undefined,
          iconImageUrl : iconImageUrl ?? undefined,
          isPrivate,
          isFeatured,
        };
        console.log(formData);
        createCommunity(formData,{
          onSuccess:  (data)=> {
            toast.success(data.message)
            navigate('/admin/community')
          },
          onError : (error)=> {
            handleError(error);
          }
        })
      }}
    >
      {({ isSubmitting: formikSubmitting, values }) => (
        <Form className="space-y-4 max-w-2xl mx-auto">
          {debugInfo && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Debug Info: {debugInfo.message}
                {debugInfo.error && <pre>{JSON.stringify(debugInfo.error, null, 2)}</pre>}
                {debugInfo.data && <pre>{JSON.stringify(debugInfo.data, null, 2)}</pre>}
              </AlertDescription>
            </Alert>
          )}

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Field
              as={Input}
              id="name"
              name="name"
              placeholder="Community name"
              className="w-full"
            />
            <ErrorMessage name="name" component="p" className="text-xs text-red-500" />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Field
              as={Textarea}
              id="description"
              name="description"
              placeholder="Community description"
              rows={3}
              className="w-full"
            />
            <ErrorMessage name="description" component="p" className="text-xs text-red-500" />
          </div>

          {/* Rules */}
          <div className="space-y-1">
            <Label>Rules</Label>
            <div className="flex items-center gap-2">
              <Input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a rule"
              />
              <Button type="button" onClick={handleAddRule} size="sm" variant="outline">
                Add
              </Button>
            </div>
            {rules.length > 0 && (
              <ul className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-center justify-between text-sm bg-gray-100 p-2 rounded">
                    {rule}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRule(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-1">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleOpenCoverWidget}
                disabled={!isCoverReady || isCoverLoading || uploadingCover}
                size="sm"
                variant="secondary"
              >
                {isCoverLoading ? "Loading..." : uploadingCover ? "Uploading..." : "Upload"}
                {!isCoverLoading && !uploadingCover && <Upload className="ml-2 h-4 w-4" />}
              </Button>
              {coverError && <p className="text-xs text-red-500">{coverError.message}</p>}
            </div>
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt="Cover Preview"
                className="rounded-md w-full h-32 object-cover"
              />
            ) : (
              <Skeleton className="w-full h-32 rounded-md" />
            )}
          </div>

          {/* Icon Image Upload */}
          <div className="space-y-1">
            <Label>Icon Image</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleOpenIconWidget}
                disabled={!isIconReady || isIconLoading || uploadingIcon}
                size="sm"
                variant="secondary"
              >
                {isIconLoading ? "Loading..." : uploadingIcon ? "Uploading..." : "Upload"}
                {!isIconLoading && !uploadingIcon && <Upload className="ml-2 h-4 w-4" />}
              </Button>
              {iconError && <p className="text-xs text-red-500">{iconError.message}</p>}
            </div>
            {iconImageUrl ? (
              <img
                src={iconImageUrl}
                alt="Icon Preview"
                className="rounded-full w-16 h-16 object-cover"
              />
            ) : (
              <Skeleton className="w-16 h-16 rounded-full" />
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Switch id="isPrivate" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="isPrivate">Private</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Link to="/admin/community">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                formikSubmitting ||
                uploadingCover ||
                uploadingIcon ||
                rules.length < 1 ||
                !values.name ||
                !values.description
              }
              size="sm"
            >
              {isSubmitting || formikSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}