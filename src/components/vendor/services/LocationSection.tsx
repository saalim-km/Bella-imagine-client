
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface Location {
  options: {
    studio: boolean;
    onLocation: boolean;
  };
  travelFee: number;
  city: string;
  state: string;
  country: string;
}

interface LocationSectionProps {
  location: Location;
  updateLocation: (location: Location) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  updateLocation
}) => {
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      updateLocation({
        ...location,
        options: {
          ...location.options,
          [name.split('.').pop() as string]: checked
        }
      });
    } else {
      updateLocation({
        ...location,
        [name.split('.').pop() as string]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Location Options</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              id="location.options.studio"
              name="location.options.studio"
              type="checkbox"
              checked={location.options.studio}
              onChange={handleLocationChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="location.options.studio" className="ml-2 block text-sm font-medium text-gray-700">
              Studio
            </Label>
          </div>
          
          <div className="flex items-center">
            <input
              id="location.options.onLocation"
              name="location.options.onLocation"
              type="checkbox"
              checked={location.options.onLocation}
              onChange={handleLocationChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="location.options.onLocation" className="ml-2 block text-sm font-medium text-gray-700">
              On Location
            </Label>
          </div>
        </div>
      </div>
      
      {location.options.onLocation && (
        <div>
          <Label htmlFor="location.travelFee" className="text-sm font-medium mb-1 block">
            Travel Fee (₹)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <Input
              id="location.travelFee"
              name="location.travelFee"
              type="number"
              value={location.travelFee}
              onChange={handleLocationChange}
              className="pl-10 h-12"
            />
          </div>
        </div>
      )}

      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="location.city" className="text-sm font-medium mb-1 block">
            City
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              id="location.city"
              name="location.city"
              type="text"
              value={location.city}
              onChange={handleLocationChange}
              className="pl-10 h-12"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="location.state" className="text-sm font-medium mb-1 block">
            State
          </Label>
          <Input
            id="location.state"
            name="location.state"
            type="text"
            value={location.state}
            onChange={handleLocationChange}
            className="h-12"
          />
        </div>
        
        <div>
          <Label htmlFor="location.country" className="text-sm font-medium mb-1 block">
            Country
          </Label>
          <Input
            id="location.country"
            name="location.country"
            type="text"
            value={location.country}
            onChange={handleLocationChange}
            className="h-12"
          />
        </div>
      </div>
    </div>
  );
};
