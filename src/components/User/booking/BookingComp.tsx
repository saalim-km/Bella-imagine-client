import React, { useState } from "react";
import { TimeSlot, BookingState, SessionDuration, IServiceResponse } from "@/types/vendor";
import { toast } from "sonner";
import ServiceDetails from "./ServiceDetails";
import DateSelector from "./DateSelector";
import TimeSlotSelector from "./TimeSlotSelector";
import BookingConfirmation from "./BookingConfirmation";
import { BookingSuccessModal } from "@/components/modals/BookingSuccess";
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface BookingPageProps {
  service: IServiceResponse;
  vendorId : string
}

const BookingPage: React.FC<BookingPageProps> = ({ service , vendorId }) => {
  const navgiate = useNavigate();
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>({
    selectedDate: null,
    selectedTimeSlot: null,
    selectedDuration: service.sessionDurations.length > 0 ? service.sessionDurations[0] : null,
    vendorId : vendorId
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
      vendorId : vendorId
    });
  };

  function moment() {
    throw new Error("Function not implemented.");
  }

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
            setIsBookingSucess={()=> setIsBookingSuccess(true)}
            isOpen={isBookingSuccess}
            service={service}
            bookingState={bookingState}
            onConfirmBooking={handleConfirmBooking}
          />
        </div>

        <BookingSuccessModal
        isOpen={isBookingSuccess}
        onClose={()=> {
          setIsBookingSuccess(false)
          navgiate('/');
        }}
        eventDate={bookingState.selectedDate || ''}
        eventName={service.serviceTitle}
        />  
      </div>
    </div>
  );
};

export default BookingPage;