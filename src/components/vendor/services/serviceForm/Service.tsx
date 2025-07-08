import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  PencilLine,
  Clock,
  FileText,
  ScrollText,
  Shield,
  AlertCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormSection } from "./FormSection";
import { DateTimeSection } from "./DateTimeSection";
import { PolicySection } from "./PolicySection";
import { SessionDurationManager } from "./SessionDurationManager";
import { FeaturesList } from "./FeaturesList";
import { LocationSection } from "./LocationSection";
import { ServicePreview } from "./ServicePreview";
import { validateAvailableDates } from "@/utils/formikValidators/vendorService/avalability-date-validator";
import {
  serviceValidationSchema,
  validateSection,
} from "@/utils/formikValidators/vendorService/base.validator";
import {
  useCreateServiceMutation,
  useUpdateVendorServiceMutation,
} from "@/hooks/vendor/useVendor";
import { IService, IServiceResponse } from "@/types/interfaces/vendor";
import { handleError } from "@/utils/Error/error-handler.utils";
import { ReusableAlertDialog } from "@/components/common/AlertDialogue";
import { IVendor } from "@/services/vendor/vendorService";
import { communityToast } from "@/components/ui/community-toast";
import { useQueryClient } from "@tanstack/react-query";

interface IServiceFormProps {
  handleIsCreatingService(state: boolean): void;
  editData?: IServiceResponse;
  vendorData?: IVendor;
}

