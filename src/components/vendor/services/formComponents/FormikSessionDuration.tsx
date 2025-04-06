import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X, Clock, DollarSign } from "lucide-react";
import { ErrorMessage } from './FormikAdapter';

interface SessionDuration {
  durationInHours: number;
  price: number;
}

interface FormikSessionDurationManagerProps {
  name: string;
  label: string;
}

export const FormikSessionDurationManager: React.FC<FormikSessionDurationManagerProps> = ({ 
  name,
  label
}) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const durations: SessionDuration[] = values[name] || [];
  
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium mb-2 block">
        {label}
      </Label>
      
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <div className="space-y-4">
            {durations.length === 0 && (
              <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No session durations added yet</p>
              </div>
            )}
            
            {durations.map((duration, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg relative animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-70 hover:opacity-100"
                  onClick={() => {
                    arrayHelpers.remove(index);
                    // Make sure the field is marked as touched to trigger validation
                    setFieldTouched(name, true, true);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label 
                      htmlFor={`${name}.${index}.durationInHours`} 
                      className="text-sm font-medium mb-1 block"
                    >
                      Duration (hours)
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id={`${name}.${index}.durationInHours`}
                        name={`${name}.${index}.durationInHours`}
                        type="number"
                        step="0.5"
                        min="0.5"
                        placeholder="Duration in hours"
                        value={duration.durationInHours}
                        onChange={(e) => {
                          setFieldValue(`${name}.${index}.durationInHours`, Number(e.target.value));
                        }}
                        onBlur={() => {
                          setFieldTouched(`${name}.${index}.durationInHours`, true, true);
                          setFieldTouched(name, true, true);
                        }}
                        className="pl-10 h-12"
                      />
                    </div>
                    <ErrorMessage name={`${name}.${index}.durationInHours`} />
                  </div>
                  
                  <div>
                    <Label 
                      htmlFor={`${name}.${index}.price`} 
                      className="text-sm font-medium mb-1 block"
                    >
                      Price
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id={`${name}.${index}.price`}
                        name={`${name}.${index}.price`}
                        type="number"
                        min="1"
                        placeholder="Price"
                        value={duration.price}
                        onChange={(e) => {
                          setFieldValue(`${name}.${index}.price`, Number(e.target.value));
                        }}
                        onBlur={() => {
                          setFieldTouched(`${name}.${index}.price`, true, true);
                          setFieldTouched(name, true, true);
                        }}
                        className="pl-10 h-12"
                      />
                    </div>
                    <ErrorMessage name={`${name}.${index}.price`} />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                arrayHelpers.push({ durationInHours: 1, price: 0 });
              }}
              className="w-full transition-all duration-200 hover:bg-gray-50"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Session Duration
            </Button>
          </div>
        )}
      />
      
      <ErrorMessage name={name} />
    </div>
  );
};
