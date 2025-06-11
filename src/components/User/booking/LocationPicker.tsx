"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, X, Calculator, Navigation, Loader2 } from "lucide-react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { toast } from "sonner";
import {
  calculateDistanceAndTime,
  TRAVEL_RATE_PER_KM,
  FREE_RADIUS_KM,
} from "@/utils/helper/distance-calculator";
import { libraries } from "@/utils/config/map.config";

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface ServiceLocation {
  address: string;
  lat: number;
  lng: number;
}

interface LocationSelectorProps {
  serviceLocation: ServiceLocation;
  onLocationChange: (
    location: LocationData | null,
    distance: number,
    travelTime: string,
    travelFee: number
  ) => void;
  isBookingComplete: boolean;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  serviceLocation,
  onLocationChange,
  isBookingComplete,
  disabled = false,
}) => {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: number;
    travelTime: string;
    travelFee: number;
  } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDistanceCalculation = useCallback(
    async (location: LocationData) => {
      if (!isBookingComplete) {
        return;
      }

      setIsCalculating(true);

      try {
        const result = await calculateDistanceAndTime(
          { lat: serviceLocation.lat, lng: serviceLocation.lng },
          { lat: location.lat, lng: location.lng }
        );

        setDistanceInfo(result);
        onLocationChange(
          location,
          result.distance,
          result.travelTime,
          result.travelFee
        );

        if (result.distance > FREE_RADIUS_KM) {
          toast.info(`Travel fee applied: ₹${result.travelFee}`, {
            description: `Distance: ${result.distance.toFixed(2)}km (${
              result.travelTime
            })`,
          });
        } else {
          toast.success("Within free service area!", {
            description: `Distance: ${result.distance.toFixed(2)}km (${
              result.travelTime
            })`,
          });
        }
      } catch (error) {
        console.error("Distance calculation error:", error);
        toast.error("Unable to calculate distance", {
          description: "Proceeding without travel fee calculation.",
        });

        setDistanceInfo(null);
        onLocationChange(location, 0, "", 0);
      } finally {
        setIsCalculating(false);
      }
    },
    [serviceLocation, onLocationChange, isBookingComplete]
  );

  const handlePlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location && place.formatted_address) {
        const newLocation: LocationData = {
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setUserLocation(newLocation);
        setAddressInput(place.formatted_address);

        if (map) {
          map.panTo(newLocation);
        }

        handleDistanceCalculation(newLocation);
      }
    }
  }, [map, handleDistanceCalculation]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!isMapLoaded || !window.google || disabled || !e.latLng) {
        return;
      }

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const newLocation: LocationData = {
            address: results[0].formatted_address,
            lat,
            lng,
          };

          setUserLocation(newLocation);
          setAddressInput(results[0].formatted_address);
          handleDistanceCalculation(newLocation);
        } else {
          const newLocation: LocationData = {
            address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
            lat,
            lng,
          };

          setUserLocation(newLocation);
          setAddressInput(newLocation.address);
          handleDistanceCalculation(newLocation);
        }
      });
    },
    [disabled, handleDistanceCalculation, isMapLoaded]
  );

  const handleRemoveLocation = useCallback(() => {
    setUserLocation(null);
    setAddressInput("");
    setDistanceInfo(null);
    onLocationChange(null, 0, "", 0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    toast.success("Location removed", {
      description: "Travel fee has been removed from your booking.",
    });
  }, [onLocationChange]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setIsMapLoaded(true);

    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.panTo(userLoc);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [userLocation]);

  useEffect(() => {
    if (isBookingComplete && userLocation && !distanceInfo && !isCalculating) {
      handleDistanceCalculation(userLocation);
    }
  }, [
    isBookingComplete,
    userLocation,
    distanceInfo,
    isCalculating,
    handleDistanceCalculation,
  ]);

  // Define marker icons only when Google Maps API is loaded
  const serviceMarkerIcon = isMapLoaded
    ? {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="white" strokeWidth="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(32, 32),
      }
    : undefined;

  const userMarkerIcon = isMapLoaded
    ? {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#16a34a" stroke="white" strokeWidth="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
        scaledSize: new window.google.maps.Size(32, 32),
      }
    : undefined;

  return (
    <div className="space-y-4">
      {/* Service Location Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Navigation className="h-5 w-5 text-blue-600" />
            Service Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{serviceLocation.address}</span>
          </div>
        </CardContent>
      </Card>

      {/* Location Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-green-600" />
            Where should we meet you? (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
            libraries={libraries}
            onLoad={() => setIsMapLoaded(true)}
            onError={() => {
              toast.error("Failed to load Google Maps API");
              setIsMapLoaded(false);
            }}
          >
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="address" className="text-sm font-medium">
                  Enter your preferred service location (optional)
                </Label>
                <div className="relative mt-1">
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <Input
                      ref={inputRef}
                      id="address"
                      type="text"
                      placeholder="Start typing your address or click on the map..."
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      className="pr-10"
                      disabled={disabled || !isMapLoaded}
                    />
                  </Autocomplete>
                  {userLocation && (
                    <Button
                      onClick={handleRemoveLocation}
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      type="button"
                      disabled={disabled || !isMapLoaded}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative w-full h-[300px] rounded-md overflow-hidden border">
                {isMapLoaded ? (
                  <GoogleMap
                    center={userLocation || serviceLocation || { lat: 9.9312, lng: 76.2673 }}
                    zoom={userLocation ? 15 : 12}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    onClick={handleMapClick}
                    onLoad={handleMapLoad}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                      zoomControl: true,
                    }}
                  >
                    {serviceMarkerIcon && (
                      <Marker
                        position={serviceLocation}
                        icon={serviceMarkerIcon}
                        title="Service Location"
                      />
                    )}
                    {userLocation && userMarkerIcon && (
                      <Marker
                        position={userLocation}
                        icon={userMarkerIcon}
                        title="Your Location"
                      />
                    )}
                  </GoogleMap>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading map...
                    </span>
                  </div>
                )}
              </div>

              {/* Distance Information */}
              {isCalculating && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="font-medium text-blue-800">
                      Calculating distance...
                    </span>
                  </div>
                </div>
              )}

              {!isBookingComplete && userLocation && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-amber-800">
                      Complete booking details to calculate travel fee
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Distance and travel fees will be calculated once you select
                    date, time, and duration.
                  </p>
                </div>
              )}

              {distanceInfo && userLocation && isBookingComplete && (
                <div
                  className={`p-4 rounded-lg ${
                    distanceInfo.travelFee > 0 ? "bg-amber-50" : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calculator
                      className={`h-4 w-4 ${
                        distanceInfo.travelFee > 0
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        distanceInfo.travelFee > 0
                          ? "text-amber-800"
                          : "text-green-800"
                      }`}
                    >
                      Distance Calculation
                    </span>
                  </div>
                  <div className="text-sm space-y-1 mt-2">
                    <p>
                      Distance from service hub:{" "}
                      <span className="font-medium">
                        {distanceInfo.distance.toFixed(2)} km
                      </span>
                    </p>
                    <p>
                      Estimated travel time:{" "}
                      <span className="font-medium">
                        {distanceInfo.travelTime}
                      </span>
                    </p>
                    {distanceInfo.travelFee > 0 ? (
                      <div className="text-amber-700">
                        <p>
                          Extra distance:{" "}
                          {(distanceInfo.distance - FREE_RADIUS_KM).toFixed(2)}{" "}
                          km
                        </p>
                        <p>
                          Travel fee:{" "}
                          <span className="font-bold">
                            ₹{distanceInfo.travelFee.toFixed(2)}
                          </span>{" "}
                          (₹{TRAVEL_RATE_PER_KM}/km)
                        </p>
                      </div>
                    ) : (
                      <p className="text-green-700 font-medium">
                        ✓ Within free service radius ({FREE_RADIUS_KM}km)
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </LoadScript>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSelector;