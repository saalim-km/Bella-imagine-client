import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { clientProfileSchema, vendorProfileSchema } from "@/utils/formikValidators/user/profile.validator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Globe, File, FileText, FileImage, X, Upload } from "lucide-react"
import type { IVendor } from "@/services/vendor/vendorService"
import { motion, AnimatePresence } from "framer-motion"
import { useThemeConstants } from "@/utils/theme/theme.utils"
import { handleError } from "@/utils/Error/error-handler.utils"
import { GoogleMap, Marker, LoadScript, Autocomplete } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { DEFAULT_CENTER, libraries } from "@/utils/config/map.config"

export const popularLanguages = [
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
]

export interface DocumentPreview {
  file: File;
  preview: string;
  name: string;
  type: string;
}

export interface EditProfileFormProps {
  role: "client" | "vendor"
  setIsEditing: (isEditing: boolean) => void
  data?: IVendor
  handleUpdateProfile?: (values: any) => void
  isUpdateSubmitting : boolean
}


export function EditProfileForm({ role = "vendor", data, setIsEditing, handleUpdateProfile , isUpdateSubmitting }: EditProfileFormProps) {
  const [newLanguage, setNewLanguage] = useState("")
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [documentPreview, setDocumentPreview] = useState<DocumentPreview | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const {bgColor} = useThemeConstants()
  // Location picker states
  const [marker, setMarker] = useState(data?.location || DEFAULT_CENTER)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isVendor = role === "vendor"

  const initialValues = {
    name: data?.name || "",
    phoneNumber: data?.phoneNumber || "",
    location: {
      address: data?.location?.address || "",
      lat: data?.location?.lat || 0,
      lng: data?.location?.lng || 0
    },
    profileImage: data?.profileImage || "", 
    imageFile: null, 
    verificationDocument: null,
    ...(isVendor
      ? {
          profileDescription: (data as IVendor)?.description || "",
          portfolioWebsite: (data as IVendor)?.portfolioWebsite || "",
          languages: (data as IVendor)?.languages || [],
        }
      : { email: data?.email || "" }),
  }

  // Try to get user's current location
  useEffect(() => {
    if (navigator.geolocation && initialValues.location.lat === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setMarker(userLocation)
          if (map) map.panTo(userLocation)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [map])

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      console.log(values);
      handleUpdateProfile?.(values)
    } catch (error) {
      handleError(error)
    } finally {
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
    setFieldValue: any
  ) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File "${file.name}" is not supported. Only PDF, PNG, JPG, and JPEG formats are allowed.`);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File "${file.name}" exceeds the 5MB size limit.`);
      return;
    }
    
    const preview: DocumentPreview = {
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      name: file.name,
      type: file.type
    };
    
    setDocumentPreview(preview);
    setFieldValue("verificationDocument", file);
  };

  const removeDocument = (setFieldValue: any) => {
    if (documentPreview?.preview) {
      URL.revokeObjectURL(documentPreview.preview);
    }
    
    setDocumentPreview(null);
    setFieldValue("verificationDocument", null);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent , setFieldValue : Function) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      const newLocation = { lat, lng }
      setMarker(newLocation)
      setFieldValue("location.lat", lat)
      setFieldValue("location.lng", lng)
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: newLocation }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setFieldValue("location.address", results[0].formatted_address)
        }
      })
    }
  }

  const handlePlaceChanged = (setFieldValue : Function) => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const newLocation = { lat, lng }
        setMarker(newLocation)
        setFieldValue("location.lat", lat)
        setFieldValue("location.lng", lng)
        setFieldValue("location.address", place.formatted_address || "")
        if (map) map.panTo(newLocation)
      }
    }
  }

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    setIsMapLoading(false)
  }

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
                  <AvatarImage className="object-cover" src={imagePreview || values.profileImage} alt={values.name} />
                  <AvatarFallback className="bg-primary/10">{values.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, setFieldValue)}
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
            <Card className="mt-1">
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                  libraries={libraries}
                  loadingElement={
                    <div className="flex justify-center items-center h-[400px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Loading map...</span>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        autocompleteRef.current = autocomplete
                      }}
                      onPlaceChanged={()=> handlePlaceChanged(setFieldValue)}
                    >
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Enter your location"
                        className="w-full"
                        aria-label="Search for a location"
                        value={values.location.address}
                        onChange={(e) => setFieldValue("location.address", e.target.value)}
                      />
                    </Autocomplete>

                    <div className="relative w-full h-[300px] rounded-md overflow-hidden">
                      {isMapLoading && (
                        <div className="absolute inset-0 flex justify-center items-center bg-muted/50">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      )}
                      <GoogleMap
                        center={marker}
                        zoom={14}
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        onClick={(e)=> handleMapClick(e,setFieldValue)}
                        onLoad={handleMapLoad}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: true,
                        }}
                      >
                        {marker && <Marker position={marker} />}
                      </GoogleMap>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Click on the map to select your exact location or search for an address above.
                    </p>
                  </div>
                </LoadScript>
              </CardContent>
            </Card>
            <ErrorMessage name="location.address" component={TextError} />
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
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
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
                              if (lang.trim() && !values?.languages?.includes(lang)) {
                                setFieldValue("languages", [...(values?.languages || []), lang.trim()])
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
                    {values?.languages?.map((lang: string) => (
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
                          <X className="h-3 w-3 text-gray"/>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <ErrorMessage name="languages" component={TextError} />
              </div>

              {/* Verification Documents Section */}
              {
                !data?.verificationDocument && (
                  <div className="space-y-4 pt-2">
                  <div className="border-t pt-4">
                    <Label htmlFor="verificationDocument" className="text-base font-medium">
                      Verification Document
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload an identification document (Aadhar Card, Passport, Driver's License etc.)
                    </p>
                    
                    <div className="mt-3 relative">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center border-primary/20 hover:border-primary/30 transition-colors group cursor-pointer">
                        <Input
                          type="file"
                          onChange={(e) => handleDocumentSelect(e, setFieldValue)}
                          id="verificationDocument"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors mb-2" />
                          <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                            Drag file here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, PNG, JPG or JPEG (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage name="verificationDocument" component={TextError} />
                  </div>
  
                  {/* Preview of new document to be uploaded */}
                  {documentPreview && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">New Document</Label>
                      <motion.div
                        className="relative flex items-center p-3 rounded-lg border bg-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {getDocumentIcon(documentPreview.type)}
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{documentPreview.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(documentPreview.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeDocument(setFieldValue)}
                        >
                          <X className="h-4 w-4 hover:text-destructive transition-colors" />
                        </Button>
                      </motion.div>
                    </div>
                  )}
                  </div>
                )
              }
            </>
          )}
{/* 
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
          )} */}

          <div className="flex justify-end space-x-3 pt-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setIsEditing(false)} 
              disabled={isUpdateSubmitting}
              className="px-5"
            >
              Cancel
            </Button>
            <Button 
              variant={"outline"}
              type="submit" 
              disabled={isUpdateSubmitting}
              className="px-5"
            >
              {isUpdateSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}