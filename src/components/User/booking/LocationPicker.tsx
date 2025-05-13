"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { GoogleMap, Marker, LoadScript, Autocomplete } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

// Default center (can be customized based on user's location)
const DEFAULT_CENTER = { lat: 9.9312, lng: 76.2673 }

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
  initialLocation?: { lat: number; lng: number }
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [marker, setMarker] = useState(initialLocation?.lat !== 0 ? initialLocation : DEFAULT_CENTER)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Try to get user's current location
  useEffect(() => {
    if (navigator.geolocation && initialLocation?.lat === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setMarker(userLocation)
          onLocationSelect(userLocation)
          if (map) map.panTo(userLocation)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [map, onLocationSelect, initialLocation])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      const newLocation = { lat, lng }
      setMarker(newLocation)
      onLocationSelect(newLocation)
    }
  }

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const newLocation = { lat, lng }
        setMarker(newLocation)
        onLocationSelect(newLocation)
        if (map) map.panTo(newLocation)
      }
    }
  }

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Location</CardTitle>
      </CardHeader>
      <CardContent>
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
                autocompleteRef.current = autocomplete
              }}
              onPlaceChanged={handlePlaceChanged}
            >
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for a location"
                className="w-full"
                aria-label="Search for a location"
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
                {marker && <Marker position={marker} />}
              </GoogleMap>
            </div>

            <p className="text-sm text-muted-foreground">
              Click on the map to select your exact location or search for an address above.
            </p>
          </div>
        </LoadScript>
      </CardContent>
    </Card>
  )
}

export default LocationPicker
