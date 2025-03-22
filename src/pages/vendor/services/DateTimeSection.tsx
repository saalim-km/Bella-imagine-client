
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Clock, Calendar } from "lucide-react";

interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
}

interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

interface DateTimeSectionProps {
  availableDates: DateSlot[];
  updateDates: (dates: DateSlot[]) => void;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({ availableDates = [], updateDates }) => {
  // Make sure availableDates is always an array
  const dates = Array.isArray(availableDates) ? availableDates : [];
  
  const addDateSlot = () => {
    updateDates([
      ...dates,
      { date: "", timeSlots: [{ startTime: "", endTime: "", capacity: 1 }] },
    ]);
  };

  const removeDateSlot = (dateIndex: number) => {
    const newAvailableDates = dates.filter(
      (_, index) => index !== dateIndex
    );
    updateDates(newAvailableDates);
  };

  const addTimeSlot = (dateIndex: number) => {
    const newAvailableDates = [...dates];
    newAvailableDates[dateIndex].timeSlots.push({
      startTime: "",
      endTime: "",
      capacity: 1,
    });
    updateDates(newAvailableDates);
  };

  const removeTimeSlot = (dateIndex: number, timeIndex: number) => {
    const newAvailableDates = [...dates];
    newAvailableDates[dateIndex].timeSlots = newAvailableDates[
      dateIndex
    ].timeSlots.filter((_, index) => index !== timeIndex);
    updateDates(newAvailableDates);
  };

  const updateDate = (dateIndex: number, date: string) => {
    const newAvailableDates = [...dates];
    newAvailableDates[dateIndex].date = date;
    updateDates(newAvailableDates);
  };

  const updateTimeSlot = (dateIndex: number, timeIndex: number, field: keyof TimeSlot, value: string | number) => {
    const newAvailableDates = [...dates];
    // Fixed the type error here by properly casting the value based on the field
    if (field === 'capacity') {
      newAvailableDates[dateIndex].timeSlots[timeIndex][field] = value as number;
    } else {
      newAvailableDates[dateIndex].timeSlots[timeIndex][field] = value as string;
    }
    updateDates(newAvailableDates);
  };

  return (
    <div className="space-y-4">
      {dates.length === 0 && (
        <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
          <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No dates added yet</p>
        </div>
      )}
      
      {dates.map((dateSlot, dateIndex) => (
        <div
          key={dateIndex}
          className="p-4 border rounded-lg relative transition-all duration-300 hover:shadow-md"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => removeDateSlot(dateIndex)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center mb-4">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <Input
              type="date"
              value={dateSlot.date}
              onChange={(e) => updateDate(dateIndex, e.target.value)}
              className="service-input"
            />
          </div>
          
          <div className="space-y-3">
            {dateSlot.timeSlots && dateSlot.timeSlots.map((timeSlot, timeIndex) => (
              <div
                key={timeIndex}
                className="bg-gray-50 p-3 rounded-md animate-fade-in"
                style={{ animationDelay: `${timeIndex * 0.05}s` }}
              >
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 relative">
                  <div className="flex items-center w-full md:w-auto">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <Input
                      type="time"
                      value={timeSlot.startTime}
                      onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'startTime', e.target.value)}
                      className="service-input"
                      placeholder="Start time"
                    />
                  </div>
                  
                  <div className="h-px w-4 bg-gray-200 hidden md:block"></div>
                  
                  <div className="flex items-center w-full md:w-auto">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <Input
                      type="time"
                      value={timeSlot.endTime}
                      onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'endTime', e.target.value)}
                      className="service-input"
                      placeholder="End time"
                    />
                  </div>
                  
                  <div className="flex items-center w-full md:w-auto">
                    <Input
                      type="number"
                      min={1}
                      placeholder="Capacity"
                      value={timeSlot.capacity === 0 ? '' : timeSlot.capacity}
                      onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'capacity', parseInt(e.target.value) || 0)}
                      className="service-input"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeSlot(dateIndex, timeIndex)}
                    className="ml-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addTimeSlot(dateIndex)}
            className="mt-3 w-full transition-all duration-200 hover:bg-gray-50"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Time Slot
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        onClick={addDateSlot}
        className="w-full py-6 border-dashed border-2 hover:border-gray-300 transition-colors bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50/50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Date
      </Button>
    </div>
  );
};