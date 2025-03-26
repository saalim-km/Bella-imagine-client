import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { clientProfileSchema, vendorProfileSchema } from "@/utils/formikValidators/user/profile.validator"
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/utils/upload-cloudinary/cloudinary"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Globe, File, FileText, FileImage, X, Upload, CheckCircle2 } from "lucide-react"
import type { IClient } from "@/services/client/clientService"
import type { IVendor } from "@/services/vendor/vendorService"
import { useThemeConstants } from "@/utils/theme/themeUtills"
import { motion, AnimatePresence } from "framer-motion"
import { handleError } from "@/utils/Error/errorHandler"

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

interface DocumentPreview {
  file: File;
  preview: string;
  name: string;
  type: string;
}

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
  const [documentPreviews, setDocumentPreviews] = useState<DocumentPreview[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const {bgColor} = useThemeConstants()

  const isVendor = role === "vendor"

  const initialValues = {
    name: data?.name || "",
    phoneNumber: data?.phoneNumber || "",
    location: data?.location || "",
    profileImage: data?.profileImage || "",
    imageFile: null, 
    verificationDocuments: [],
    verificationDocumentUrls: (data as IVendor)?.verificationDocuments || [],
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
      console.log('editform data : ',values);
      setIsUploading(true)
      const uploadPromises = []
      let uploadCount = 0
      const totalUploads = (values.imageFile ? 1 : 0) + (values.verificationDocuments?.length || 0)
      
      // Only upload to Cloudinary if there's a new image file
      if (values.imageFile) {
        uploadPromises.push(
          uploadToCloudinary(values.imageFile).then(secureUrl => {
            values.profileImage = secureUrl
            uploadCount++
            setUploadProgress(Math.round((uploadCount / totalUploads) * 100))
            return secureUrl
          })
        )
      }


      if (values.verificationDocuments?.length > 0) {
        uploadPromises.push(
          uploadMultipleToCloudinary(values.verificationDocuments).then(urls => {
            values.verificationDocumentUrls = [
              ...(values.verificationDocumentUrls || []),
              ...urls
            ]
            uploadCount += values.verificationDocuments.length
            setUploadProgress(Math.round((uploadCount / totalUploads) * 100))
            return urls
          })
        )
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises)
      }

      const updatedValues = { ...values }
      delete updatedValues.imageFile
      delete updatedValues.verificationDocuments

      // Remove empty fields from the update payload
      Object.keys(updatedValues).forEach((key) => {
        if (updatedValues[key] === "" || updatedValues[key] === null) {
          delete updatedValues[key]
        }
      })

      console.log("Updated profile data:", updatedValues)

      handleUpdateProfile?.(updatedValues)
      setIsEditing(false)
    } catch (error) {
      handleError(error)
    } finally {
      setIsUploading(false)
      setSubmitting(false)
      setUploadProgress(0)
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

  const getDocumentIcon = (fileType: string) => {
    if (fileType === 'application/pdf') return <FileText className="h-6 w-6 text-red-500" />;
    if (fileType.startsWith('image/')) return <FileImage className="h-6 w-6 text-blue-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const handleDocumentSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    values: any
  ) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    const newDocuments: File[] = [];
    const newPreviews: DocumentPreview[] = [];
    
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File "${file.name}" is not supported. Only PDF, PNG, JPG, and JPEG formats are allowed.`);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }
      
      newDocuments.push(file);
      
      const preview: DocumentPreview = {
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        name: file.name,
        type: file.type
      };
      
      newPreviews.push(preview);
    });
    
    if (newDocuments.length > 0) {
      setDocumentPreviews(prev => [...prev, ...newPreviews]);
      setFieldValue("verificationDocuments", [...(values.verificationDocuments || []), ...newDocuments]);
    }
  };

  const removeDocument = (index: number, setFieldValue: any, values: any) => {
    const newPreviews = [...documentPreviews];
    const previewToRemove = newPreviews[index];
    
    if (previewToRemove.preview) {
      URL.revokeObjectURL(previewToRemove.preview);
    }
    
    newPreviews.splice(index, 1);
    setDocumentPreviews(newPreviews);
    
    const newDocuments = [...(values.verificationDocuments || [])];
    newDocuments.splice(index, 1);
    setFieldValue("verificationDocuments", newDocuments);
  };

  const removeExistingDocument = (url: string, index: number, setFieldValue: any, values: any) => {
    const newUrls = [...(values.verificationDocumentUrls || [])];
    newUrls.splice(index, 1);
    setFieldValue("verificationDocumentUrls", newUrls);
    toast.success("Document removed");
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
        <Form className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="profileImage" className="text-base font-medium">Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarImage src={imagePreview || values.profileImage} alt={values.name} />
                  <AvatarFallback className="bg-primary/10">{values.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, setFieldValue)}
                    disabled={isUploading}
                    id="profileImage"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-sm"
                  />
                </div>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null)
                        setFieldValue("imageFile", null)
                      }}
                      className="group"
                    >
                      <X className="mr-2 h-3 w-3 group-hover:text-destructive transition-colors" />
                      Remove image
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="name" className="text-base font-medium">Name</Label>
            <Field name="name" as={CustomInput} id="name" className="mt-1" />
            <ErrorMessage name="name" component={TextError} />
          </div>

          {!isVendor && (
            <div>
              <Label htmlFor="email" className="text-base font-medium">Email</Label>
              <Field name="email" as={CustomInput} id="email" type="email" readOnly className="mt-1 bg-muted/50" />
              <ErrorMessage name="email" component={TextError} />
            </div>
          )}

          <div>
            <Label htmlFor="phoneNumber" className="text-base font-medium">Phone Number</Label>
            <Field name="phoneNumber" as={CustomInput} id="phoneNumber" type="tel" className="mt-1" />
            <ErrorMessage name="phoneNumber" component={TextError} />
          </div>

          <div>
            <Label htmlFor="location" className="text-base font-medium">Location</Label>
            <Field name="location" as={CustomInput} id="location" className="mt-1" />
            <ErrorMessage name="location" component={TextError} />
          </div>

          {isVendor && (
            <>
              <div>
                <Label htmlFor="profileDescription" className="text-base font-medium">Profile Description</Label>
                <Field name="profileDescription" as={CustomInput} id="profileDescription" className="mt-1" />
                <ErrorMessage name="profileDescription" component={TextError} />
              </div>

              <div>
                <Label htmlFor="portfolioWebsite" className="text-base font-medium">Portfolio Website</Label>
                <Field name="portfolioWebsite" as={CustomInput} id="portfolioWebsite" type="url" className="mt-1" />
                <ErrorMessage name="portfolioWebsite" component={TextError} />
              </div>

              <div>
                <Label htmlFor="languages" className="text-base font-medium">Languages</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative w-full mt-1">
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
                  className="mt-2"
                  size="sm"
                >
                  Add
                </Button>

                <div className="flex flex-wrap gap-2 mt-2">
                  <AnimatePresence>
                    {values.languages?.map((lang: string) => (
                      <motion.div 
                        key={lang} 
                        className={`flex items-center ${bgColor} px-3 py-1.5 rounded-full text-sm`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              "languages",
                              values?.languages?.filter((item: string) => item !== lang),
                            )
                          }
                          className="ml-2 text-foreground/70 hover:text-foreground transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <ErrorMessage name="languages" component={TextError} />
              </div>

              {/* Verification Documents Section */}
              {
                data?.verificationDocuments.length === 0 && (
                  <div className="space-y-4 pt-2">
                  <div className="border-t pt-4">
                    <Label htmlFor="verificationDocuments" className="text-base font-medium">
                      Verification Documents
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload identification documents (Aadhar Card, Passport, Driver's License etc.)
                    </p>
                    
                    <div className="mt-3 relative">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center border-primary/20 hover:border-primary/30 transition-colors group cursor-pointer">
                        <Input
                          type="file"
                          onChange={(e) => handleDocumentSelect(e, setFieldValue, values)}
                          disabled={isUploading}
                          id="verificationDocuments"
                          multiple
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors mb-2" />
                          <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                            Drag files here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, PNG, JPG or JPEG (max 5MB per file)
                          </p>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage name="verificationDocuments" component={TextError} />
                  </div>
  
                  {/* Previews of new documents to be uploaded */}
                  {documentPreviews.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">New Documents</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AnimatePresence>
                          {documentPreviews.map((doc, index) => (
                            <motion.div
                              key={`new-${index}`}
                              className="relative flex items-center p-3 rounded-lg border bg-card"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              {getDocumentIcon(doc.type)}
                              <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{(doc.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeDocument(index, setFieldValue, values)}
                              >
                                <X className="h-4 w-4 hover:text-destructive transition-colors" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
  
                  {/* Display previously uploaded documents */}
                  {values.verificationDocumentUrls?.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Existing Documents</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AnimatePresence>
                          {values.verificationDocumentUrls.map((url: string, index: number) => {
                            const isPdf = url.endsWith('.pdf');
                            const isImage = /\.(jpe?g|png|webp)$/i.test(url);
                            return (
                              <motion.div
                                key={`existing-${index}`}
                                className="relative flex items-center p-3 rounded-lg border bg-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                {isPdf ? (
                                  <FileText className="h-6 w-6 text-red-500" />
                                ) : isImage ? (
                                  <FileImage className="h-6 w-6 text-blue-500" />
                                ) : (
                                  <File className="h-6 w-6 text-gray-500" />
                                )}
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">Document {index + 1}</p>
                                  <p className="text-xs text-muted-foreground">Uploaded</p>
                                </div>
                                <div className="flex">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 mr-1"
                                    asChild
                                  >
                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                      <CheckCircle2 className="h-4 w-4 text-primary" />
                                    </a>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => removeExistingDocument(url, index, setFieldValue, values)}
                                  >
                                    <X className="h-4 w-4 hover:text-destructive transition-colors" />
                                  </Button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                  </div>
                )
              }
            </>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-primary h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditing(false)} 
              disabled={isSubmitting}
              className="px-5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading || !isValid}
              className="px-5"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
