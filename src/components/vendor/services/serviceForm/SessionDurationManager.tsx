
import React, { useState } from "react";
import { AlertCircle, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SessionDuration } from "@/types/vendor";

interface SessionDurationManagerProps {
  durations: SessionDuration[];
  updateDurations: (durations: SessionDuration[]) => void;
}

export const SessionDurationManager: React.FC<SessionDurationManagerProps> = ({
  durations,
  updateDurations,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addDuration = () => {
    const newDurations = [
      ...durations,
      { durationInHours: 1, price: 0 },
    ];
    updateDurations(newDurations);
  };

  const removeDuration = (index: number) => {
    if (durations.length <= 1) return;
    
    const newDurations = [...durations];
    newDurations.splice(index, 1);
    updateDurations(newDurations);
    
    // Clear errors for this duration
    const newErrors = { ...errors };
    delete newErrors[`duration-₹{index}`];
    delete newErrors[`price-₹{index}`];
    setErrors(newErrors);
  };

  const updateDuration = (index: number, field: keyof SessionDuration, value: number) => {
    const newDurations = [...durations];
    
    // Validate input
    let error = "";
    if (field === "durationInHours") {
      if (value <= 0) {
        error = "Duration must be positive";
      }
    } else if (field === "price") {
      if (value < 0) {
        error = "Price cannot be negative";
      }
    }
    
    // Update errors
    setErrors({
      ...errors,
      [`₹{field}-₹{index}`]: error
    });
    
    // Only update if no error
    if (!error) {
      newDurations[index][field] = value;
      updateDurations(newDurations);
    }
  };

  return (
    <div className="space-y-4">
      {durations.map((duration, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Session Duration {index + 1}</h4>
            {durations.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDuration(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Duration (hours)</Label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                value={duration.durationInHours}
                onChange={(e) => updateDuration(index, "durationInHours", parseFloat(e.target.value))}
                className={errors[`duration-₹{index}`] ? "border-red-500" : ""}
              />
              {errors[`duration-₹{index}`] && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors[`duration-₹{index}`]}
                </div>
              )}
            </div>
            
            <div>
              <Label className="text-sm">Price (₹)</Label>
              <Input
                type="number"
                min="0"
                value={duration.price}
                onChange={(e) => updateDuration(index, "price", parseFloat(e.target.value))}
                className={errors[`price-₹{index}`] ? "border-red-500" : ""}
              />
              {errors[`price-₹{index}`] && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors[`price-₹{index}`]}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      <Button type="button" variant="outline" onClick={addDuration} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Duration Option
      </Button>
    </div>
  );
};