export const ServiceForm = ({
  handleIsCreatingService,
  editData,
  vendorData,
}: IServiceFormProps) => {
  const { mutate: addNewService } = useCreateServiceMutation();
  const { mutate: updateService } = useUpdateVendorServiceMutation();
  const [activeTab, setActiveTab] = useState("basic");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [allowReload, setAllowReload] = useState(false);
  const [showExitDialogDraft, setShowExitDialogDraft] = useState(false);
  const queryClient = useQueryClient();
  const [completedSections, setCompletedSections] = useState<
    Record<string, boolean>
  >({
    basic: false,
    session: false,
    location: false,
    availability: false,
    policies: false,
    preview: false,
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const tabSequence = [
    "basic",
    "session",
    "location",
    "availability",
    "policies",
    "preview",
  ];

  const initialValues: IService = editData
    ? {
      ...editData,
      category : editData.category._id
    }
    : {
        serviceTitle: "",
        category: "",
        yearsOfExperience: 0,
        styleSpecialty: [],
        tags: [],
        serviceDescription: "",
        sessionDurations: [{ durationInHours: 1, price: 0 }],
        features: [],
        availableDates: [
          {
            date: format(new Date(), "yyyy-MM-dd"),
            timeSlots: [{ startTime: "09:00", endTime: "18:00", capacity: 1 }],
          },
          {
            date: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
            timeSlots: [{ startTime: "09:00", endTime: "18:00", capacity: 1 }],
          },
        ],
        location: {
          address: "",
          lat: 0,
          lng: 0,
        },
        equipment: [],
        cancellationPolicies: [""],
        termsAndConditions: [""],
      };

  const formik = useFormik<IService>({
    initialValues,
    validationSchema: serviceValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (editData) {
        updateService(values, {
          onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['vendor_services'] });
            handleIsCreatingService(false);
            communityToast.success({ title: data?.message });
          },
          onError: (err) => {
            handleError(err);
          },
        });
      } else {
        values.isPublished = true;
        addNewService(values, {
          onSuccess: () => {
            handleIsCreatingService(false);
            localStorage.removeItem("serviceDraft");
            queryClient.invalidateQueries({ queryKey: ['vendor_services'] });
            communityToast.success({
              title: "Service published successfully",
              description: "Your service is now live and available for clients to book."
            });
          },
          onError: (err) => {
            handleError(err);
          },
        });
      }
    },
  });

  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const isFieldTouched = (fieldName: string): boolean => {
    return touchedFields[fieldName] || false;
  };

  const handleTabChange = async (value: string) => {
    const currentIndex = tabSequence.indexOf(activeTab);
    const targetIndex = tabSequence.indexOf(value);

    if (targetIndex < currentIndex) {
      setActiveTab(value);
      return;
    }

    if (
      targetIndex > currentIndex + 1 &&
      !completedSections[tabSequence[currentIndex]]
    ) {
      toast.error("Please complete the current section before skipping ahead");
      return;
    }

    if (targetIndex === currentIndex + 1 || value === "preview") {
      setIsValidating(true);

      try {
        const { isValid, errors } = await validateSection(
          formik.values,
          activeTab
        );

        if (isValid) {
          setCompletedSections((prev) => ({ ...prev, [activeTab]: true }));
          setValidationErrors({});
          setActiveTab(value);
        } else {
          setValidationErrors(errors);

          if (activeTab === "basic") {
            [
              "serviceTitle",
              "category",
              "yearsOfExperience",
              "styleSpecialty",
              "tags",
              "serviceDescription",
            ].forEach(markFieldAsTouched);
          } else if (activeTab === "session") {
            ["sessionDurations", "features"].forEach(markFieldAsTouched);
          } else if (activeTab === "location") {
            [
              "location.city",
              "location.state",
              "location.country",
              "equipment",
            ].forEach(markFieldAsTouched);
          } else if (activeTab === "availability") {
            ["availableDates"].forEach(markFieldAsTouched);
          } else if (activeTab === "policies") {
            ["cancellationPolicies", "termsAndConditions"].forEach(
              markFieldAsTouched
            );
          }

          toast.error("Please correct the errors before proceeding");
        }
      } catch (error) {
        handleError(error)
        toast.error("An error occurred during validation");
      } finally {
        setIsValidating(false);
      }
    } else if (completedSections[tabSequence[currentIndex]]) {
      setActiveTab(value);
    }
  };

  const handleNext = async () => {
    const currentIndex = tabSequence.indexOf(activeTab);
    if (currentIndex < tabSequence.length - 1) {
      const nextTab = tabSequence[currentIndex + 1];
      await handleTabChange(nextTab);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabSequence.indexOf(activeTab);
    if (currentIndex > 0) {
      const prevTab = tabSequence[currentIndex - 1];
      setActiveTab(prevTab);
    }
  };

  const ErrorMessage = ({ name }: { name: string }) => {
    // Check if the field is touched or if we have validation errors
    const touched = isFieldTouched(name);
    const formikError = formik.errors[name as keyof typeof formik.errors];
    const validationError = validationErrors[name];

    // Show error only if field is touched and has errors
    const error =
      (touched || validationError) && (validationError || formikError);

    if (error) {
      if (typeof error === "string") {
        return (
          <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        );
      }
    }

    return null;
  };

  const SectionError = ({ section }: { section: string }) => {
    if (Object.keys(validationErrors).length === 0) return null;

    // Filter errors relevant to the current section
    const errors = Object.entries(validationErrors)
      .filter(([key]) => {
        if (
          [
            "serviceTitle",
            "category",
            "yearsOfExperience",
            "styleSpecialty",
            "tags",
            "serviceDescription",
          ].includes(key)
        ) {
          return section === "basic";
        } else if (["sessionDurations", "features"].includes(key)) {
          return section === "session";
        } else if (["location", "equipment"].includes(key)) {
          return section === "location";
        } else if (
          key.startsWith("availableDates") ||
          [
            "availableDates",
            "recurringAvailability",
            "bufferTime",
            "maxBookingsPerDay",
            "blackoutDates",
          ].includes(key)
        ) {
          return section === "availability";
        } else if (["portfolioImages"].includes(key)) {
          return section === "portfolio";
        } else if (
          [
            "paymentRequired",
            "cancellationPolicies",
            "termsAndConditions",
          ].includes(key)
        ) {
          return section === "policies";
        }
        return false;
      })
      .map(([error]) => error)
      .filter((error) => error && typeof error === "string"); // Ensure we only include string errors

    if (errors.length === 0) return null;

    return (
      <Alert variant="destructive" className="mb-6 animate-fade-in">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </AlertDescription>
      </Alert>
    );
  };

  const handleFieldChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update formik value
    formik.handleChange(e);

    // Mark field as touched
    markFieldAsTouched(name);

    // Validate this specific field
    try {
      await serviceValidationSchema.validateAt(name, {
        ...formik.values,
        [name]: value,
      });

      // If validation passes, clear error for this field
      if (validationErrors[name]) {
        const newErrors = { ...validationErrors };
        delete newErrors[name];
        setValidationErrors(newErrors);
      }
    } catch (error: any) {
      // If validation fails, set error
      setValidationErrors({
        ...validationErrors,
        [name]: error.message,
      });
    }
  };

  const handleConfirmExit = () => {
    setAllowReload(true);
    window.location.reload();
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsavedChanges =
        formik.values.serviceTitle !== "" ||
        formik.values.serviceDescription !== "" ||
        formik.values.availableDates.length > 0;

      if (hasUnsavedChanges && !allowReload) {
        e.preventDefault();
      } else {
        localStorage.removeItem("serviceDraft");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formik.values, allowReload]);

  const valueRef = useRef(formik.values);
  useEffect(() => {
    localStorage.setItem("serviceDraft", JSON.stringify(formik.values));
    valueRef.current = formik.values;
  }, [formik.values]);

  useEffect(() => {
    if (activeTab === "availability") {
      const { isValid, errors } = validateAvailableDates(
        formik.values.availableDates
      );
      if (!isValid) {
        setValidationErrors((prev) => ({
          ...prev,
          ...errors,
        }));
      } else {
        const newErrors = { ...validationErrors };
        Object.keys(newErrors).forEach((key) => {
          if (key.startsWith("availableDates")) {
            delete newErrors[key];
          }
        });
        setValidationErrors(newErrors);
      }
    }
  }, [validationErrors,formik.values.availableDates, activeTab]);

  useEffect(() => {
    const validateCurrentSection = async () => {
      if (activeTab === "preview") {
        setCompletedSections((prev) => ({ ...prev, preview: true }));
        return;
      }

      try {
        const { isValid } = await validateSection(formik.values, activeTab);
        setCompletedSections((prev) => ({ ...prev, [activeTab]: isValid }));
      } catch (error) {
        handleError(error)
      }
    };

    validateCurrentSection();
  }, [activeTab, formik.values]);

  useEffect(() => {
    const clearFieldErrors = () => {
      const newErrors = { ...validationErrors };
      let hasChanged = false;

      // For each touched field, check if it passes validation
      Object.keys(touchedFields).forEach(async (fieldName) => {
        if (touchedFields[fieldName]) {
          try {
            // Try to validate just this field
            await serviceValidationSchema.validateAt(fieldName, formik.values);

            // If validation passes, remove the error
            if (newErrors[fieldName]) {
              delete newErrors[fieldName];
              hasChanged = true;
            }
          } catch (error) {
            console.log(error);
          }
        }
      });

      if (hasChanged) {
        setValidationErrors(newErrors);
      }
    };

    clearFieldErrors();
  }, [formik.values, touchedFields,validationErrors]);
  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 pb-24">
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-4xl mx-auto space-y-8"
        >
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="session" disabled={!completedSections.basic}>
                Session & Pricing
              </TabsTrigger>
              <TabsTrigger
                value="location"
                disabled={!completedSections.session}
              >
                Location & Equipment
              </TabsTrigger>
              <TabsTrigger
                value="availability"
                disabled={!completedSections.location}
              >
                Availability
              </TabsTrigger>
              <TabsTrigger
                value="policies"
              >
                Policies
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                disabled={!completedSections.policies}
              >
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <SectionError section="basic" />
              <FormSection
                title="Basic Information"
                subtitle="Define your service details"
                index={0}
              >
                <div className="space-y-6">
                  <div>
                    <div className="relative">
                      <PencilLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="serviceTitle"
                        name="serviceTitle"
                        type="text"
                        placeholder="Service Title"
                        onChange={handleFieldChange}
                        onBlur={() => markFieldAsTouched("serviceTitle")}
                        value={formik.values.serviceTitle}
                        className={`pl-10 service-input h-12 ₹{
                          (isFieldTouched("serviceTitle") && formik.errors.serviceTitle) || 
                          validationErrors.serviceTitle ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    <ErrorMessage name="serviceTitle" />
                  </div>

                  <div>
                    <Label
                      htmlFor="category"
                      className="text-sm font-medium mb-1 block"
                    >
                      Category
                    </Label>
                    <Select
                      name="category"
                      value={editData?.category._id ? editData.category._id : formik.values.category}
                      onValueChange={(value) => {
                        formik.setFieldValue("category", value);
                        markFieldAsTouched("category");

                        // Clear error if value is not empty
                        if (value && validationErrors.category) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.category;
                          setValidationErrors(newErrors);
                        }
                      }}
                    >
                      <SelectTrigger
                        className={`h-12 ₹{
                          (isFieldTouched("category") && formik.errors.category) || 
                          validationErrors.category ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(vendorData?.categories ?? []).map((category) => (
                          <SelectItem key={category?._id} value={category?._id}>
                            {category?.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="category" />
                  </div>

                  <div>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        type="number"
                        placeholder="Years of Experience"
                        onChange={handleFieldChange}
                        onBlur={() => markFieldAsTouched("yearsOfExperience")}
                        value={formik.values.yearsOfExperience}
                        className={`pl-10 service-input h-12 ₹{
                          (isFieldTouched("yearsOfExperience") && formik.errors.yearsOfExperience) || 
                          validationErrors.yearsOfExperience ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    <ErrorMessage name="yearsOfExperience" />
                  </div>

                  <div>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                      <Textarea
                        id="serviceDescription"
                        name="serviceDescription"
                        placeholder="Service Description"
                        onChange={handleFieldChange}
                        onBlur={() => markFieldAsTouched("serviceDescription")}
                        value={formik.values.serviceDescription}
                        className={`pl-10 service-input min-h-[120px] ₹{
                          (isFieldTouched("serviceDescription") && formik.errors.serviceDescription) || 
                          validationErrors.serviceDescription ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    <ErrorMessage name="serviceDescription" />
                  </div>

                  <div>
                    <Label
                      htmlFor="styleSpecialty"
                      className={`text-sm font-medium mb-1 block ₹{
                        (isFieldTouched("styleSpecialty") && formik.errors.styleSpecialty) || 
                        validationErrors.styleSpecialty ? "text-red-500" : ""
                      }`}
                    >
                      Style Specialty (at least one required)
                    </Label>
                    <FeaturesList
                      label="Style Specialty"
                      values={formik.values.styleSpecialty}
                      updateValues={(values) => {
                        formik.setFieldValue("styleSpecialty", values);
                        markFieldAsTouched("styleSpecialty");

                        // Clear error if at least one value
                        if (
                          values.length > 0 &&
                          validationErrors.styleSpecialty
                        ) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.styleSpecialty;
                          setValidationErrors(newErrors);
                        }
                      }}
                    />
                    <ErrorMessage name="styleSpecialty" />
                  </div>

                  <div>
                    <Label
                      htmlFor="tags"
                      className={`text-sm font-medium mb-1 block ₹{
                        (isFieldTouched("tags") && formik.errors.tags) || 
                        validationErrors.tags ? "text-red-500" : ""
                      }`}
                    >
                      Tags (at least one required)
                    </Label>
                    <FeaturesList
                      label="Tags"
                      values={formik.values.tags}
                      updateValues={(values) => {
                        formik.setFieldValue("tags", values);
                        markFieldAsTouched("tags");

                        // Clear error if at least one value
                        if (values.length > 0 && validationErrors.tags) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.tags;
                          setValidationErrors(newErrors);
                        }
                      }}
                    />
                    <ErrorMessage name="tags" />
                  </div>
                </div>
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button
                  onClick={() => handleIsCreatingService(false)}
                  variant={"destructive"}
                >
                  Cancel
                </Button>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? "Validating..." : "Next"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="session">
              <SectionError section="session" />
              <FormSection
                title="Session Durations"
                subtitle="Define your service duration options"
                index={1}
              >
                <Label
                  className={`text-sm font-medium mb-3 block ₹{
                    (isFieldTouched("sessionDurations") && formik.errors.sessionDurations) || 
                    validationErrors.sessionDurations ? "text-red-500" : ""
                  }`}
                >
                  Session Durations (at least one required)
                </Label>
                <SessionDurationManager
                  durations={formik.values.sessionDurations}
                  updateDurations={(durations) => {
                    formik.setFieldValue("sessionDurations", durations);
                    markFieldAsTouched("sessionDurations");

                    // Clear error if valid
                    if (
                      durations.length > 0 &&
                      validationErrors.sessionDurations
                    ) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.sessionDurations;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                <ErrorMessage name="sessionDurations" />
              </FormSection>

              <FormSection
                title="Features"
                subtitle="List the features included in your service"
                index={2}
              >
                <Label
                  className={`text-sm font-medium mb-1 block ₹{
                    (isFieldTouched("features") && formik.errors.features) || 
                    validationErrors.features ? "text-red-500" : ""
                  }`}
                >
                  Features (at least one required)
                </Label>
                <FeaturesList
                  label="Feature"
                  values={formik.values.features}
                  updateValues={(values) => {
                    formik.setFieldValue("features", values);
                    markFieldAsTouched("features");

                    // Clear error if at least one value
                    if (values.length > 0 && validationErrors.features) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.features;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                <ErrorMessage name="features" />
              </FormSection>
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? "Validating..." : "Next"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="location">
              <SectionError section="location" />
              <FormSection
                title="Location"
                subtitle="Where will your service be provided"
                index={4}
              >
                <LocationSection
                  location={formik.values.location}
                  updateLocation={(location) => {
                    formik.setFieldValue("location", location);
                    markFieldAsTouched("location.city");
                    markFieldAsTouched("location.state");
                    markFieldAsTouched("location.country");
                  }}
                />
                {(validationErrors["location.city"] ||
                  validationErrors["location.state"] ||
                  validationErrors["location.country"]) && (
                  <div className="text-red-500 text-sm mt-2 animate-fade-in">
                    <div className="flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors["location.city"] ||
                        validationErrors["location.state"] ||
                        validationErrors["location.country"]}
                    </div>
                  </div>
                )}
              </FormSection>

              <FormSection
                title="Equipment"
                subtitle="List the equipment included in your service"
                index={5}
              >
                <Label
                  className={`text-sm font-medium mb-1 block ₹{
                    (isFieldTouched("equipment") && formik.errors.equipment) || 
                    validationErrors.equipment ? "text-red-500" : ""
                  }`}
                >
                  Equipment (at least one required)
                </Label>
                <FeaturesList
                  label="Equipment"
                  values={formik.values.equipment}
                  updateValues={(values) => {
                    formik.setFieldValue("equipment", values);
                    markFieldAsTouched("equipment");

                    // Clear error if at least one value
                    if (values.length > 0 && validationErrors.equipment) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.equipment;
                      setValidationErrors(newErrors);
                    }
                  }}
                />
                <ErrorMessage name="equipment" />
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? "Validating..." : "Next"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="availability">
              <SectionError section="availability" />
              <FormSection
                title="Available Dates and Times"
                subtitle="Set when your service is available"
                index={6}
              >
                <Label
                  className={`text-sm font-medium mb-1 block ₹{
                    (isFieldTouched("availableDates") && formik.errors.availableDates) || 
                    validationErrors.availableDates ? "text-red-500" : ""
                  }`}
                >
                  Available Dates (at least two future dates required)
                </Label>
                <DateTimeSection
                  availableDates={formik.values.availableDates}
                  updateDates={(dates) => {
                    formik.setFieldValue("availableDates", dates);
                    markFieldAsTouched("availableDates");
                  }}
                  validationErrors={validationErrors}
                />
                <ErrorMessage name="availableDates" />
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? "Validating..." : "Next"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="policies">
              <SectionError section="policies" />
              <FormSection
                title="Policies and Terms"
                subtitle="Set your service policies and terms"
                index={10}
              >
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="cancellationPolicies"
                      className={`text-sm font-medium mb-2 block ₹{
                        (isFieldTouched("cancellationPolicies") && formik.errors.cancellationPolicies) || 
                        validationErrors.cancellationPolicies ? "text-red-500" : ""
                      }`}
                    >
                      Cancellation Policies (at least one required)
                    </Label>
                    <PolicySection
                      label="Policy"
                      values={formik.values.cancellationPolicies}
                      updateValues={(values) => {
                        formik.setFieldValue("cancellationPolicies", values);
                        markFieldAsTouched("cancellationPolicies");

                        // Clear error if valid
                        if (
                          values.length > 0 &&
                          values[0].trim() !== "" &&
                          validationErrors.cancellationPolicies
                        ) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.cancellationPolicies;
                          setValidationErrors(newErrors);
                        }
                      }}
                      icon={<Shield className="h-4 w-4 text-gray-500" />}
                    />
                    <ErrorMessage name="cancellationPolicies" />
                  </div>

                  <div>
                    <Label
                      htmlFor="termsAndConditions"
                      className={`text-sm font-medium mb-2 block ₹{
                        (isFieldTouched("termsAndConditions") && formik.errors.termsAndConditions) || 
                        validationErrors.termsAndConditions ? "text-red-500" : ""
                      }`}
                    >
                      Terms and Conditions (at least one required)
                    </Label>
                    <PolicySection
                      label="Term"
                      values={formik.values.termsAndConditions}
                      updateValues={(values) => {
                        formik.setFieldValue("termsAndConditions", values);
                        markFieldAsTouched("termsAndConditions");

                        // Clear error if valid
                        if (
                          values.length > 0 &&
                          values[0].trim() !== "" &&
                          validationErrors.termsAndConditions
                        ) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.termsAndConditions;
                          setValidationErrors(newErrors);
                        }
                      }}
                      icon={<ScrollText className="h-4 w-4 text-gray-500" />}
                    />
                    <ErrorMessage name="termsAndConditions" />
                  </div>
                </div>
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? "Validating..." : "Next"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <FormSection
                title="Service Preview"
                subtitle="Preview how your service will appear to clients"
                index={11}
              >
                <ServicePreview serviceData={formik.values} />
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <div className="flex gap-3">
                  {!editData ? (
                    <Button type="submit" className="w-32">
                      Publish
                    </Button>
                  ) : (
                    <Button className="w-32">Update</Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>

      <ReusableAlertDialog
        onCancel={() => setShowExitDialog(false)}
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to leave this page?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={handleConfirmExit}
        confirmVariant="destructive"
      />

      <ReusableAlertDialog
        onCancel={() => setShowExitDialogDraft(false)}
        open={showExitDialogDraft}
        onOpenChange={setShowExitDialogDraft}
        title="Save to Draft?"
        description="You have unsaved changes. Would you like to save them as a draft before leaving?"
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={handleConfirmExit}
        confirmVariant="destructive"
      />
    </div>
  );
};
