import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { data, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  PencilLine, Clock, FileText, ScrollText, Shield, MapPin, 
  Tag, Plus, Calendar, Briefcase, Image, Settings, Layers,
  Info, AlertCircle
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllVendorCategoryQuery, useCreateServiceMutation } from "@/hooks/vendor/useVendor";

import { serviceValidationSchema , validateSection } from "@/utils/formikValidators/vendorService/base.validator";

import { FormSection } from "./FormSection";
import { DateTimeSection } from "./DateTimeSection";
import { PolicySection } from "./PolicySection";
import { SessionDurationManager } from "./SessionDurationManager";
import { CustomFieldBuilder } from "./CustomFieldBuilder";
import { FeaturesList } from "./FeaturesList";
import { LocationSection } from "./LocationSection";
import { AvailabilityScheduler } from "./AvailabilityScheduler";
import { PortfolioUploader } from "./PortfolioUploader";
import { ServicePreview } from "./ServicePreview";
import { IService } from "@/types/vendor";
import { handleError } from "@/utils/Error/errorHandler";


export const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const {data} = useAllVendorCategoryQuery()
  const { mutate: addNewService } = useCreateServiceMutation()
  const [activeTab, setActiveTab] = useState("basic");
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
    basic: false,
    session: false,
    location: false,
    availability: false,
    portfolio: false,
    policies: false,
    preview: false
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const tabSequence = ["basic", "session", "location", "availability", "portfolio", "policies", "preview"];
  
  const loadSavedDraft = (): IService | null => {
    const savedDraft = localStorage.getItem('serviceDraft');
    return savedDraft ? JSON.parse(savedDraft) : null;
  };

  const initialValues: IService = loadSavedDraft() || {
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
    ],
    location: { 
      options: {
        studio: false,
        onLocation: false
      },
      travelFee: 0,
      city: "", 
      state: "", 
      country: "" 
    },
    equipment: [],
    cancellationPolicies: [""],
    termsAndConditions: [""],
    customFields: [],
    portfolioImages: [],
  };

  const formik = useFormik<IService>({
    initialValues,
    validationSchema: serviceValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values);
      values.isPublished = true;
      addNewService(values, {
        onSuccess: (data: any) => {
          toast.success(data.message);
        },
        onError: (error: any) => toast.error(error.response?.data?.message || "An error occurred"),
      });
    },
  });

  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  const isFieldTouched = (fieldName: string) => {
    return touchedFields.has(fieldName);
  };

  // dont forgot this to replace with query
  // useEffect(() => {
  //   localStorage.setItem('serviceDraft', JSON.stringify(formik.values));
  // }, [formik.values]);

  useEffect(() => {
    const validateCurrentSection = async () => {
      if (activeTab === 'preview') {
        setCompletedSections(prev => ({ ...prev, preview: true }));
        return;
      }
      
      const { isValid } = await validateSection(formik.values, activeTab);
      setCompletedSections(prev => ({ ...prev, [activeTab]: isValid }));
    };
    
    validateCurrentSection();
  }, [activeTab, formik.values]);


  const handleTabChange = async (value: string) => {
    const currentIndex = tabSequence.indexOf(activeTab);
    const targetIndex = tabSequence.indexOf(value);
    
    if (targetIndex < currentIndex) {
      setActiveTab(value);
      return;
    }
    
    if (targetIndex > currentIndex + 1 && !completedSections[tabSequence[currentIndex]]) {
      toast.error("Please complete the current section before skipping ahead");
      return;
    }
    
    if (targetIndex === currentIndex + 1 || value === 'preview') {
      setIsValidating(true);
      const { isValid, errors } = await validateSection(formik.values, activeTab);
      setIsValidating(false);
      
      if (isValid) {
        setCompletedSections(prev => ({ ...prev, [activeTab]: true }));
        setValidationErrors({});
        setActiveTab(value);
      } else {
        setValidationErrors(errors);
        
        if (activeTab === 'basic') {
          markFieldAsTouched('serviceTitle');
          markFieldAsTouched('category');
          markFieldAsTouched('yearsOfExperience');
          markFieldAsTouched('styleSpecialty');
          markFieldAsTouched('tags');
          markFieldAsTouched('serviceDescription');
        } else if (activeTab === 'session') {
          markFieldAsTouched('sessionDurations');
          markFieldAsTouched('features');
        } else if (activeTab === 'location') {
          markFieldAsTouched('location.city');
          markFieldAsTouched('location.state');
          markFieldAsTouched('location.country');
          markFieldAsTouched('equipment');
        } else if (activeTab === 'availability') {
          markFieldAsTouched('availableDates');
          markFieldAsTouched('recurringAvailability');
          markFieldAsTouched('maxBookingsPerDay');
        } else if (activeTab === 'portfolio') {
          markFieldAsTouched('portfolioImages');
          markFieldAsTouched('customFields');
        } else if (activeTab === 'policies') {
          markFieldAsTouched('cancellationPolicies');
          markFieldAsTouched('termsAndConditions');
        }
        
        toast.error("Please correct the errors before proceeding");
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

  const saveDraft = () => {
    console.log(formik.values)
    // formik.values.isPublished = false;
    // if(formik.values.serviceTitle && formik.values.category && formik.values.yearsOfExperience){
    //   addNewService(formik.values,{
    //     onSuccess : (data)=> {
    //       console.log(data);
    //       toast.success(data.message)
    //     },
    //     onError : (err)=> {
    //       handleError(err)
    //     }
    //   })
    // }else {
    //   toast.error('Basic details is needed to draft a service')
    // }
  };

  const handleSubmit = (data : Partial<IService>)=> {
    console.log(data);
  }

  const ErrorMessage = ({ name }: { name: string }) => {
    const touched = isFieldTouched(name) || formik.touched[name as keyof typeof formik.touched];
    const formikError = formik.errors[name as keyof typeof formik.errors];
    const validationError = validationErrors[name];
    
    const error = validationError || (touched && formikError);
    
    if (error) {
      if (typeof error === 'string') {
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

    const errors = Object.entries(validationErrors)
      .filter(([key]) => {
        if (['serviceTitle', 'category', 'yearsOfExperience', 'styleSpecialty', 'tags', 'serviceDescription'].includes(key)) {
          return section === 'basic';
        } else if (['sessionDurations', 'features', 'depositRequirement'].includes(key)) {
          return section === 'session';
        } else if (['location', 'equipment'].includes(key)) {
          return section === 'location';
        } else if (['availableDates', 'recurringAvailability', 'bufferTime', 'maxBookingsPerDay', 'blackoutDates'].includes(key)) {
          return section === 'availability';
        } else if (['portfolioImages', 'customFields'].includes(key)) {
          return section === 'portfolio';
        } else if (['paymentRequired', 'cancellationPolicies', 'termsAndConditions'].includes(key)) {
          return section === 'policies';
        }
        return false;
      })
      .map(([_, error]) => error);

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

  // const hasError = (name: string) => {
  //   const touched = isFieldTouched(name) || formik.touched[name as keyof typeof formik.touched];
  //   const formikError = formik.errors[name as keyof typeof formik.errors];
  //   const validationError = validationErrors[name];
  //   return !!(validationError || (touched && formikError));
  // };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 pb-24">
        
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-4xl mx-auto space-y-8"
        >
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="session" disabled={!completedSections.basic}>Session & Pricing</TabsTrigger>
              <TabsTrigger value="location" disabled={!completedSections.session}>Location & Equipment</TabsTrigger>
              <TabsTrigger value="availability" disabled={!completedSections.location}>Availability</TabsTrigger>
              <TabsTrigger value="portfolio" disabled={!completedSections.availability}>Portfolio & Custom</TabsTrigger>
              <TabsTrigger value="policies" disabled={!completedSections.portfolio}>Policies</TabsTrigger>
              <TabsTrigger value="preview" disabled={!completedSections.policies}>Preview</TabsTrigger>
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.serviceTitle}
                        className={`pl-10 service-input h-12 ${
                          validationErrors.serviceTitle ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    <ErrorMessage name="serviceTitle" />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium mb-1 block">
                      Category
                    </Label>
                    <Select
                      name="category"
                      value={formik.values.category}
                      onValueChange={(value) => formik.setFieldValue("category", value)}
                    >
                      <SelectTrigger 
                        className={`h-12 ${
                          validationErrors.category ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.title}
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.yearsOfExperience}
                        className={`pl-10 service-input h-12 ${
                          validationErrors.yearsOfExperience ? 'border-red-500' : ''
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.serviceDescription}
                        className={`pl-10 service-input min-h-[120px] ${
                          validationErrors.serviceDescription ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    <ErrorMessage name="serviceDescription" />
                  </div>

                  <div>
                    <Label htmlFor="styleSpecialty" className={`text-sm font-medium mb-1 block ${
                      validationErrors.styleSpecialty ? 'text-red-500' : ''
                    }`}>
                      Style Specialty (at least one required)
                    </Label>
                    <FeaturesList
                      label="Style Specialty"
                      values={formik.values.styleSpecialty}
                      updateValues={(values) => formik.setFieldValue("styleSpecialty", values)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags" className={`text-sm font-medium mb-1 block ${
                      validationErrors.tags ? 'text-red-500' : ''
                    }`}>
                      Tags (at least one required)
                    </Label>
                    <FeaturesList
                      label="Tags"
                      values={formik.values.tags}
                      updateValues={(values) => formik.setFieldValue("tags", values)}
                    />
                  </div>
                </div>
              </FormSection>

              <div className="flex justify-end mt-6">
                <Button 
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? 'Validating...' : 'Next'}
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
                <Label className={`text-sm font-medium mb-3 block ${
                  validationErrors.sessionDurations ? 'text-red-500' : ''
                }`}>
                  Session Durations (at least one required)
                </Label>
                <SessionDurationManager
                  durations={formik.values.sessionDurations}
                  updateDurations={(durations) => formik.setFieldValue("sessionDurations", durations)}
                />
                <ErrorMessage name="sessionDurations" />
              </FormSection>

              <FormSection 
                title="Features" 
                subtitle="List the features included in your service"
                index={2}
              >
                <Label className={`text-sm font-medium mb-1 block ${
                  validationErrors.features ? 'text-red-500' : ''
                }`}>
                  Features (at least one required)
                </Label>
                <FeaturesList
                  label="Feature"
                  values={formik.values.features}
                  updateValues={(values) => formik.setFieldValue("features", values)}
                />
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
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? 'Validating...' : 'Next'}
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
                  updateLocation={(location) => formik.setFieldValue("location", location)}
                />
                {(validationErrors['location.city'] || validationErrors['location.state'] || validationErrors['location.country']) && (
                  <div className="text-red-500 text-sm mt-2 animate-fade-in">
                    {validationErrors['location.city'] || validationErrors['location.state'] || validationErrors['location.country']}
                  </div>
                )}
              </FormSection>

              <FormSection 
                title="Equipment" 
                subtitle="List the equipment included in your service"
                index={5}
              >
                <Label className={`text-sm font-medium mb-1 block ${
                  validationErrors.equipment ? 'text-red-500' : ''
                }`}>
                  Equipment (at least one required)
                </Label>
                <FeaturesList
                  label="Equipment"
                  values={formik.values.equipment}
                  updateValues={(values) => formik.setFieldValue("equipment", values)}
                />
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
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? 'Validating...' : 'Next'}
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
                <Label className={`text-sm font-medium mb-1 block ${
                  validationErrors.availableDates ? 'text-red-500' : ''
                }`}>
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
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? 'Validating...' : 'Next'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              <SectionError section="portfolio" />
              <FormSection 
                title="Portfolio" 
                subtitle="Upload samples of your work"
                index={8}
              >
                <Label className={`text-sm font-medium mb-3 block ${
                  validationErrors.portfolioImages ? 'text-red-500' : ''
                }`}>
                  Portfolio Images (at least 6 required)
                </Label>
                <PortfolioUploader
                  images={formik.values.portfolioImages}
                  updateImages={(images) => formik.setFieldValue("portfolioImages", images)}
                />
              </FormSection>

              <FormSection 
                title="Custom Fields" 
                subtitle="Create custom fields for your service"
                index={9}
              >
                <Label className={`text-sm font-medium mb-3 block ${
                  validationErrors.customFields ? 'text-red-500' : ''
                }`}>
                  Custom Fields (at least 3 required)
                </Label>
                <CustomFieldBuilder
                  fields={formik.values.customFields}
                  updateFields={(fields) => formik.setFieldValue("customFields", fields)}
                />
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
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? 'Validating...' : 'Next'}
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
                    <Label htmlFor="cancellationPolicies" className={`text-sm font-medium mb-2 block ${
                      validationErrors.cancellationPolicies ? 'text-red-500' : ''
                    }`}>
                      Cancellation Policies (at least one required)
                    </Label>
                    <PolicySection 
                      label="Policy"
                      values={formik.values.cancellationPolicies}
                      updateValues={(values) => formik.setFieldValue("cancellationPolicies", values)}
                      icon={<Shield className="h-4 w-4 text-gray-500" />}
                    />
                    <ErrorMessage name="cancellationPolicies" />
                  </div>

                  <div>
                    <Label htmlFor="termsAndConditions" className={`text-sm font-medium mb-2 block ${
                      validationErrors.termsAndConditions ? 'text-red-500' : ''
                    }`}>
                      Terms and Conditions (at least one required)
                    </Label>
                    <PolicySection 
                      label="Term"
                      values={formik.values.termsAndConditions}
                      updateValues={(values) => formik.setFieldValue("termsAndConditions", values)}
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
                  type="button"
                  onClick={handleNext}
                  className="w-32"
                  disabled={isValidating}
                >
                  {isValidating ? 'Validating...' : 'Next'}
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
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={saveDraft}
                  >
                    Save Draft
                  </Button>
                  <Button 
                    type="submit"
                    className="w-32"
                  >
                    Publish
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>

      <div className="fixed bottom-6 right-6 z-10">
        <Button
          type="button"
          onClick={saveDraft}
          className="rounded-full shadow-lg p-4 h-auto w-auto bg-primary hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        </Button>
      </div>
    </div>
  );
};
