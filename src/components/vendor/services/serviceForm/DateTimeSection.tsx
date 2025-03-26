
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Clock, Calendar, AlertCircle } from "lucide-react";
import { format, isValid, parseISO } from 'date-fns';

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
  validationErrors?: Record<string, any>;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({ 
  availableDates = [], 
  updateDates,
  validationErrors = {} 
}) => {
  // Make sure availableDates is always an array
  const dates = Array.isArray(availableDates) ? availableDates : [];
  const [localErrors, setLocalErrors] = useState<Record<string, any>>({});
  
  // Combine validation errors from props and local validation
  const errors = { ...validationErrors, ...localErrors };
  
  const addDateSlot = () => {
    // Get tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = format(tomorrow, 'yyyy-MM-dd');
    
    updateDates([
      ...dates,
      { date: defaultDate, timeSlots: [{ startTime: "09:00", endTime: "17:00", capacity: 1 }] },
    ]);
  };

  const removeDateSlot = (dateIndex: number) => {
    const newAvailableDates = dates.filter((_, index) => index !== dateIndex);
    updateDates(newAvailableDates);
    
    // Clear any errors related to this date
    const newLocalErrors = { ...localErrors };
    Object.keys(newLocalErrors).forEach(key => {
      if (key.startsWith(`availableDates[${dateIndex}]`)) {
        delete newLocalErrors[key];
      }
    });
    setLocalErrors(newLocalErrors);
  };

  const addTimeSlot = (dateIndex: number) => {
    const newAvailableDates = [...dates];
    newAvailableDates[dateIndex].timeSlots.push({
      startTime: "09:00",
      endTime: "17:00",
      capacity: 1,
    });
    updateDates(newAvailableDates);
  };

  const removeTimeSlot = (dateIndex: number, timeIndex: number) => {
    const newAvailableDates = [...dates];
    newAvailableDates[dateIndex].timeSlots = newAvailableDates[dateIndex].timeSlots.filter((_, index) => index !== timeIndex);
    updateDates(newAvailableDates);
    
    // Clear any errors related to this time slot
    const newLocalErrors = { ...localErrors };
    Object.keys(newLocalErrors).forEach(key => {
      if (key.startsWith(`availableDates[${dateIndex}].timeSlots[${timeIndex}]`)) {
        delete newLocalErrors[key];
      }
    });
    setLocalErrors(newLocalErrors);
  };

  const updateDate = (dateIndex: number, date: string) => {
    const newAvailableDates = [...dates];
    newAvailableDates[dateIndex].date = date;
    updateDates(newAvailableDates);
    
    // Validate date is in the future
    const errorPath = `availableDates[${dateIndex}].date`;
    const newLocalErrors = { ...localErrors };
    
    // Clear previous errors
    delete newLocalErrors[errorPath];
    
    // Check if date is valid
    if (!date) {
      newLocalErrors[errorPath] = 'Date is required';
    } else if (!isValid(parseISO(date))) {
      newLocalErrors[errorPath] = 'Invalid date format';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newLocalErrors[errorPath] = 'Date must be in the future';
      }
    }
    
    setLocalErrors(newLocalErrors);
  };

  const validateTimeSlot = (dateIndex: number, timeIndex: number, field: keyof TimeSlot, value: string | number) => {
    const errorPath = `availableDates[${dateIndex}].timeSlots[${timeIndex}].${field}`;
    const newLocalErrors = { ...localErrors };
    
    // Clear previous errors
    delete newLocalErrors[errorPath];
    
    if (field === 'startTime' || field === 'endTime') {
      const timeValue = value as string;
      // Basic time format validation (HH:MM)
      if (!timeValue) {
        newLocalErrors[errorPath] = `${field === 'startTime' ? 'Start' : 'End'} time is required`;
      } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeValue)) {
        newLocalErrors[errorPath] = 'Time must be in HH:MM format';
      }
      
      // If both times are valid, check that end time is after start time
      if (field === 'endTime' && !newLocalErrors[errorPath]) {
        const startTime = dates[dateIndex].timeSlots[timeIndex].startTime;
        if (startTime && timeValue <= startTime) {
          newLocalErrors[errorPath] = 'End time must be after start time';
        }
      }
    } else if (field === 'capacity') {
      const capacityValue = value as number;
      if (!capacityValue) {
        newLocalErrors[errorPath] = 'Capacity is required';
      } else if (capacityValue < 1) {
        newLocalErrors[errorPath] = 'Capacity must be at least 1';
      }
    }
    
    setLocalErrors(newLocalErrors);
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
    
    // Validate the time slot
    validateTimeSlot(dateIndex, timeIndex, field, value);
  };

  const getErrorMessage = (path: string) => {
    return errors[path] || '';
  };

  const hasError = (path: string) => {
    return !!errors[path];
  };

  return (
    <div className="space-y-4">
      {dates.length === 0 && (
        <div className="text-center py-6 border border-dashed  rounded-lg">
          <Calendar className="mx-auto h-10 w-10  mb-2" />
          <p className="">No dates added yet</p>
        </div>
      )}
      
      {dates.map((dateSlot, dateIndex) => (
        <div
          key={dateIndex}
          className={`p-4 border rounded-lg relative transition-all duration-300 hover:shadow-md ${
            hasError(`availableDates[${dateIndex}].date`) ? 'border-red-300 bg-red-50' : ''
          }`}
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
          
          <div className="flex flex-col mb-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 " />
              <Input
                type="date"
                value={dateSlot.date}
                onChange={(e) => updateDate(dateIndex, e.target.value)}
                onBlur={(e) => updateDate(dateIndex, e.target.value)}
                className={`service-input ${
                  hasError(`availableDates[${dateIndex}].date`) ? 'border-red-500 focus-visible:ring-red-200' : ''
                }`}
              />
            </div>
            {hasError(`availableDates[${dateIndex}].date`) && (
              <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                <AlertCircle className="h-3 w-3 mr-1" />
                {getErrorMessage(`availableDates[${dateIndex}].date`)}
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {dateSlot.timeSlots && dateSlot.timeSlots.map((timeSlot, timeIndex) => (
              <div
                key={timeIndex}
                className={`bg-gray-50 p-3 rounded-md animate-fade-in ${
                  (hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].startTime`) ||
                   hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].endTime`) ||
                   hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].capacity`)) ? 
                   'border border-red-300 bg-red-50' : ''
                }`}
                style={{ animationDelay: `${timeIndex * 0.05}s` }}
              >
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2 relative">
                  <div className="flex flex-col w-full md:w-auto">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4  mr-2" />
                      <Input
                        type="time"
                        value={timeSlot.startTime}
                        onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'startTime', e.target.value)}
                        onBlur={(e) => validateTimeSlot(dateIndex, timeIndex, 'startTime', e.target.value)}
                        className={`service-input ${
                          hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].startTime`) ? 'border-red-500 focus-visible:ring-red-200' : ''
                        }`}
                        placeholder="Start time"
                      />
                    </div>
                    {hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].startTime`) && (
                      <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {getErrorMessage(`availableDates[${dateIndex}].timeSlots[${timeIndex}].startTime`)}
                      </div>
                    )}
                  </div>
                  
                  <div className="h-px w-4 bg-gray-200 hidden md:block"></div>
                  
                  <div className="flex flex-col w-full md:w-auto">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <Input
                        type="time"
                        value={timeSlot.endTime}
                        onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'endTime', e.target.value)}
                        onBlur={(e) => validateTimeSlot(dateIndex, timeIndex, 'endTime', e.target.value)}
                        className={`service-input ${
                          hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].endTime`) ? 'border-red-500 focus-visible:ring-red-200' : ''
                        }`}
                        placeholder="End time"
                      />
                    </div>
                    {hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].endTime`) && (
                      <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {getErrorMessage(`availableDates[${dateIndex}].timeSlots[${timeIndex}].endTime`)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col w-full md:w-auto">
                    <div className="flex items-center">
                      <Input
                        type="number"
                        min={1}
                        placeholder="Capacity"
                        value={timeSlot.capacity === 0 ? '' : timeSlot.capacity}
                        onChange={(e) => updateTimeSlot(dateIndex, timeIndex, 'capacity', parseInt(e.target.value) || 0)}
                        onBlur={(e) => validateTimeSlot(dateIndex, timeIndex, 'capacity', parseInt(e.target.value) || 0)}
                        className={`service-input ${
                          hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].capacity`) ? 'border-red-500 focus-visible:ring-red-200' : ''
                        }`}
                      />
                    </div>
                    {hasError(`availableDates[${dateIndex}].timeSlots[${timeIndex}].capacity`) && (
                      <div className="text-red-500 text-sm mt-1 flex items-center animate-fade-in">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {getErrorMessage(`availableDates[${dateIndex}].timeSlots[${timeIndex}].capacity`)}
                      </div>
                    )}
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
            className="mt-3 w-full transition-all duration-200 "
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Time Slot
          </Button>
        </div>
      ))}
      
      <Button
        variant={"outline"}
        type="button"
        onClick={addDateSlot}
        className="w-full py-6 border-dashed border-2"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Date
      </Button>
    </div>
  );
};
