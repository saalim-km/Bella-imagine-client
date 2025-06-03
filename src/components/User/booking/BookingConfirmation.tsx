import type React from "react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { BookingState, IServiceResponse } from "@/types/interfaces/vendor"
import { toast } from "sonner"
import { PaymentWrapper } from "@/components/stripe/PaymentForm"
import type { Booking } from "@/types/interfaces/User"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useSocket } from "@/context/SocketContext"

interface BookingConfirmationProps {
  service: IServiceResponse
  bookingState: BookingState
  onConfirmBooking: () => void
  setIsBookingSuccess: () => void
  setIsLoading: (isLoading: boolean) => void
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  service,
  bookingState,
  onConfirmBooking,
  setIsBookingSuccess,
  setIsLoading,
}) => {
  const { selectedDate, selectedTimeSlot, selectedDuration, vendorId, location } = bookingState
  const {socket} = useSocket()

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return ""

    try {
      const [hours, minutes] = timeString.split(":")
      let hour = Number.parseInt(hours, 10)
      const ampm = hour >= 12 ? "PM" : "AM"
      hour = hour % 12 || 12
      return `${hour}:${minutes} ${ampm}`
    } catch (error) {
      return timeString
    }
  }

  const handlePaymentError = (error: string) => {
    setIsLoading(false)
    toast.error(error)
  }

  const handlePaymentStart = () => {
    // Validate all required fields before proceeding
    if (!selectedDate || !selectedTimeSlot || !selectedDuration) {
      toast.error("Please complete all booking details before proceeding")
      return false
    }

    if (location.lat === 0 && location.lng === 0) {
      toast.error("Please select a location for your booking")
      return false
    }

    setIsLoading(true)
    return true
  }

  const handlePaymentSuccess = () => {
    socket?.emit('createBooking',{bookingData : bookingData })
    setIsLoading(false)
    setIsBookingSuccess()
    onConfirmBooking()
  }

  const bookingData: Booking = {
    bookingDate: selectedDate || "",
    serviceId: service._id || "",
    timeSlot: {
      startTime: selectedTimeSlot?.startTime || "",
      endTime: selectedTimeSlot?.endTime || "",
    },
    totalPrice: selectedDuration?.price || 0,
    vendorId: vendorId || "",
    location: location,
  }

  const isFormComplete =
    selectedDate && selectedTimeSlot && selectedDuration && location.lat !== 0 && location.lng !== 0

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
                <span className="font-medium">{format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}</span>
              </div>
            )}

            {selectedTimeSlot && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">
                  {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">
                {location.lat !== 0 && location.lng !== 0 ? "Selected on map" : "Not selected"}
              </span>
            </div>
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
        {!isFormComplete && (
          <CardFooter>
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Incomplete booking</AlertTitle>
              <AlertDescription>Please complete all required fields to proceed with booking.</AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
      <div className="mt-5">
        <PaymentWrapper
          bookingData={bookingData}
          amount={selectedDuration?.price || 0}
          setIsSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onPaymentStart={handlePaymentStart}
          disabled={!isFormComplete}
        />
      </div>
    </>
  )
}

export default BookingConfirmation
