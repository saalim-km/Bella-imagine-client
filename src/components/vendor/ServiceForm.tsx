import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useServiceMutation } from "@/hooks/service/useService";
import { createService } from "@/services/vendor/service";

import { PencilLine, Clock, MapPin, FileText, ScrollText, Shield } from "lucide-react";

interface BookedSlot {
  client?: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface AvailableHours {
  startTime: string;
  endTime: string;
}

interface AvailableDate {
  date: string;
  availableHours: AvailableHours;
  bufferTime: number;
  bookedSlots: BookedSlot[];
}

interface SessionDuration {
  durationInMinutes: number;
  price: number;
}

interface Location {
  city: string;
  state: string;
  country: string;
}

interface ServiceFormValues {
  serviceName: string;
  description: string;
  price: number;
  currency: string;
  sessionDurations: SessionDuration[];
  availableDates: AvailableDate[];
  location: Location;
  paymentRequired: boolean;
  cancellationPolicy: string;
}

const validationSchema = Yup.object({
  serviceName: Yup.string().required("Service name is required"),
  description: Yup.string(),
  price: Yup.number().required("Price is required").min(0, "Price must be non-negative"),
  currency: Yup.string(),
  sessionDurations: Yup.array().of(
    Yup.object({
      durationInMinutes: Yup.number().required("Duration is required").min(1, "Duration must be positive"),
      price: Yup.number().required("Price is required").min(0, "Price must be non-negative"),
    })
  ).min(1, "At least one session duration is required"),
  availableDates: Yup.array().of(
    Yup.object({
      date: Yup.string().required("Date is required"),
      availableHours: Yup.object({
        startTime: Yup.string().required("Start time is required"),
        endTime: Yup.string().required("End time is required"),
      }),
      bufferTime: Yup.number().min(0, "Buffer time must be non-negative"),
      bookedSlots: Yup.array(),
    })
  ),
  location: Yup.object({
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
  }),
  paymentRequired: Yup.boolean(),
  cancellationPolicy: Yup.string(),
});

export const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: addNewService } = useServiceMutation(createService);

  const formik = useFormik<ServiceFormValues>({
    initialValues: {
      serviceName: "",
      description: "",
      price: 0,
      currency: "INR",
      sessionDurations: [{ durationInMinutes: 60, price: 0 }],
      availableDates: [
        {
          date: "",
          availableHours: { startTime: "09:00", endTime: "18:00" },
          bufferTime: 15,
          bookedSlots: [],
        },
      ],
      location: { city: "", state: "", country: "" },
      paymentRequired: true,
      cancellationPolicy: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      addNewService(values, {
        onSuccess: (data: any) => {
          toast.success(data.message);
          navigate("/vendor/services");
        },
        onError: (error: any) => toast.error(error.response?.data?.message || "An error occurred"),
      });
    },
  });

  const addAvailableDate = () => {
    formik.setFieldValue("availableDates", [
      ...formik.values.availableDates,
      {
        date: "",
        availableHours: { startTime: "09:00", endTime: "18:00" },
        bufferTime: 15,
        bookedSlots: [],
      },
    ]);
  };

  const removeAvailableDate = (index: number) => {
    const newDates = [...formik.values.availableDates];
    newDates.splice(index, 1);
    formik.setFieldValue("availableDates", newDates);
  };

  const addSessionDuration = () => {
    formik.setFieldValue("sessionDurations", [
      ...formik.values.sessionDurations,
      { durationInMinutes: 60, price: 0 },
    ]);
  };

  const removeSessionDuration = (index: number) => {
    const newDurations = [...formik.values.sessionDurations];
    newDurations.splice(index, 1);
    formik.setFieldValue("sessionDurations", newDurations);
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
      <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Photography Service</h1>
          <p className="mt-2 text-gray-600">Fill in the details to create your photography service offering.</p>
        </div>
        
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-2xl mx-auto space-y-8"
        >
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="space-y-6">
              <div>
                <div className="relative">
                  <PencilLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="serviceName"
                    name="serviceName"
                    type="text"
                    placeholder="Service Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serviceName}
                    className="pl-10 h-12"
                  />
                </div>
                <ErrorMessage name="serviceName" />
              </div>

              <div>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Service Description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    className="pl-10 min-h-[120px]"
                  />
                </div>
                <ErrorMessage name="description" />
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Base Price (₹)"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                    className="pl-10 h-12"
                  />
                </div>
                <ErrorMessage name="price" />
              </div>
            </div>
          </div>

          {/* Session Durations Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4">Session Durations</h3>
            <div className="space-y-4">
              {formik.values.sessionDurations.map((duration, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                    onClick={() => removeSessionDuration(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6L18 18"></path>
                    </svg>
                  </Button>
                  
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <div className="w-full md:w-1/2">
                      <Label htmlFor={`sessionDurations[${index}].durationInMinutes`} className="text-sm font-medium mb-1 block">
                        Duration (minutes)
                      </Label>
                      <Input
                        id={`sessionDurations[${index}].durationInMinutes`}
                        name={`sessionDurations[${index}].durationInMinutes`}
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={duration.durationInMinutes}
                        className="h-12"
                      />
                    </div>
                    
                    <div className="w-full md:w-1/2">
                      <Label htmlFor={`sessionDurations[${index}].price`} className="text-sm font-medium mb-1 block">
                        Price (₹)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <Input
                          id={`sessionDurations[${index}].price`}
                          name={`sessionDurations[${index}].price`}
                          type="number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={duration.price}
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                onClick={addSessionDuration}
                className="w-full py-3 border-dashed border-2 hover:border-gray-300 transition-colors bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                Add Session Duration
              </Button>
              
              {formik.touched.sessionDurations && typeof formik.errors.sessionDurations === 'string' && (
                <div className="text-red-500 text-sm mt-2 animate-fade-in">
                  {formik.errors.sessionDurations}
                </div>
              )}
            </div>
          </div>

          {/* Available Dates Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4">Available Dates</h3>
            <div className="space-y-4">
              {formik.values.availableDates.map((dateSlot, dateIndex) => (
                <div key={dateIndex} className="p-4 border rounded-lg relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                    onClick={() => removeAvailableDate(dateIndex)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6L18 18"></path>
                    </svg>
                  </Button>
                  
                  <div className="mb-4">
                    <Label htmlFor={`availableDates[${dateIndex}].date`} className="text-sm font-medium mb-1 block">
                      Date
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id={`availableDates[${dateIndex}].date`}
                        name={`availableDates[${dateIndex}].date`}
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={dateSlot.date}
                        className="h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`availableDates[${dateIndex}].availableHours.startTime`} className="text-sm font-medium mb-1 block">
                        Start Time
                      </Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <Input
                          id={`availableDates[${dateIndex}].availableHours.startTime`}
                          name={`availableDates[${dateIndex}].availableHours.startTime`}
                          type="time"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={dateSlot.availableHours.startTime}
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`availableDates[${dateIndex}].availableHours.endTime`} className="text-sm font-medium mb-1 block">
                        End Time
                      </Label>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <Input
                          id={`availableDates[${dateIndex}].availableHours.endTime`}
                          name={`availableDates[${dateIndex}].availableHours.endTime`}
                          type="time"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={dateSlot.availableHours.endTime}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`availableDates[${dateIndex}].bufferTime`} className="text-sm font-medium mb-1 block">
                      Buffer Time (minutes)
                    </Label>
                    <Input
                      id={`availableDates[${dateIndex}].bufferTime`}
                      name={`availableDates[${dateIndex}].bufferTime`}
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={dateSlot.bufferTime}
                      className="h-12"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                onClick={addAvailableDate}
                className="w-full py-3 border-dashed border-2 hover:border-gray-300 transition-colors bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                Add Available Date
              </Button>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="location.city" className="text-sm font-medium mb-1 block">
                  City
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="location.city"
                    name="location.city"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.location.city}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location.state" className="text-sm font-medium mb-1 block">
                  State
                </Label>
                <Input
                  id="location.state"
                  name="location.state"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.state}
                  className="h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="location.country" className="text-sm font-medium mb-1 block">
                  Country
                </Label>
                <Input
                  id="location.country"
                  name="location.country"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.location.country}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Policies Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4">Policies</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
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
                
                <div>
                  <Label htmlFor="cancellationPolicy" className="text-sm font-medium mb-1 block">
                    Cancellation Policy
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                    <Textarea
                      id="cancellationPolicy"
                      name="cancellationPolicy"
                      placeholder="Describe your cancellation and refund policy"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cancellationPolicy}
                      className="pl-10 min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 animate-fade-in">
            <Button 
              type="submit" 
              className="w-full h-12 transition-all duration-300 shadow-sm hover:shadow-md bg-black hover:bg-gray-800"
            >
              Create Photography Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
