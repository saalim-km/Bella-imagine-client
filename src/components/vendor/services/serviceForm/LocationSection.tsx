import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Location } from "@/types/interfaces/vendor";
import {
  GoogleMap,
  Marker,
  LoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

const DEFAULT_CENTER = { lat: 9.9312, lng: 76.2673, travelFee: -1, address: '' };

interface LocationSectionProps {
  location: Location;
  updateLocation: (location: Location) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  updateLocation,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState(location.address || "");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [marker, setMarker] = useState<Omit<Location, "address">>(
    location.lat && location.lng ? location : DEFAULT_CENTER
  );

  // Get current location if location is empty
  useEffect(() => {
    if ((!location.lat || !location.lng) && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            travelFee: location.travelFee ?? -1,
            address: address || ''
          };
          setMarker(userLoc);
          updateLocation(userLoc);
          map?.panTo(userLoc);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [location.lat, location.lng, map, address]);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const newAddress = place.formatted_address || address;
      setAddress(newAddress);

      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newLoc = { lat, lng, travelFee: location.travelFee ?? -1, address: newAddress };
        setMarker({ lat, lng, travelFee: location.travelFee ?? -1 });
        updateLocation(newLoc);
        map?.panTo({ lat, lng });
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newLoc = { lat, lng, travelFee: location.travelFee ?? -1, address };
      setMarker({ lat, lng, travelFee: location.travelFee ?? -1 });
      updateLocation(newLoc);
    }
  };

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setIsLoading(false);
  };

  const handleFieldChange = (
    field: string,
    value: string | number | boolean
  ) => {
    updateLocation({ ...location, [field]: value, address });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    updateLocation({ ...location, address: newAddress });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">On-Location Service</Label>
          <Switch
            checked={location.travelFee >= 0}
            onCheckedChange={(checked) =>
              handleFieldChange("travelFee", checked ? 0 : -1)
            }
          />
        </div>

        {location.travelFee !== -1 && (
          <div>
            <Label className="text-sm font-medium">Travel Fee ($)</Label>
            <Input
              type="number"
              min="500"
              value={location.travelFee}
              onChange={(e) =>
                handleFieldChange("travelFee", parseFloat(e.target.value))
              }
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Service Location</h4>

        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
          libraries={["places"]}
          loadingElement={
            <div className="flex justify-center items-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading map...</span>
            </div>
          }
        >
          <div className="space-y-4">
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={handlePlaceChanged}
            >
              <Input
                ref={inputRef}
                type="text"
                placeholder="Select a location you provide service"
                className="w-full"
                aria-label="Search for a location"
                value={address}
                onChange={handleAddressChange}
              />
            </Autocomplete>

            <div className="relative w-full h-[300px] rounded-md overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-muted/50">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <GoogleMap
                center={marker}
                zoom={14}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                onClick={handleMapClick}
                onLoad={handleMapLoad}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                <Marker position={marker} />
              </GoogleMap>
            </div>
          </div>
        </LoadScript>
      </div>
    </div>
  );
};