
import React from 'react';
import { useField, ErrorMessage as FormikErrorMessage } from 'formik';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormikErrors } from 'formik';

// Helper to convert possibly nested errors to flat string array
const flattenErrors = (errors: any): string[] => {
  if (typeof errors === 'string') return [errors];
  if (Array.isArray(errors)) {
    return errors
      .map(error => typeof error === 'string' ? error : flattenErrors(error))
      .flat();
  }
  if (errors && typeof errors === 'object') {
    return Object.values(errors)
      .map(error => flattenErrors(error))
      .flat();
  }
  return [];
};

// Determines if errors belong to the specified section
const getErrorsForSection = (errors: FormikErrors<any>, section: string): string[] => {
  const sectionErrors: string[] = [];
  
  // Map fields to their respective sections
  const sectionFieldMap: Record<string, string[]> = {
    basic: ['serviceTitle', 'category', 'yearsOfExperience', 'styleSpecialty', 'tags', 'serviceDescription'],
    session: ['sessionDurations', 'features', 'depositRequirement'],
    location: ['location', 'equipment'],
    availability: ['availableDates', 'recurringAvailability', 'bufferTime', 'maxBookingsPerDay', 'blackoutDates'],
    portfolio: ['portfolioImages', 'customFields'],
    policies: ['paymentRequired', 'cancellationPolicies', 'termsAndConditions']
  };
  
  // Get field names for the current section
  const sectionFields = sectionFieldMap[section] || [];
  
  // Extract errors for the section fields
  sectionFields.forEach(field => {
    if (errors[field]) {
      sectionErrors.push(...flattenErrors(errors[field]));
    }
  });
  
  return sectionErrors;
};

export const SectionErrors: React.FC<{
  errors: FormikErrors<any>;
  section: string;
}> = ({ errors, section }) => {
  const sectionErrors = getErrorsForSection(errors, section);
  
  if (sectionErrors.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="mb-6 animate-fade-in">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {sectionErrors.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </AlertDescription>
    </Alert>
  );
};

interface FormikInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  icon?: React.ReactNode;
}

interface FormikTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

interface FormikSelectProps {
  name: string;
  label?: string;
  options: { value: string; label: string; }[];
  placeholder?: string;
  className?: string;
}

export const ErrorMessage: React.FC<{ name: string }> = ({ name }) => (
  <FormikErrorMessage
    name={name}
    render={(msg) => (
      <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
        <AlertCircle className="h-3 w-3 mr-1" />
        {msg}
      </div>
    )}
  />
);

export const FormikInput: React.FC<FormikInputProps> = ({ 
  name, 
  label, 
  placeholder, 
  type = "text",
  className = "",
  icon
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  
  return (
    <div className="space-y-1">
      {label && (
        <Label 
          htmlFor={name} 
          className={`text-sm font-medium mb-1 block ${hasError ? 'text-red-500' : ''}`}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          className={`${icon ? 'pl-10' : ''} ${hasError ? 'border-red-500' : ''} ${className}`}
          {...field}
        />
      </div>
      
      <ErrorMessage name={name} />
    </div>
  );
};

export const FormikTextarea: React.FC<FormikTextareaProps> = ({ 
  name, 
  label, 
  placeholder,
  className = "",
  icon
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;
  
  return (
    <div className="space-y-1">
      {label && (
        <Label 
          htmlFor={name} 
          className={`text-sm font-medium mb-1 block ${hasError ? 'text-red-500' : ''}`}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-500">
            {icon}
          </div>
        )}
        
        <Textarea
          id={name}
          placeholder={placeholder}
          className={`${icon ? 'pl-10' : ''} ${hasError ? 'border-red-500' : ''} ${className}`}
          {...field}
        />
      </div>
      
      <ErrorMessage name={name} />
    </div>
  );
};

export const FormikSelect: React.FC<FormikSelectProps> = ({ 
  name, 
  label, 
  options,
  placeholder,
  className = ""
}) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;
  
  return (
    <div className="space-y-1">
      {label && (
        <Label 
          htmlFor={name} 
          className={`text-sm font-medium mb-1 block ${hasError ? 'text-red-500' : ''}`}
        >
          {label}
        </Label>
      )}
      
      <Select
        value={field.value}
        onValueChange={(value) => helpers.setValue(value)}
      >
        <SelectTrigger 
          id={name}
          className={`${hasError ? 'border-red-500' : ''} ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <ErrorMessage name={name} />
    </div>
  );
};
