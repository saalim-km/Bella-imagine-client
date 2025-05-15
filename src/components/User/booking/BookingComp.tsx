"use client"

import type React from "react"
import { useState } from "react"
import type { TimeSlot, BookingState, SessionDuration, IServiceResponse } from "@/types/interfaces/vendor"
import { toast } from "sonner"
import ServiceDetails from "./ServiceDetails"
import DateSelector from "./DateSelector"
import TimeSlotSelector from "./TimeSlotSelector"
import BookingConfirmation from "./BookingConfirmation"
import { BookingSuccessModal } from "@/components/modals/BookingSuccess"
import { useNavigate } from "react-router-dom"
import LocationPicker from "./LocationPicker"
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
  })

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

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setBookingState((prev) => ({
      ...prev,
      location,
    }))
  }

  const handleConfirmBooking = () => {
    toast.success("Booking confirmed!", {
      description: "Your booking has been confirmed successfully.",
    })

    setBookingState({
      selectedDate: null,
      selectedTimeSlot: null,
      selectedDuration: service.sessionDurations.length > 0 ? service.sessionDurations[0] : null,
      vendorId,
      location: { lat: 0, lng: 0 },
    })
  }

  return (
    <div className="container mx-auto px-4 py-10 mt-16 relative">
      {isLoading && <LoadingOverlay message="Processing your booking..." />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Booking Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Service and Duration */}
          <section>
            <ServiceDetails
              service={service}
              selectedDuration={bookingState.selectedDuration}
              onDurationSelect={handleDurationSelect}
            />
          </section>

          {/* Step 2: Location Selection */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Where is the service needed?</h2>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialLocation={bookingState.location}
            />
          </section>

          {/* Step 3: Date and Time */}
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
        </div>

        {/* Sidebar: Booking Summary and Confirm */}
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
