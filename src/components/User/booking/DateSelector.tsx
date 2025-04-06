
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateSlot } from "@/types/vendor";

interface DateSelectorProps {
  availableDates: DateSlot[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  availableDates,
  selectedDate,
  onDateSelect,
}) => {
  // Convert available dates strings to Date objects for the calendar
  const availableDateObjects = availableDates.map((d) => new Date(d.date));

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format the date to match the format in the availableDates array
      const formattedDate = format(date, "yyyy-MM-dd");
      onDateSelect(formattedDate);
    }
  };

  // Find the selected date object if any
  const selectedDateObject = selectedDate ? new Date(selectedDate) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Date</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDateObject}
          onSelect={handleDateSelect}
          disabled={(date) => {
            // Disable dates that are not in the available dates list
            // Also disable dates in the past
            return (
              !availableDateObjects.some(
                (availableDate) =>
                  format(availableDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
              ) || date < new Date(new Date().setHours(0, 0, 0, 0))
            );
          }}
          className="rounded-md border p-3 pointer-events-auto"
        />
      </CardContent>
    </Card>
  );
};

export default DateSelector;