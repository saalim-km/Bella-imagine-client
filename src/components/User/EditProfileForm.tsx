import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { clientProfileSchema, vendorProfileSchema } from "@/utils/formikValidators/profile.validator"
import { uploadToCloudinary } from "@/utils/upload-cloudinary/cloudinary"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Globe } from "lucide-react"
import type { IClient } from "@/services/client/clientService"
import type { IVendor } from "@/services/vendor/vendorService"
import { useThemeConstants } from "@/utils/theme/themeUtills"

const popularLanguages = [
  "English",
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Malayalam",
  "Kannada",
  "Odia",
  "Punjabi",
  "Assamese",
  "Maithili",
  "Sanskrit",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Portuguese",
  "Russian",
  "Italian",
  "Arabic",
  "Korean",
  "Dutch",
]

interface EditProfileFormProps {
  role: "client" | "vendor"
  setIsEditing: (isEditing: boolean) => void
  data?: IClient | IVendor
  handleUpdateProfile?: (values: any) => void
}

export function EditProfileForm({ role = "vendor", data, setIsEditing, handleUpdateProfile }: EditProfileFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [newLanguage, setNewLanguage] = useState("")
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const {bgColor} = useThemeConstants()

  const isVendor = role === "vendor"

  const initialValues = {
    name: data?.name || "",
    phoneNumber: data?.phoneNumber || "",
    location: data?.location || "",
    profileImage: data?.profileImage || "",
    imageFile: null, 
    ...(isVendor
      ? {
          profileDescription: (data as IVendor)?.description || "",
          portfolioWebsite: (data as IVendor)?.portfolioWebsite || "",
          languages: (data as IVendor)?.languages || [],
        }
      : { email: data?.email || "" }),
  }

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Only upload to Cloudinary if there's a new image file
      if (values.imageFile) {
        setIsUploading(true)
        const secureUrl = await uploadToCloudinary(values.imageFile)
        values.profileImage = secureUrl
      }


      const updatedValues = { ...values }
      delete updatedValues.imageFile

      console.log("Updated profile data:", updatedValues)

      handleUpdateProfile?.(updatedValues)
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Failed to update profile:", error)
    } finally {
      setIsUploading(false)
      setSubmitting(false)
    }
  }

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.target.files?.[0];
  
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, JPEG, and WEBP formats are allowed.");
        return;
      }
  
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFieldValue("imageFile", file);
    }
  };

  const CustomInput = ({ field, form, ...props }: any) => <Input {...field} {...props} />

  const TextError = (props: any) => <div className="text-red-500 text-sm">{props.children}</div>

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={isVendor ? vendorProfileSchema : clientProfileSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      {({ values, isSubmitting, isValid, setFieldValue, getFieldProps }) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="profileImage">Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={imagePreview || values.profileImage} alt={values.name} />
                <AvatarFallback className="bg-primary/10">{values.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, setFieldValue)}
                  disabled={isUploading}
                  id="profileImage"
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null)
                      setFieldValue("imageFile", null)
                    }}
                  >
                    Remove preview
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Field name="name" as={CustomInput} id="name" />
            <ErrorMessage name="name" component={TextError} />
          </div>

          {!isVendor && (
            <div>
              <Label htmlFor="email">Email</Label>
              <Field name="email" as={CustomInput} id="email" type="email" readOnly />
              <ErrorMessage name="email" component={TextError} />
            </div>
          )}

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Field name="phoneNumber" as={CustomInput} id="phoneNumber" type="tel" />
            <ErrorMessage name="phoneNumber" component={TextError} />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Field name="location" as={CustomInput} id="location" />
            <ErrorMessage name="location" component={TextError} />
          </div>

          {isVendor && (
            <>
              <div>
                <Label htmlFor="profileDescription">Profile Description</Label>
                <Field name="profileDescription" as={CustomInput} id="profileDescription" />
                <ErrorMessage name="profileDescription" component={TextError} />
              </div>

              <div>
                <Label htmlFor="portfolioWebsite">Portfolio Website</Label>
                <Field name="portfolioWebsite" as={CustomInput} id="portfolioWebsite" type="url" />
                <ErrorMessage name="portfolioWebsite" component={TextError} />
              </div>

              <div>
                <Label htmlFor="languages">Languages</Label>
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
                        id="language-input"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search languages..."
                        value={newLanguage}
                        onValueChange={setNewLanguage}
                      />
                      <CommandList className="max-h-[250px] overflow-auto">
                        <CommandEmpty>No results found.</CommandEmpty>
                        {popularLanguages.map((lang) => (
                          <CommandItem 
                            key={lang}
                            onSelect={() => {
                              if (lang.trim() && !values.languages?.includes(lang)) {
                                setFieldValue("languages", [...(values.languages || []), lang.trim()])
                              }
                              setNewLanguage("")
                              setOpen(false)
                            }}
                          >
                            {lang}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <Button
                  type="button"
                  onClick={() => {
                    if (newLanguage.trim() && !values.languages?.includes(newLanguage)) {
                      setFieldValue("languages", [...(values.languages || []), newLanguage.trim()])
                    }
                    setNewLanguage("")
                    setOpen(false)
                  }}
                  disabled={!newLanguage.trim()}
                  className={`mt-2`}
                >
                  Add
                </Button>

                <div className="flex flex-wrap gap-2 mt-2">
                  {values.languages?.map((lang: string) => (
                    <div key={lang} className={`flex items-center ${bgColor} px-2 py-1 rounded`}>
                      {lang}
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "languages",
                            values.languages?.filter((item: string) => item !== lang),
                          )
                        }
                        className={`ml-2`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <ErrorMessage name="languages" component={TextError} />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading || !isValid}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

