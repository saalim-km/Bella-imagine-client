
import React from 'react';
import { FieldArray, useField, useFormikContext } from 'formik';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, List } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from './FormikAdapter';

interface FormikFeaturesListProps {
  name: string;
  label: string;
  placeholder?: string;
}

export const FormikFeaturesList: React.FC<FormikFeaturesListProps> = ({ 
  name,
  label,
  placeholder
}) => {
  const [field, meta] = useField(name);
  const { setFieldTouched } = useFormikContext();
  const hasError = meta.touched && !!meta.error;
  const values = field.value || [];
  
  return (
    <div className="space-y-1">
      <Label 
        htmlFor={name} 
        className={`text-sm font-medium mb-1 block ${hasError ? 'text-red-500' : ''}`}
      >
        {label}
      </Label>
      
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <div className="space-y-3">
            {values.length === 0 && (
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                <List className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No {label.toLowerCase()} added yet</p>
              </div>
            )}
            
            {values.map((item: string, index: number) => (
              <div 
                key={index} 
                className="flex items-center gap-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex-grow">
                  <div className="relative">
                    <List className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      name={`${name}.${index}`}
                      value={item}
                      onChange={(e) => {
                        arrayHelpers.replace(index, e.target.value);
                      }}
                      onBlur={() => {
                        setFieldTouched(`${name}.${index}`, true, true);
                        setFieldTouched(name, true, true);
                      }}
                      className={`pl-10 service-input ${meta.touched && meta.error ? 'border-red-500' : ''}`}
                      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                    />
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    arrayHelpers.remove(index);
                    // Make sure the field is marked as touched to trigger validation
                    setFieldTouched(name, true, true);
                  }}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                arrayHelpers.push("");
                // Don't mark as touched when adding a new empty item
              }}
              className="w-full transition-all duration-200 hover:bg-gray-50"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add {label}
            </Button>
          </div>
        )}
      />
      
      <ErrorMessage name={name} />
    </div>
  );
};