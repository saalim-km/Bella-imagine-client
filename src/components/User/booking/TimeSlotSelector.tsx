
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSlot , DateSlot } from "@/types/vendor";

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
  // Get time slots for the selected date
  const getTimeSlotsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const selectedDateObj = availableDates.find(
      (date) => date.date === selectedDate
    );
    
    return selectedDateObj ? selectedDateObj.timeSlots : [];
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
      return timeString; // Return original if parsing fails
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
                disabled={slot.isBooked || slot.capacity <= 0}
                className={`p-3 text-sm rounded-md transition-colors ${
                  selectedTimeSlot?.startTime === slot.startTime
                    ? "bg-primary text-primary-foreground"
                    : slot.isBooked || slot.capacity <= 0
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
