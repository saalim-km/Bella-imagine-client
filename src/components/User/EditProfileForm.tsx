import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { clientProfileSchema, vendorProfileSchema } from "@/utils/formikValidators/profile.validator";
import { uploadToCloudinary } from "@/utils/upload-cloudinary/cloudinary";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Globe } from "lucide-react";

const popularLanguages = [
  "English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati", "Malayalam",
  "Kannada", "Odia", "Punjabi", "Assamese", "Maithili", "Sanskrit", "Spanish", "French", "German",
  "Chinese", "Japanese", "Portuguese", "Russian", "Italian", "Arabic", "Korean", "Dutch"
];

interface BaseProfile {
  name: string;
  phoneNumber: string;
  location: string;
  profileImage?: string;
}

interface ClientProfile extends BaseProfile {
  email: string;
}

interface VendorProfile extends BaseProfile {
  profileDescription: string;
  portfolioWebsite: string;
  languages: string[];
}

interface EditProfileFormProps {
  role: "client" | "vendor";
  setIsEditing: (isEditing: boolean) => void;
  data?: ClientProfile | VendorProfile;
  handleUpdateProfile?: (values: ClientProfile | VendorProfile) => void;
}

export function EditProfileForm({ role = "vendor", data, setIsEditing, handleUpdateProfile }: EditProfileFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [open, setOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isVendor = role === "vendor";

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      phoneNumber: data?.phoneNumber || "",
      location: data?.location || "",
      profileImage: data?.profileImage || "",
      ...(isVendor
        ? {
            profileDescription: (data as VendorProfile)?.profileDescription || "",
            portfolioWebsite: (data as VendorProfile)?.portfolioWebsite || "",
            languages: (data as VendorProfile)?.languages || [],
          }
        : { email: (data as ClientProfile)?.email || "" }),
    },
    validationSchema: isVendor ? vendorProfileSchema : clientProfileSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        handleUpdateProfile?.(values);
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } catch (error) {
        toast.error("Failed to update profile");
        console.error("Failed to update profile:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const secureUrl = await uploadToCloudinary(file);
        formik.setFieldValue("profileImage", secureUrl);
      } catch (error) {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };


  const addLanguage = (language: string) => {
    if (language.trim() && !formik.values.languages.includes(language)) {
      formik.setFieldValue("languages", [...formik.values.languages, language.trim()]);
    }
    setNewLanguage("");
    setOpen(false);
  };

   const removeLanguage = (language: string) => {
    formik.setFieldValue("languages", formik.values.languages.filter((lang: string) => lang !== language));
  };

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <Label>Profile Picture</Label>
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={formik.values.profileImage} alt={formik.values.name} />
          <AvatarFallback className="bg-primary/10">{formik.values.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input type="file" accept="image/*" onChange={handleImageSelect} disabled={isUploading} />
      </div>

      <Label>Name</Label>
      <Input {...formik.getFieldProps("name")} />

      {!isVendor && (
        <>
          <Label>Email</Label>
          <Input type="email" {...formik.getFieldProps("email")} />
        </>
      )}

      <Label>Phone Number</Label>
      <Input type="tel" {...formik.getFieldProps("phoneNumber")} />

      <Label>Location</Label>
      <Input {...formik.getFieldProps("location")} />

      {isVendor && (
        <>
          <Label>Profile Description</Label>
          <Input {...formik.getFieldProps("profileDescription")} />

          <Label>Portfolio Website</Label>
          <Input type="url" {...formik.getFieldProps("portfolioWebsite")} />

          <Label>Languages</Label>
          <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Type or select a language..."
                className="pl-10"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onClick={() => setOpen(true)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search languages..." value={newLanguage} onValueChange={setNewLanguage} />
              <CommandList className="max-h-[250px] overflow-auto">
                <CommandEmpty>No results found.</CommandEmpty>
                {popularLanguages.map((lang) => (
                  <CommandItem key={lang} onSelect={() => addLanguage(lang)}>
                    {lang}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
          <Button type="button" onClick={() => addLanguage(newLanguage.trim())} disabled={!newLanguage.trim()}>
            Add
          </Button>

          <div className="flex flex-wrap gap-2 mt-2">
            {formik.values.languages.map((lang: string) => (
            <div key={lang} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                {lang} 
                <button onClick={() => removeLanguage(lang)} className="ml-2">✕</button>
            </div>
            ))}
        </div>
        </>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={formik.isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={formik.isSubmitting || isUploading || !formik.isValid}>
          {formik.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
