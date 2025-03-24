
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, X } from "lucide-react";

interface SessionDuration {
  durationInHours: number;
  price: number;
}

interface SessionDurationManagerProps {
  durations: SessionDuration[];
  updateDurations: (durations: SessionDuration[]) => void;
}

export const SessionDurationManager: React.FC<SessionDurationManagerProps> = ({ 
  durations, 
  updateDurations 
}) => {
  const addDuration = () => {
    updateDurations([...durations, { durationInHours: 1, price: 0 }]);
  };

  const removeDuration = (index: number) => {
    const newDurations = durations.filter((_, i) => i !== index);
    updateDurations(newDurations);
  };

  const updateDuration = (index: number, field: keyof SessionDuration, value: number) => {
    const newDurations = [...durations];
    newDurations[index][field] = value;
    updateDurations(newDurations);
  };

  return (
    <div className="space-y-4">
      {durations.length === 0 && (
        <div className="text-center py-6 border border-dashed rounded-lg">
          <Clock className="mx-auto h-10 w-10  mb-2" />
          <p className="">No durations added yet</p>
        </div>
      )}
      
      {durations.map((duration, index) => (
        <div key={index} className="p-4 border rounded-lg relative animate-fade-in">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-70 hover:opacity-100"
            onClick={() => removeDuration(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor={`durations[${index}].durationInHours`} className="text-sm font-medium mb-1 block">
                Duration (hours)
              </Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 " />
                <Input
                  id={`durations[${index}].durationInHours`}
                  name={`durations[${index}].durationInHours`}
                  type="number"
                  step="0.5"
                  onChange={(e) => updateDuration(index, 'durationInHours', parseFloat(e.target.value))}
                  value={duration.durationInHours}
                  className="h-12"
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <Label htmlFor={`durations[${index}].price`} className="text-sm font-medium mb-1 block">
                Price (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2  font-medium">₹</span>
                <Input
                  id={`durations[${index}].price`}
                  name={`durations[${index}].price`}
                  type="number"
                  onChange={(e) => updateDuration(index, 'price', parseFloat(e.target.value))}
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
        onClick={addDuration}
        className="w-full py-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Session Duration
      </Button>
    </div>
  );
};