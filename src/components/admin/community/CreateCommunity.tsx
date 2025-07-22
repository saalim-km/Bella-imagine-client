import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Upload } from "lucide-react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useCreateCommunityMutation } from "@/hooks/community/useCommunity";
import { Community } from "@/types/interfaces/Community";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useAllCategoryQuery } from "@/hooks/admin/useAllCategory";
import { communityToast } from "@/components/ui/community-toast";

interface CommunityFormProps {
  initialData?: {
    name: string;
    description: string;
    rules: string[];
    coverImage: string | null;
    iconImage: string | null;
    isPrivate: boolean;
    isFeatured: boolean;
    category?: string; // Added category to initialData
  };
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Community name is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Please select a category"),
});

export function CommunityForm({
  initialData,
  isSubmitting,
}: CommunityFormProps) {
  const navigate = useNavigate();
  const [rules, setRules] = useState<string[]>(initialData?.rules || []);
  const [newRule, setNewRule] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [iconImageFile, setIconImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.coverImage || null
  );
  const [iconPreview, setIconPreview] = useState<string | null>(
    initialData?.iconImage || null
  );
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate || false);
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured || false
  );
  const { data, isLoading } = useAllCategoryQuery({}, { limit: 100, page: 1 });
  const { mutate: createCommunity } = useCreateCommunityMutation();

  const categories = data?.data.data;

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
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
        category: initialData?.category || "", // Initialize category
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
        createCommunity(formData as unknown as Partial<Community>, {
          onSuccess: (data) => {
            communityToast.success({ title: data?.message });

            navigate("/admin/community");
          },
          onError: (error) => {
            handleError(error);
          },
        });
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
            <ErrorMessage
              name="name"
              component="p"
              className="text-xs text-red-500"
            />
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
            <ErrorMessage
              name="description"
              component="p"
              className="text-xs text-red-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            {isLoading ? (
              <Skeleton className="w-full h-10 rounded-md" />
            ) : (
              <Field
                as="select"
                id="category"
                name="category"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories?.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </Field>
            )}
            <ErrorMessage
              name="category"
              component="p"
              className="text-xs text-red-500"
            />
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
              <Button
                type="button"
                onClick={handleAddRule}
                size="sm"
                variant="outline"
              >
                Add
              </Button>
            </div>
            {rules.length > 0 && (
              <ul className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                {rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded"
                  >
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
              <Switch
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
              <Label htmlFor="isPrivate">Private</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
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
                !values.description ||
                !values.category // Disable if category is not selected
              }
              size="sm"
            >
              {isSubmitting || formikSubmitting
                ? "Saving..."
                : initialData
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
