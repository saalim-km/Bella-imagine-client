import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Upload, AlertCircle } from "lucide-react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { useCreateCommunityMutation } from "@/hooks/community-contest/useCommunity";
import { Community } from "@/types/Community";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/errorHandler";

interface CommunityFormProps {
  initialData?: {
    name: string;
    description: string;
    rules: string[];
    coverImage: string | null;
    iconImage: string | null;
    isPrivate: boolean;
    isFeatured: boolean;
  };
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Community name is required"),
  description: Yup.string().required("Description is required"),
});

export function CommunityForm({ initialData, isSubmitting }: CommunityFormProps) {
  const navigate = useNavigate()
  const [rules, setRules] = useState<string[]>(initialData?.rules || []);
  const [newRule, setNewRule] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [iconImageFile, setIconImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.coverImage || null);
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.iconImage || null);
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);

  const { mutate: createCommunity } = useCreateCommunityMutation()

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      onSubmit={async (values) => {
        const formData = {
          ...values,
          rules,
          coverImage: coverImageFile,
          iconImage: iconImageFile,
          isPrivate,
          isFeatured,
        };
        console.log('new community data  : ',formData);
        createCommunity(formData as unknown as Partial<Community>, {
          onSuccess: (data) => {
            toast.success(data.message)
            navigate('/admin/community')
          },
          onError: (error) => {
            handleError(error);
          }
        })
      }}
    >
      {({ isSubmitting: formikSubmitting, values }) => (
        <Form className="space-y-4 max-w-2xl mx-auto">
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
              <Label htmlFor="cover-upload" className="cursor-pointer">
                <Button asChild size="sm" variant="secondary">
                  <div>
                    Upload <Upload className="ml-2 h-4 w-4" />
                  </div>
                </Button>
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </Label>
            </div>
            {coverPreview ? (
              <img
                src={coverPreview}
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
              <Label htmlFor="icon-upload" className="cursor-pointer">
                <Button asChild size="sm" variant="secondary">
                  <div>
                    Upload <Upload className="ml-2 h-4 w-4" />
                  </div>
                </Button>
                <Input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleIconImageChange}
                  className="hidden"
                />
              </Label>
            </div>
            {iconPreview ? (
              <img
                src={iconPreview}
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