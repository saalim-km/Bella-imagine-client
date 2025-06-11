"use client"

import type React from "react"
import { useState } from "react"
import type { TimeSlot, BookingState, SessionDuration, IServiceResponse } from "@/types/interfaces/vendor"
import { toast } from "sonner"
import ServiceDetails from "./ServiceDetails"
import DateSelector from "./DateSelector"
import TimeSlotSelector from "./TimeSlotSelector"
import BookingConfirmation from "./BookingConfirmation"
import LocationSelector from "./LocationPicker"
import { BookingSuccessModal } from "@/components/modals/BookingSuccess"
import { useNavigate } from "react-router-dom"
import { LoadingOverlay } from "@/components/modals/LoadingProcessBooking"

interface BookingPageProps {
  service: IServiceResponse
  vendorId: string
}

const BookingPage: React.FC<BookingPageProps> = ({ service, vendorId }) => {
  const navigate = useNavigate()
  const [isBookingSuccess, setIsBookingSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [bookingState, setBookingState] = useState<BookingState>({
    selectedDate: null,
    selectedTimeSlot: null,
    selectedDuration: service.sessionDurations.length > 0 ? service.sessionDurations[0] : null,
    vendorId,
    location: { lat: 0, lng: 0 },
    distance: 0,
    travelTime: "",
  })

  // Check if all required booking fields are complete (excluding location)
  const isBookingComplete = Boolean(
    bookingState.selectedDate && bookingState.selectedTimeSlot && bookingState.selectedDuration,
  )

  const handleDateSelect = (date: string) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: null,
    }))
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setBookingState((prev) => ({
      ...prev,
      selectedTimeSlot: timeSlot,
    }))
  }

  const handleDurationSelect = (duration: SessionDuration) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDuration: duration,
    }))
  }

  const handleLocationChange = (
    location: { address: string; lat: number; lng: number } | null,
    distance: number,
    travelTime: string,
    travelFee: number,
  ) => {
    setBookingState((prev) => ({
      ...prev,
      location: location ? { lat: location.lat, lng: location.lng } : { lat: 0, lng: 0 },
      locationAddress: location?.address || "",
      distance,
      travelTime,
      travelFee,
    }))
  }

  const handleConfirmBooking = () => {
    toast.success("Booking confirmed!", {
      description: "Your booking has been confirmed successfully.",
    })

    // Reset booking state
    setBookingState({
      selectedDate: null,
      selectedTimeSlot: null,
      selectedDuration: service.sessionDurations.length > 0 ? service.sessionDurations[0] : null,
      vendorId,
      location: { lat: 0, lng: 0 },
      distance: 0,
      travelTime: "",
      travelFee: 0,
    })
  }

  return (
    <div className="container mx-auto px-4 py-10 mt-16 relative">
      {isLoading && <LoadingOverlay message="Processing your booking..." />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Service Details */}
          <section>
            <ServiceDetails
              service={service}
              selectedDuration={bookingState.selectedDuration}
              onDurationSelect={handleDurationSelect}
            />
          </section>

          {/* Date and Time Selection */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </section>

          {/* Location Selection */}
          <section>
            <LocationSelector
              serviceLocation={{
                address: service.location.address,
                lat: service.location.lat,
                lng: service.location.lng,
              }}
              onLocationChange={handleLocationChange}
              isBookingComplete={isBookingComplete}
              disabled={isLoading}
            />
          </section>
        </div>

        {/* Booking Confirmation Sidebar */}
        <aside className="sticky top-24 h-fit">
          <BookingConfirmation
            service={service}
            bookingState={bookingState}
            onConfirmBooking={handleConfirmBooking}
            setIsBookingSuccess={() => setIsBookingSuccess(true)}
            setIsLoading={setIsLoading}
          />
        </aside>
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={isBookingSuccess}
        onClose={() => {
          setIsBookingSuccess(false)
          navigate("/")
        }}
        eventDate={bookingState.selectedDate || ""}
        eventName={service.serviceTitle}
      />
    </div>
  )
}

export default BookingPage
