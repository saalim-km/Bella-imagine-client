import React, { useState } from "react";
import { AlertCircle, Plus, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PolicySectionProps {
  label: string;
  values: string[];
  updateValues: (values: string[]) => void;
  icon?: React.ReactNode;
}

export const PolicySection: React.FC<PolicySectionProps> = ({
  label,
  values,
  updateValues,
  icon,
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const addPolicy = () => {
    updateValues([...values, ""]);
  };

  const removePolicy = (index: number) => {
    if (values.length <= 1) {
      // Always keep at least one policy field
      const newValues = [""];
      updateValues(newValues);
      return;
    }
    
    const newValues = [...values];
    newValues.splice(index, 1);
    updateValues(newValues);
    
    // Remove error for this field
    const newErrors = [...errors];
    newErrors.splice(index, 1);
    setErrors(newErrors);
  };

  const updatePolicy = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    updateValues(newValues);
    
    // Clear error for this field if value is not empty
    if (value.trim()) {
      const newErrors = [...errors];
      newErrors[index] = "";
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-4">
      {values.map((policy, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-start">
            <div className="relative flex-1">
              {icon && (
                <span className="absolute left-3 top-3">{icon}</span>
              )}
              <Textarea
                value={policy}
                onChange={(e) => updatePolicy(index, e.target.value)}
                placeholder={`Enter ${label}`}
                className={`${icon ? "pl-10" : ""} min-h-[80px] ${
                  errors[index] ? "border-red-500" : ""
                }`}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePolicy(index)}
              className="ml-2 mt-2"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          {errors[index] && (
            <div className="text-red-500 text-sm flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors[index]}
            </div>
          )}
        </div>
      ))}
      
      <Button type="button" variant="outline" onClick={addPolicy} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add {label}
      </Button>
    </div>
  );
};
