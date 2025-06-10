import React, { useState, useRef, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, X, Calculator, Navigation } from "lucide-react";
import { GoogleMap, Marker, LoadScript, Autocomplete, Libraries } from "@react-google-maps/api";
import { Booking } from "@/types/interfaces/User";
import { useVendorBookingPaymentMutation } from "@/hooks/payment/usePayment";
import { clientAxiosInstance } from "@/api/client.axios";
import { libraries } from "@/utils/config/map.config";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface ServiceLocation {
  lat: number;
  lng: number;
}

interface PaymentWrapperProps {
  amount: number;
  setIsSuccess: () => void;
  bookingData: Booking;
  onError: (error: string) => void;
  onPaymentStart: () => void;
  disabled?: boolean;
  serviceLocation: ServiceLocation;
}

const TRAVEL_RATE_PER_KM = 25; // ₹25 per km
const FREE_RADIUS_KM = 10;

const PaymentForm: React.FC<PaymentWrapperProps> = ({
  amount,
  setIsSuccess,
  onError,
  bookingData,
  onPaymentStart,
  disabled = false,
  serviceLocation,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [travelFee, setTravelFee] = useState(0);
  const [distance, setDistance] = useState(0);
  const [totalAmount, setTotalAmount] = useState(amount);
  const [addressInput, setAddressInput] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: proceedPayment } = useVendorBookingPaymentMutation();

  const handlePlaceChanged = () => {
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
        if (map) map.panTo(newLocation);
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newLocation: LocationData = {
        address: addressInput || `Lat: ${lat}, Lng: ${lng}`,
        lat,
        lng,
      };
      setUserLocation(newLocation);
      // Optionally reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results![0]) {
          setAddressInput(results![0].formatted_address);
          setUserLocation({ ...newLocation, address: results![0].formatted_address });
        }
      });
    }
  };

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  // Calculate distance and travel fee
  useEffect(() => {
    if (!userLocation || !google.maps.geometry) {
      setTravelFee(0);
      setDistance(0);
      setTotalAmount(amount);
      return;
    }

    // Calculate distance using Google Maps Geometry Library
    const serviceLocationLatLng = new google.maps.LatLng(serviceLocation.lat, serviceLocation.lng);
    const userLocationLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
    const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
      serviceLocationLatLng,
      userLocationLatLng
    );
    const distanceInKm = distanceInMeters / 1000;
    setDistance(distanceInKm);

    // Calculate travel fee if distance > 10km
    if (distanceInKm > FREE_RADIUS_KM) {
      const extraDistance = distanceInKm - FREE_RADIUS_KM;
      const fee = Math.ceil(extraDistance) * TRAVEL_RATE_PER_KM;
      setTravelFee(fee);
      setTotalAmount(amount + fee);
    } else {
      setTravelFee(0);
      setTotalAmount(amount);
    }
  }, [userLocation, serviceLocation, amount]);

  const handleRemoveLocation = () => {
    setUserLocation(null);
    setAddressInput("");
    setTravelFee(0);
    setDistance(0);
    setTotalAmount(amount);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    onPaymentStart();

    try {
      const updatedBookingData = {
        ...bookingData,
        userLocation: userLocation,
        travelFee: travelFee,
        totalAmount: totalAmount,
      };

      proceedPayment(
        {
          amount: totalAmount,
          purpose: "vendor-booking",
          bookingData: updatedBookingData,
          createrType: "Client",
          receiverType: "Vendor",
        },
        {
          onSuccess: async (data) => {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
              elements,
              clientSecret: data.clientSecret,
              confirmParams: {
                return_url: window.location.origin,
              },
              redirect: "if_required",
            });

            if (stripeError) {
              toast.error(stripeError.message || "Payment failed");
              setLoading(false);
            } else if (paymentIntent?.status === "succeeded") {
              try {
                await clientAxiosInstance.post("/client/confirm-payment", {
                  paymentIntentId: paymentIntent.id,
                });
                setIsSuccess();
                toast.success("Payment completed", {
                  description: "Your payment has been successfully completed.",
                });
              } catch (error) {
                console.error("Error in confirm payment =>", error);
              }
            }
            setLoading(false);
          },
          onError: (error: any) => {
            setLoading(false);
            toast.error(error.response?.data?.message || "Payment failed.");
          },
        }
      );
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Location Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Navigation className="h-5 w-5 text-blue-600" />
            Service Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Our service hub: {serviceLocation.lat.toFixed(4)}, {serviceLocation.lng.toFixed(4)}</span>
          </div>
        </CardContent>
      </Card>

      {/* User Location Input with Map */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-green-600" />
            Your Service Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
            libraries={libraries}
          >
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="address" className="text-sm font-medium">
                  Enter your preferred service address
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
                      placeholder="Start typing your address..."
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      className="pr-10"
                    />
                  </Autocomplete>
                  {userLocation && (
                    <button
                      onClick={handleRemoveLocation}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative w-full h-[300px] rounded-md overflow-hidden">
                <GoogleMap
                  center={userLocation || serviceLocation}
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
                  {userLocation && <Marker position={userLocation} />}
                </GoogleMap>
              </div>

              {/* Distance and Travel Fee Display */}
              {userLocation && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Distance Calculation</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>Distance from service hub: <span className="font-medium">{distance.toFixed(2)} km</span></p>
                    {distance > FREE_RADIUS_KM ? (
                      <div className="text-amber-700">
                        <p>Extra distance: {(distance - FREE_RADIUS_KM).toFixed(2)} km</p>
                        <p>Travel fee: <span className="font-bold">₹{travelFee.toFixed(2)}</span></p>
                      </div>
                    ) : (
                      <p className="text-green-700 font-medium">✓ Within free service radius</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </LoadScript>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Service Amount:</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
          {travelFee > 0 && (
            <div className="flex justify-between text-sm text-amber-700">
              <span>Travel Fee:</span>
              <span>₹{travelFee.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Element */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "apple_pay", "google_pay"],
            }}
          />
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={loading || disabled || !stripe || !elements}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </div>
        ) : (
          `Complete Payment - ₹${totalAmount.toFixed(2)}`
        )}
      </Button>

      {/* Additional Info */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Travel fees apply for locations beyond {FREE_RADIUS_KM}km from our service hub</p>
      </div>
    </div>
  );
};

export const PaymentWrapper: React.FC<PaymentWrapperProps> = (props) => {
  const stripeOptions = {
    mode: "payment" as const,
    amount: props.amount * 100, // Convert to cents
    currency: "inr",
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#2563eb",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <PaymentForm {...props} />
    </Elements>
  );
};