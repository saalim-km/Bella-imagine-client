import { useRef, useEffect } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const LocationInput = ({ value, onChange, error }: {
  value: string
  onChange: (value: string, coords?: { lat: number; lng: number }) => void
  error?: string
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      const address = place.formatted_address || place.name
      const lat = place.geometry?.location?.lat()
      const lng = place.geometry?.location?.lng()

      onChange(address!, lat && lng ? { lat, lng } : undefined)
    }
  }

  return (
    <div>
      <Label htmlFor="location" className="text-base font-medium">
        Location (city or state)
      </Label>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <Input
          ref={inputRef}
          id="location"
          type="text"
          className="mt-1"
          placeholder="Search for a city or state"
          defaultValue={value}
        />
      </Autocomplete>
    </div>
  )
}

export default LocationInput;