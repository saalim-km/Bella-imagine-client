import React, { useState } from "react";
import { TimeSlot, BookingState, SessionDuration, IServiceResponse } from "@/types/vendor";
import { toast } from "sonner";
import ServiceDetails from "./ServiceDetails";
import DateSelector from "./DateSelector";
import TimeSlotSelector from "./TimeSlotSelector";
import BookingConfirmation from "./BookingConfirmation";

interface BookingPageProps {
  service: IServiceResponse;
}

const BookingPage: React.FC<BookingPageProps> = ({ service }) => {
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedDate: null,
    selectedTimeSlot: null,
    selectedDuration: service.sessionDurations.length > 0 ? service.sessionDurations[0] : null,
    agreedToTerms: true, // Default to true since we're removing the checkbox
  });

  const handleDateSelect = (date: string) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: null,
    }));
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setBookingState((prev) => ({
      ...prev,
      selectedTimeSlot: timeSlot,
    }));
  };

  const handleDurationSelect = (duration: SessionDuration) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDuration: duration,
    }));
  };

  const handleConfirmBooking = () => {
    toast.success("Booking confirmed!", {
      description: "Your booking has been confirmed successfully.",
    });

    console.log("Booking confirmed:", {
      service: service.serviceTitle,
      date: bookingState.selectedDate,
      timeSlot: bookingState.selectedTimeSlot,
      duration: bookingState.selectedDuration,
    });

    setBookingState({
      selectedDate: null,
      selectedTimeSlot: null,
      selectedDuration: service.sessionDurations.length > 0 ? service.sessionDurations[0] : null,
      agreedToTerms: true,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ServiceDetails
            service={service}
            selectedDuration={bookingState.selectedDuration}
            onDurationSelect={handleDurationSelect}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateSelector
              availableDates={service.availableDates}
              selectedDate={bookingState.selectedDate}
              onDateSelect={handleDateSelect}
            />

            <TimeSlotSelector
              availableDates={service.availableDates}
              selectedDate={bookingState.selectedDate}
              selectedTimeSlot={bookingState.selectedTimeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          </div>
        </div>

        <div>
          <BookingConfirmation
            service={service}
            bookingState={bookingState}
            onConfirmBooking={handleConfirmBooking}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;