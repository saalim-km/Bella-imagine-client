
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FormikErrors } from 'formik';

interface SectionErrorsProps {
  errors: FormikErrors<any>;
  section: string;
}

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
    session: ['sessionDurations', 'features'],
    location: ['location', 'equipment'],
    availability: ['availableDates'],
    portfolio: ['portfolioImages'],
    policies: ['cancellationPolicies', 'termsAndConditions']
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

export const SectionErrors: React.FC<SectionErrorsProps> = ({ errors, section }) => {
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
