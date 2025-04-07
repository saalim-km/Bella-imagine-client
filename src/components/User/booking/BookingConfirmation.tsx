import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingState, IServiceResponse } from "@/types/vendor";
import { toast } from "sonner";
import { PaymentWrapper } from "@/components/stripe/PaymentForm";
import { Booking } from "@/types/User";

interface BookingConfirmationProps {
  service: IServiceResponse;
  bookingState: BookingState;
  onConfirmBooking: () => void;
  isOpen : boolean
  setIsBookingSucess : ()=> void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  service,
  bookingState,
  onConfirmBooking,
  setIsBookingSucess
}) => {
  const { selectedDate, selectedTimeSlot, selectedDuration , vendorId} = bookingState;
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "";

    try {
      const [hours, minutes] = timeString.split(":");
      let hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const bookingData : Booking = {
    bookingDate : selectedDate || '',
    serviceId : service._id || '',
    timeSlot : {startTime : selectedTimeSlot?.startTime || '' , endTime : selectedTimeSlot?.endTime || ''},
    totalPrice : selectedDuration?.price || 0,
    vendorId : vendorId || ''
  }

  console.log('final booking date : ',bookingData);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
          </div>

          <Separator />

          {selectedDuration && (
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span>Total Price:</span>
                <span>₹{selectedDuration.price.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-5">
      {selectedDate && selectedTimeSlot && selectedDuration && (
        <PaymentWrapper
          bookingData={bookingData}
          amount={selectedDuration.price}
          setIsSuccess={setIsBookingSucess}
          onError={handlePaymentError}
        />
      )}
      </div>
    </>
  );
};

export default BookingConfirmation;
