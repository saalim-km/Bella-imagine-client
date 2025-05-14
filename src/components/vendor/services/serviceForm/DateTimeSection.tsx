import React, { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Plus, Trash, Calendar as CalendarIcon, Clock } from "lucide-react";
import { 
  TimeSlot, 
  DateSlot, 
  isOverlappingTimeSlot,
  isFutureDate,
  isEndTimeAfterStartTime
} from "@/utils/formikValidators/vendorService/avalability-date-validator";

interface DateTimeSectionProps {
  availableDates: DateSlot[];
  updateDates: (dates: DateSlot[]) => void;
  validationErrors: Record<string, any>;
}

// Convert 24-hour to 12-hour format
const to12HourFormat = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};


// Generate time options in 12-hour format
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push({
        time24,
        time12: to12HourFormat(time24)
      });
    }
  }
  return times;
};

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  availableDates,
  updateDates,
  validationErrors,
}) => {
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [dateErrors, setDateErrors] = useState<Record<number, string[]>>({});
  const [timeSlotErrors, setTimeSlotErrors] = useState<Record<string, string[]>>({});
  const timeOptions = generateTimeOptions();

  const addDate = () => {
    if (!newDate) return;
    
    const formattedDate = format(newDate, "yyyy-MM-dd");
    
    if (!isFutureDate(formattedDate)) {
      setDateErrors({ ...dateErrors, [-1]: ["Date must be in the future"] });
      return;
    }
    
    if (availableDates.some(d => d.date === formattedDate)) {
      setDateErrors({ ...dateErrors, [-1]: ["This date already exists"] });
      return;
    }
    
    const updatedDates = [
      ...availableDates,
      {
        date: formattedDate,
        timeSlots: [{ startTime: "09:00", endTime: "18:00", capacity: 1 }],
      },
    ];
    
    updateDates(updatedDates);
    setNewDate(undefined);
    setDateErrors({ ...dateErrors, [-1]: [] });
  };

  const removeDate = (index: number) => {
    const updatedDates = [...availableDates];
    updatedDates.splice(index, 1);
    updateDates(updatedDates);
    
    const newDateErrors = { ...dateErrors };
    delete newDateErrors[index];
    setDateErrors(newDateErrors);
  };

  const addTimeSlot = (dateIndex: number) => {
    const updatedDates = [...availableDates];
    const lastTimeSlot = updatedDates[dateIndex].timeSlots[updatedDates[dateIndex].timeSlots.length - 1];
    const lastEndTime = lastTimeSlot?.endTime || "18:00";
    
    const [lastEndHours, lastEndMinutes] = lastEndTime.split(":").map(Number);
    let newStartHour = lastEndHours;
    let newStartMinute = lastEndMinutes + 15;
    
    if (newStartMinute >= 60) {
      newStartHour += 1;
      newStartMinute -= 60;
    }
    
    if (newStartHour >= 24) {
      newStartHour = 23;
      newStartMinute = 45;
    }
    
    let newEndHour = newStartHour + 1;
    let newEndMinute = newStartMinute;
    
    if (newEndHour >= 24) {
      newEndHour = 23;
      newEndMinute = 59;
    }
    
    const formatTime = (h: number, m: number) => 
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    
    const newTimeSlot = {
      startTime: formatTime(newStartHour, newStartMinute),
      endTime: formatTime(newEndHour, newEndMinute),
      capacity: lastTimeSlot?.capacity || 1,
    };
    
    updatedDates[dateIndex].timeSlots.push(newTimeSlot);
    updateDates(updatedDates);
  };

  const removeTimeSlot = (dateIndex: number, slotIndex: number) => {
    const updatedDates = [...availableDates];
    updatedDates[dateIndex].timeSlots.splice(slotIndex, 1);
    
    if (updatedDates[dateIndex].timeSlots.length === 0) {
      updatedDates[dateIndex].timeSlots.push({
        startTime: "09:00",
        endTime: "18:00",
        capacity: 1,
      });
    }
    
    updateDates(updatedDates);
    
    const key = `${dateIndex}-${slotIndex}`;
    const newTimeSlotErrors = { ...timeSlotErrors };
    delete newTimeSlotErrors[key];
    setTimeSlotErrors(newTimeSlotErrors);
  };

  const updateTimeSlot = (
    dateIndex: number,
    slotIndex: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const updatedDates = [...availableDates];
    const errorKey = `${dateIndex}-${slotIndex}`;
    let newErrors: string[] = [];
    
    if (field === 'startTime' || field === 'endTime') {
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      
      if (!timePattern.test(value)) {
        newErrors.push(`Invalid time format`);
      } else {
        if (field === 'endTime') {
          const startTime = updatedDates[dateIndex].timeSlots[slotIndex].startTime;
          if (!isEndTimeAfterStartTime(startTime, value)) {
            newErrors.push(`End time must be after start time`);
          }
        }
        
        updatedDates[dateIndex].timeSlots[slotIndex][field] = value;
        
        const currentSlot = updatedDates[dateIndex].timeSlots[slotIndex];
        if (isOverlappingTimeSlot(updatedDates[dateIndex].timeSlots, currentSlot)) {
          newErrors.push(`This time slot overlaps with another time slot`);
        }
      }
    } else if (field === 'capacity') {
      const capacityValue = Number(value);
      if (isNaN(capacityValue) || capacityValue < 1) {
        newErrors.push(`Capacity must be at least 1`);
      } else {
        updatedDates[dateIndex].timeSlots[slotIndex].capacity = capacityValue;
      }
    }
    
    setTimeSlotErrors({
      ...timeSlotErrors,
      [errorKey]: newErrors
    });
    
    if (newErrors.length === 0) {
      updateDates(updatedDates);
    }
  };

  const updateDate = (dateIndex: number, newDateValue: Date) => {
    const formattedDate = format(newDateValue, "yyyy-MM-dd");
    const updatedDates = [...availableDates];
    
    if (!isFutureDate(formattedDate)) {
      setDateErrors({ ...dateErrors, [dateIndex]: ["Date must be in the future"] });
      return;
    }
    
    const otherDates = updatedDates.filter((_, i) => i !== dateIndex);
    if (otherDates.some(d => d.date === formattedDate)) {
      setDateErrors({ ...dateErrors, [dateIndex]: ["This date already exists"] });
      return;
    }
    
    updatedDates[dateIndex].date = formattedDate;
    updateDates(updatedDates);
    
    const newDateErrors = { ...dateErrors };
    delete newDateErrors[dateIndex];
    setDateErrors(newDateErrors);
  };

  return (
    <div className="space-y-4">
      {availableDates.map((dateSlot, dateIndex) => (
        <div key={dateIndex} className="border rounded-md p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-1 block">Date</Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left h-10 ${
                        dateErrors[dateIndex]?.length || validationErrors[`availableDates[${dateIndex}]`]
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateSlot.date
                        ? format(new Date(dateSlot.date), "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateSlot.date ? new Date(dateSlot.date) : undefined}
                      onSelect={(date) => date && updateDate(dateIndex, date)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(dateErrors[dateIndex]?.length > 0 || validationErrors[`availableDates[${dateIndex}]`]) && (
                <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {dateErrors[dateIndex]?.[0] || validationErrors[`availableDates[${dateIndex}]`]}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeDate(dateIndex)}
              className="ml-2"
              disabled={availableDates.length <= 2}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Time Slots</Label>
            {dateSlot.timeSlots.map((slot, slotIndex) => (
              <div
                key={slotIndex}
                className="grid grid-cols-12 gap-2 items-start"
              >
                <div className="col-span-4">
                  <Label className="text-xs">Start Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left h-9 ${
                          timeSlotErrors[`${dateIndex}-${slotIndex}`]?.length || 
                          validationErrors[`availableDates[${dateIndex}].timeSlots[${slotIndex}]`]
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {to12HourFormat(slot.startTime)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 max-h-60 overflow-y-auto p-1">
                      {timeOptions.map((option) => (
                        <Button
                          key={option.time24}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => updateTimeSlot(dateIndex, slotIndex, "startTime", option.time24)}
                        >
                          {option.time12}
                        </Button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="col-span-4">
                  <Label className="text-xs">End Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left h-9 ${
                          timeSlotErrors[`${dateIndex}-${slotIndex}`]?.length || 
                          validationErrors[`availableDates[${dateIndex}].timeSlots[${slotIndex}]`]
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {to12HourFormat(slot.endTime)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 max-h-60 overflow-y-auto p-1">
                      {timeOptions.map((option) => (
                        <Button
                          key={option.time24}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => updateTimeSlot(dateIndex, slotIndex, "endTime", option.time24)}
                        >
                          {option.time12}
                        </Button>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Capacity</Label>
                  <Input
                    type="number"
                    placeholder="Capacity"
                    value={slot.capacity}
                    onChange={(e) =>
                      updateTimeSlot(dateIndex, slotIndex, "capacity", e.target.value)
                    }
                    className={`h-9 ${
                      timeSlotErrors[`${dateIndex}-${slotIndex}`]?.length || 
                      validationErrors[`availableDates[${dateIndex}].timeSlots[${slotIndex}]`]
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                <div className="col-span-1 pt-5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeSlot(dateIndex, slotIndex)}
                    disabled={dateSlot.timeSlots.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                {(timeSlotErrors[`${dateIndex}-${slotIndex}`]?.length > 0 || 
                 validationErrors[`availableDates[${dateIndex}].timeSlots[${slotIndex}]`]) && (
                  <div className="col-span-12 text-red-500 text-sm flex items-center animate-fade-in">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {timeSlotErrors[`${dateIndex}-${slotIndex}`]?.[0] || 
                     validationErrors[`availableDates[${dateIndex}].timeSlots[${slotIndex}]`]}
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTimeSlot(dateIndex)}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Time Slot
            </Button>
          </div>
        </div>
      ))}

      <div className="flex items-center space-x-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left ${
                dateErrors[-1]?.length ? "border-red-500" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {newDate ? format(newDate, "PPP") : "Select date to add"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          type="button"
          onClick={addDate}
          disabled={!newDate}
          className="shrink-0"
        >
          Add Date
        </Button>
      </div>
      {dateErrors[-1]?.length > 0 && (
        <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
          <AlertCircle className="h-3 w-3 mr-1" />
          {dateErrors[-1][0]}
        </div>
      )}
    </div>
  );
};