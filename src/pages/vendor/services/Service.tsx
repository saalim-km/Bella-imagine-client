import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  PencilLine, Clock, FileText, ScrollText, Shield, MapPin, 
  Tag, Plus, Calendar, Briefcase, Image, Settings, Layers
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServiceMutation } from "@/hooks/service/useService";
import { createService } from "@/services/vendor/service";
import { serviceValidationSchema } from "@/utils/service.validator";

import { FormSection } from "./FormSection"
import { DateTimeSection } from "./DateTimeSection";
import { PolicySection } from "./PolicySection";
import { SessionDurationManager } from "./SessionDurationManager";
import { CustomFieldBuilder } from "./CustomFieldBuilder";
import { FeaturesList } from "./FeaturesList";
import { LocationSection } from "./LocationSection";
import { AvailabilityScheduler } from "./AvailabilityScheduler";
import { PortfolioUploader } from "./PortfolioUploader";
import { ServicePreview } from "./ServicePreview";

// Interface definitions
interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
}

interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

interface SessionDuration {
  durationInHours: number;
  price: number;
}

interface RecurringAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Location {
  options: {
    studio: boolean;
    onLocation: boolean;
  };
  travelFee: number;
  city: string;
  state: string;
  country: string;
}

interface CustomField {
  name: string;
  type: string;
  required: boolean;
  options: string[];
}

interface DepositRequirement {
  amount: number;
  isPercentage: boolean;
}

interface ServiceFormValues {
  serviceTitle: string;
  category: string;
  yearsOfExperience: string;
  styleSpecialty: string[];
  tags: string[];
  serviceDescription: string;
  sessionDurations: SessionDuration[];
  features: string[];
  depositRequirement: DepositRequirement;
  availableDates: DateSlot[];
  recurringAvailability: RecurringAvailability[];
  bufferTime: number;
  maxBookingsPerDay: number;
  blackoutDates: string[];
  location: Location;
  equipment: string[];
  paymentRequired: boolean;
  cancellationPolicies: string[];
  termsAndConditions: string[];
  customFields: CustomField[];
  portfolioImages: string[];
}

