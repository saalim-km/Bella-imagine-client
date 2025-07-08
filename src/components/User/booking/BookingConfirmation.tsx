import type React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MapPin } from "lucide-react";
import type { BookingState, IServiceResponse } from "@/types/interfaces/vendor";
import type { Booking } from "@/types/interfaces/User";
import { PaymentWrapper } from "@/components/stripe/PaymentForm";
import { FREE_RADIUS_KM } from "@/utils/helper/distance-calculator";
import { useQueryClient } from "@tanstack/react-query";

interface BookingConfirmationProps {
  service: IServiceResponse;
  bookingState: BookingState;
  onConfirmBooking: () => void;
  setIsBookingSuccess: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  service,
  bookingState,
  onConfirmBooking,
  setIsBookingSuccess,
  setIsLoading,
}) => {
  const {
    selectedDate,
    selectedTimeSlot,
    selectedDuration,
    vendorId,
    location,
    locationAddress,
    distance = 0,
    travelTime,
    travelFee = 0,
  } = bookingState;

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      let hour = Number.parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minutes} ${ampm}`;
    } catch (err) {
      console.log(err);
      return timeString;
    }
  };

  const isFormComplete = Boolean(
    selectedDate && selectedTimeSlot && selectedDuration
  );

  const basePrice = selectedDuration?.price || 0;
  const totalPrice = basePrice + travelFee;

  const bookingData: Booking = {
    bookingDate: selectedDate || "",
    serviceId: service._id || "",
    timeSlot: {
      startTime: selectedTimeSlot?.startTime || "",
      endTime: selectedTimeSlot?.endTime || "",
    },
    totalPrice,
    vendorId: vendorId || "",
    location:
      location.lat !== 0 && location.lng !== 0 ? location : { lat: 0, lng: 0 },
    distance,
    customLocation: locationAddress || "",
    travelTime: travelTime || "",
    travelFee: travelFee,
  };

  const handlePaymentError = () => {
    setIsLoading(false);
  };

  const queryCLient = useQueryClient();
  const handlePaymentStart = () => {
    if (!isFormComplete) {
      return false;
    }
    setIsLoading(true);
    return true;
  };

  const handlePaymentSuccess = () => {
    setIsLoading(false);
    setIsBookingSuccess();
    onConfirmBooking();
    queryCLient.invalidateQueries({ queryKey: ["photographer",vendorId] });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{service.serviceTitle}</span>
            </div>

            {selectedDuration && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {selectedDuration.durationInHours} hour
                  {selectedDuration.durationInHours !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            )}

            {selectedTimeSlot && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">
                  {formatTime(selectedTimeSlot.startTime)} -{" "}
                  {formatTime(selectedTimeSlot.endTime)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-start">
              <span className="text-muted-foreground">Location:</span>
              <div className="text-right max-w-[200px]">
                {locationAddress ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3 text-green-600" />
                      <span className="font-medium text-sm">
                        Custom location
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground break-words">
                      {locationAddress}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3 text-blue-600" />
                      <span className="font-medium text-sm">
                        Service location
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground break-words">
                      {service.location.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {distance > 0 && locationAddress && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="font-medium">{distance.toFixed(2)} km</span>
                </div>
                {travelTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travel Time:</span>
                    <span className="font-medium">{travelTime}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <Separator />

          {selectedDuration && (
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>Service Price:</span>
                <span>₹{basePrice.toFixed(2)}</span>
              </div>

              {travelFee > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Travel Fee:</span>
                  <span>₹{travelFee.toFixed(2)}</span>
                </div>
              )}

              {distance > FREE_RADIUS_KM && travelFee > 0 && (
                <div className="text-xs text-muted-foreground">
                  Extra distance: {(distance - FREE_RADIUS_KM).toFixed(2)} km
                  beyond free radius
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total Price:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>

        {!isFormComplete && (
          <CardFooter>
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Incomplete booking</AlertTitle>
              <AlertDescription>
                Please select date, time, and duration to proceed with booking.
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>

      {isFormComplete && (
        <PaymentWrapper
          toatlAmount={totalPrice}
          setIsSuccess={handlePaymentSuccess}
          bookingData={bookingData}
          onError={handlePaymentError}
          onPaymentStart={handlePaymentStart}
        />
      )}
    </div>
  );
};

export default BookingConfirmation;
