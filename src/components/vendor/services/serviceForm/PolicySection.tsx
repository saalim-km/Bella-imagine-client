
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, ScrollText } from "lucide-react";

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
  icon = <ScrollText className="h-4 w-4 text-gray-500" />
}) => {
  const addItem = () => {
    updateValues([...values, ""]);
  };

  const removeItem = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    updateValues(newValues);
  };

  const updateItem = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    updateValues(newValues);
  };

  return (
    <div className="space-y-3">
      {values.length === 0 && (
        <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
          {icon}
          <p className=" mt-2">No {label.toLowerCase()} added yet</p>
        </div>
      )}
      
      {values.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center gap-2 animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex-grow">
            <div className="relative">
              {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</span>}
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="pl-10 service-input"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
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
        onClick={addItem}
        className="w-full transition-all duration-200 "
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add {label}
      </Button>
    </div>
  );
};