export const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: addNewService } = useServiceMutation(createService);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Attempt to load saved draft from localStorage
  const loadSavedDraft = (): ServiceFormValues | null => {
    const savedDraft = localStorage.getItem('serviceDraft');
    return savedDraft ? JSON.parse(savedDraft) : null;
  };

  const initialValues: ServiceFormValues = loadSavedDraft() || {
    serviceTitle: "",
    category: "",
    yearsOfExperience: "",
    styleSpecialty: [],
    tags: [],
    serviceDescription: "",
    sessionDurations: [{ durationInHours: 1, price: 0 }],
    features: [],
    depositRequirement: {
      amount: 0,
      isPercentage: false
    },
    availableDates: [
      {
        date: "",
        timeSlots: [{ startTime: "09:00", endTime: "18:00", capacity: 1 }],
      },
    ],
    recurringAvailability: [],
    bufferTime: 15,
    maxBookingsPerDay: 5,
    blackoutDates: [],
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
    paymentRequired: true,
    cancellationPolicies: [""],
    termsAndConditions: [""],
    customFields: [],
    portfolioImages: [],
  };

  const formik = useFormik<ServiceFormValues>({
    initialValues,
    validationSchema: serviceValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      addNewService(values, {
        onSuccess: (data: any) => {
          toast.success(data.message);
          // Clear draft
          localStorage.removeItem('serviceDraft');
          navigate("/vendor/services");
        },
        onError: (error: any) => toast.error(error.response?.data?.message || "An error occurred"),
      });
    },
  });

  // Save draft to localStorage when form values change
  useEffect(() => {
    localStorage.setItem('serviceDraft', JSON.stringify(formik.values));
  }, [formik.values]);

  const saveDraft = () => {
    localStorage.setItem('serviceDraft', JSON.stringify(formik.values));
    toast.success("Draft saved successfully");
  };

  const ErrorMessage = ({ name }: { name: string }) => {
    const touched = formik.touched[name as keyof typeof formik.touched];
    const error = formik.errors[name as keyof typeof formik.errors];
    
    if (touched && error) {
      if (typeof error === 'string') {
        return <div className="text-red-500 text-sm mt-1 animate-fade-in">{error}</div>;
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 pb-24">
        
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-4xl mx-auto space-y-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="session">Session & Pricing</TabsTrigger>
              <TabsTrigger value="location">Location & Equipment</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio & Custom</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic">
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
                        className="pl-10 service-input h-12"
                      />
                    </div>
                    <ErrorMessage name="serviceTitle" />
                  </div>

                  <div>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="category"
                        name="category"
                        type="text"
                        placeholder="Category"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.category}
                        className="pl-10 service-input h-12"
                      />
                    </div>
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
                        className="pl-10 service-input h-12"
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
                        className="pl-10 service-input min-h-[120px]"
                      />
                    </div>
                    <ErrorMessage name="serviceDescription" />
                  </div>

                  <FeaturesList
                    label="Style Specialty"
                    values={formik.values.styleSpecialty}
                    updateValues={(values) => formik.setFieldValue("styleSpecialty", values)}
                  />

                  <FeaturesList
                    label="Tags"
                    values={formik.values.tags}
                    updateValues={(values) => formik.setFieldValue("tags", values)}
                  />
                </div>
              </FormSection>

              <div className="flex justify-end mt-6">
                <Button 
                  type="button"
                  onClick={() => setActiveTab("session")}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Session & Pricing Tab */}
            <TabsContent value="session">
              <FormSection 
                title="Session Durations" 
                subtitle="Define your service duration options"
                index={1}
              >
                <SessionDurationManager
                  durations={formik.values.sessionDurations}
                  updateDurations={(durations) => formik.setFieldValue("sessionDurations", durations)}
                />
              </FormSection>

              <FormSection 
                title="Features" 
                subtitle="List the features included in your service"
                index={2}
              >
                <FeaturesList
                  label="Feature"
                  values={formik.values.features}
                  updateValues={(values) => formik.setFieldValue("features", values)}
                />
              </FormSection>

              <FormSection 
                title="Deposit Requirements" 
                subtitle="Set up deposit requirements for booking"
                index={3}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="depositRequirement.amount">Deposit Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <Input
                        id="depositRequirement.amount"
                        name="depositRequirement.amount"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.depositRequirement.amount}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center pt-8">
                    <input
                      id="depositRequirement.isPercentage"
                      name="depositRequirement.isPercentage"
                      type="checkbox"
                      onChange={formik.handleChange}
                      checked={formik.values.depositRequirement.isPercentage}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="depositRequirement.isPercentage" className="ml-2 block text-sm font-medium text-gray-700">
                      Is deposit percentage of total
                    </Label>
                  </div>
                </div>
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button"
                  onClick={() => setActiveTab("basic")}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("location")}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Location & Equipment Tab */}
            <TabsContent value="location">
              <FormSection 
                title="Location" 
                subtitle="Where will your service be provided"
                index={4}
              >
                <LocationSection
                  location={formik.values.location}
                  updateLocation={(location) => formik.setFieldValue("location", location)}
                />
              </FormSection>

              <FormSection 
                title="Equipment" 
                subtitle="List the equipment included in your service"
                index={5}
              >
                <FeaturesList
                  label="Equipment"
                  values={formik.values.equipment}
                  updateValues={(values) => formik.setFieldValue("equipment", values)}
                />
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button"
                  onClick={() => setActiveTab("session")}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("availability")}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability">
              <FormSection 
                title="Available Dates and Times" 
                subtitle="Set when your service is available"
                index={6}
              >
                <DateTimeSection 
                  availableDates={formik.values.availableDates} 
                  updateDates={(dates) => formik.setFieldValue("availableDates", dates)} 
                />
              </FormSection>

              <FormSection 
                title="Recurring Availability" 
                subtitle="Set your weekly availability pattern"
                index={7}
              >
                <AvailabilityScheduler
                  recurringAvailability={formik.values.recurringAvailability}
                  updateRecurringAvailability={(data) => formik.setFieldValue("recurringAvailability", data)}
                  bufferTime={formik.values.bufferTime}
                  updateBufferTime={(time) => formik.setFieldValue("bufferTime", time)}
                  maxBookingsPerDay={formik.values.maxBookingsPerDay}
                  updateMaxBookingsPerDay={(max) => formik.setFieldValue("maxBookingsPerDay", max)}
                  blackoutDates={formik.values.blackoutDates}
                  updateBlackoutDates={(dates) => formik.setFieldValue("blackoutDates", dates)}
                />
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button"
                  onClick={() => setActiveTab("location")}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("portfolio")}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Portfolio & Custom Fields Tab */}
            <TabsContent value="portfolio">
              <FormSection 
                title="Portfolio" 
                subtitle="Upload samples of your work"
                index={8}
              >
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
                <CustomFieldBuilder
                  fields={formik.values.customFields}
                  updateFields={(fields) => formik.setFieldValue("customFields", fields)}
                />
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button"
                  onClick={() => setActiveTab("availability")}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("policies")}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies">
              <FormSection 
                title="Policies and Terms" 
                subtitle="Set your service policies and terms"
                index={10}
              >
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="cancellationPolicies" className="text-sm font-medium mb-2 block">
                      Cancellation Policies
                    </Label>
                    <PolicySection 
                      label="Policy"
                      values={formik.values.cancellationPolicies}
                      updateValues={(values) => formik.setFieldValue("cancellationPolicies", values)}
                      icon={<Shield className="h-4 w-4 text-gray-500" />}
                    />
                    {formik.touched.cancellationPolicies && formik.errors.cancellationPolicies && (
                      <div className="text-red-500 text-sm mt-2 animate-fade-in">
                        {formik.errors.cancellationPolicies as string}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="termsAndConditions" className="text-sm font-medium mb-2 block">
                      Terms and Conditions
                    </Label>
                    <PolicySection 
                      label="Term"
                      values={formik.values.termsAndConditions}
                      updateValues={(values) => formik.setFieldValue("termsAndConditions", values)}
                      icon={<ScrollText className="h-4 w-4 text-gray-500" />}
                    />
                    {formik.touched.termsAndConditions && formik.errors.termsAndConditions && (
                      <div className="text-red-500 text-sm mt-2 animate-fade-in">
                        {formik.errors.termsAndConditions as string}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      id="paymentRequired"
                      name="paymentRequired"
                      type="checkbox"
                      onChange={formik.handleChange}
                      checked={formik.values.paymentRequired}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="paymentRequired" className="ml-2 block text-sm font-medium text-gray-700">
                      Payment required before confirmation
                    </Label>
                  </div>
                </div>
              </FormSection>

              <div className="flex justify-between mt-6">
                <Button 
                  type="button"
                  onClick={() => setActiveTab("portfolio")}
                  variant="outline"
                  className="w-32"
                >
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="w-32"
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            {/* Preview Tab */}
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
                  onClick={() => setActiveTab("policies")}
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
    </div>
  );
};
