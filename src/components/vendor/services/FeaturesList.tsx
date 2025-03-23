
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, List } from "lucide-react";

interface FeaturesListProps {
  label: string;
  values: string[];
  updateValues: (values: string[]) => void;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ 
  label, 
  values, 
  updateValues 
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
          <List className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-500">No {label.toLowerCase()} added yet</p>
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
              <List className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
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
        className="w-full transition-all duration-200 hover:bg-gray-50"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add {label}
      </Button>
    </div>
  );
};
