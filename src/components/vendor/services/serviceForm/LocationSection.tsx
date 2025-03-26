
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Location } from "@/types/vendor";

interface LocationSectionProps {
  location: Location;
  updateLocation: (location: Location) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  updateLocation,
}) => {
  const handleChange = (field: string, value: string | boolean | number) => {
    if (field.startsWith("options.")) {
      const optionName = field.split(".")[1] as "studio" | "onLocation";
      updateLocation({
        ...location,
        options: {
          ...location.options,
          [optionName]: value as boolean
        }
      });
    } else {
      updateLocation({
        ...location,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Studio Service</Label>
          <Switch
            checked={location.options.studio}
            onCheckedChange={(checked) => handleChange("options.studio", checked)}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">On-Location Service</Label>
          <Switch
            checked={location.options.onLocation}
            onCheckedChange={(checked) => handleChange("options.onLocation", checked)}
          />
        </div>
        
        {location.options.onLocation && (
          <div>
            <Label className="text-sm font-medium">Travel Fee ($)</Label>
            <Input
              type="number"
              min="0"
              value={location.travelFee}
              onChange={(e) => handleChange("travelFee", parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">Service Location</h4>
        
        <div>
          <Label className="text-sm font-medium">City</Label>
          <Input
            value={location.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">State/Province</Label>
          <Input
            value={location.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">Country</Label>
          <Input
            value={location.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
