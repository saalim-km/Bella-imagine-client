
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Plus, X } from "lucide-react";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RecurringAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface AvailabilitySchedulerProps {
  recurringAvailability: RecurringAvailability[];
  updateRecurringAvailability: (availability: RecurringAvailability[]) => void;
  bufferTime: number;
  updateBufferTime: (time: number) => void;
  maxBookingsPerDay: number;
  updateMaxBookingsPerDay: (max: number) => void;
  blackoutDates: string[];
  updateBlackoutDates: (dates: string[]) => void;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const AvailabilityScheduler: React.FC<AvailabilitySchedulerProps> = ({
  recurringAvailability,
  updateRecurringAvailability,
  bufferTime,
  updateBufferTime,
  maxBookingsPerDay,
  updateMaxBookingsPerDay,
  blackoutDates,
  updateBlackoutDates
}) => {
  const addRecurringSlot = () => {
    updateRecurringAvailability([
      ...recurringAvailability,
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }
    ]);
  };

  const removeRecurringSlot = (index: number) => {
    const newSlots = recurringAvailability.filter((_, i) => i !== index);
    updateRecurringAvailability(newSlots);
  };

  const updateRecurringSlot = (index: number, field: keyof RecurringAvailability, value: string | number) => {
    const newSlots = [...recurringAvailability];
    if (field === 'dayOfWeek') {
      newSlots[index][field] = value as number;
    } else if (field === 'startTime' || field === 'endTime') {
      newSlots[index][field] = value as string;
    }
    updateRecurringAvailability(newSlots);
  };

  const addBlackoutDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (!blackoutDates.includes(dateString)) {
      updateBlackoutDates([...blackoutDates, dateString]);
    }
  };

  const removeBlackoutDate = (dateToRemove: string) => {
    updateBlackoutDates(blackoutDates.filter(date => date !== dateToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium">Weekly Availability Schedule</Label>
        
        {recurringAvailability.length === 0 && (
          <div className="text-center py-6  -dashed  rounded-lg">
            <Calendar className="mx-auto h-10 w-10  mb-2" />
            <p className="">No recurring availability set</p>
          </div>
        )}
        
        {recurringAvailability.map((slot, index) => (
          <div key={index} className="p-4  rounded-lg relative animate-fade-in">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-70 hover:opacity-100"
              onClick={() => removeRecurringSlot(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`recurringAvailability[${index}].dayOfWeek`} className="text-sm font-medium mb-1 block">
                  Day of Week
                </Label>
                <select
                  id={`recurringAvailability[${index}].dayOfWeek`}
                  name={`recurringAvailability[${index}].dayOfWeek`}
                  value={slot.dayOfWeek}
                  onChange={(e) => updateRecurringSlot(index, 'dayOfWeek', parseInt(e.target.value))}
                  className="w-full h-12 rounded-md -input px-3 py-2  "
                >
                  {dayNames.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor={`recurringAvailability[${index}].startTime`} className="text-sm font-medium mb-1 block">
                  Start Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
                  <Input
                    id={`recurringAvailability[${index}].startTime`}
                    name={`recurringAvailability[${index}].startTime`}
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateRecurringSlot(index, 'startTime', e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`recurringAvailability[${index}].endTime`} className="text-sm font-medium mb-1 block">
                  End Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
                  <Input
                    id={`recurringAvailability[${index}].endTime`}
                    name={`recurringAvailability[${index}].endTime`}
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateRecurringSlot(index, 'endTime', e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          onClick={addRecurringSlot}
          className="w-full py-3 -dashed -2 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Weekly Schedule
        </Button>
      </div>
    </div>
  );
};