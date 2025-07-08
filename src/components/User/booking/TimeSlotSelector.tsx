import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot, DateSlot } from "@/types/interfaces/vendor";

interface TimeSlotSelectorProps {
  availableDates: DateSlot[];
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  availableDates,
  selectedDate,
  selectedTimeSlot,
  onTimeSlotSelect,
}) => {
  // Get current date and time in IST (June 21, 2025, 11:58 AM IST)
  const currentDateTime = new Date();
  currentDateTime.setHours(
    currentDateTime.getHours() + 5,
    currentDateTime.getMinutes() + 30
  ); // Adjust for IST (+5:30 from UTC)

  // Get time slots for the selected date
  const getTimeSlotsForSelectedDate = () => {
    if (!selectedDate) return [];

    const selectedDateObj = availableDates.find(
      (date) => date.date === selectedDate
    );

    if (!selectedDateObj) return [];

    // Filter time slots to only include those in the future
    return selectedDateObj.timeSlots.filter((slot) => {
      try {
        const slotDateTime = new Date(`${selectedDate}T${slot.startTime}:00+05:30`);
        return slotDateTime >= currentDateTime;
      } catch (error) {
        console.error("Error parsing slot time:", error);
        return false; // Exclude invalid time slots
      }
    });
  };

  const timeSlots = getTimeSlotsForSelectedDate();

  // Format time for display (e.g., "14:30" to "2:30 PM")
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      let hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${hour}:${minutes} ${ampm}`;
    } catch (error) {
      console.log(error);
      return timeString;
    }
  };

  // Check if a time slot is in the past
  const isPastTimeSlot = (slot: TimeSlot) => {
    try {
      const slotDateTime = new Date(`${selectedDate}T${slot.startTime}:00+05:30`);
      return slotDateTime < currentDateTime;
    } catch (error) {
      console.error("Error checking past time slot:", error);
      return true; // Disable invalid time slots
    }
  };

  if (!selectedDate) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Time</CardTitle>
      </CardHeader>
      <CardContent>
        {timeSlots.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No time slots available for the selected date.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => onTimeSlotSelect(slot)}
                disabled={slot.isBooked || slot.capacity <= 0 || isPastTimeSlot(slot)}
                className={`p-3 text-sm rounded-md transition-colors ${
                  selectedTimeSlot?.startTime === slot.startTime
                    ? "bg-primary text-primary-foreground"
                    : slot.isBooked || slot.capacity <= 0 || isPastTimeSlot(slot)
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;