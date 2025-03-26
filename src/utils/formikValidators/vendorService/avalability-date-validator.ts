
import { format } from "date-fns";

export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

// Helper function to check if date is in the future
export const isFutureDate = (value: string) => {
  if (!value) return false;
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

// Helper function to check if time is valid
export const isValidTime = (value: string) => {
  if (!value) return false;
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
};

// Helper function to check if end time is after start time
export const isEndTimeAfterStartTime = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return false;
  return endTime > startTime;
};

/**
 * Checks if a date already exists in the available dates array
 */
export const isDuplicateDate = (dates: DateSlot[], dateToCheck: string): boolean => {
  return dates.filter(d => d.date === dateToCheck).length > 1;
};

/**
 * Checks if a time slot overlaps with existing time slots for a given date
 */
export const isOverlappingTimeSlot = (slots: TimeSlot[], newSlot: TimeSlot): boolean => {
  return slots.some(slot => {
    // Skip comparing the slot with itself (for editing scenarios)
    if (slot === newSlot) return false;
    
    // Check if the new time slot overlaps with any existing slot
    const newStart = newSlot.startTime;
    const newEnd = newSlot.endTime;
    const existingStart = slot.startTime;
    const existingEnd = slot.endTime;
    
    return (
      (newStart >= existingStart && newStart < existingEnd) || 
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
};

/**
 * Validates an array of date slots
 * Returns an object with validation results
 */
export const validateAvailableDates = (availableDates: DateSlot[]): { 
  isValid: boolean; 
  errors: Record<string, string[]>;
} => {
  const errors: Record<string, string[]> = {};
  
  // Check if we have at least two dates
  if (availableDates.length < 2) {
    errors.general = ["At least two available dates are required"];
  }
  
  // Check each date
  availableDates.forEach((dateSlot, dateIndex) => {
    const dateErrors: string[] = [];
    
    // Check date format and if it's in the future
    if (!dateSlot.date) {
      dateErrors.push("Date is required");
    } else if (!isFutureDate(dateSlot.date)) {
      dateErrors.push("Date must be in the future");
    }
    
    // Check for duplicate dates
    if (isDuplicateDate(availableDates, dateSlot.date)) {
      dateErrors.push("This date is already added");
    }
    
    // Check time slots
    if (!dateSlot.timeSlots || dateSlot.timeSlots.length === 0) {
      dateErrors.push("At least one time slot is required");
    } else {
      // Validate each time slot
      dateSlot.timeSlots.forEach((timeSlot, slotIndex) => {
        const timeSlotErrors: string[] = [];
        
        // Validate start time
        if (!timeSlot.startTime) {
          timeSlotErrors.push("Start time is required");
        } else if (!isValidTime(timeSlot.startTime)) {
          timeSlotErrors.push("Start time must be in HH:MM format");
        }
        
        // Validate end time
        if (!timeSlot.endTime) {
          timeSlotErrors.push("End time is required");
        } else if (!isValidTime(timeSlot.endTime)) {
          timeSlotErrors.push("End time must be in HH:MM format");
        } else if (!isEndTimeAfterStartTime(timeSlot.startTime, timeSlot.endTime)) {
          timeSlotErrors.push("End time must be after start time");
        }
        
        // Validate capacity
        if (timeSlot.capacity == null || timeSlot.capacity === undefined) {
          timeSlotErrors.push("Capacity is required");
        } else if (timeSlot.capacity < 1) {
          timeSlotErrors.push("Capacity must be at least 1");
        }
        
        // Check for overlapping time slots
        if (
          timeSlot.startTime && 
          timeSlot.endTime && 
          isValidTime(timeSlot.startTime) && 
          isValidTime(timeSlot.endTime) && 
          isEndTimeAfterStartTime(timeSlot.startTime, timeSlot.endTime) &&
          isOverlappingTimeSlot(dateSlot.timeSlots, timeSlot)
        ) {
          timeSlotErrors.push("This time slot overlaps with another slot");
        }
        
        if (timeSlotErrors.length > 0) {
          errors[`availableDates[${dateIndex}].timeSlots[${slotIndex}]`] = timeSlotErrors;
        }
      });
    }
    
    if (dateErrors.length > 0) {
      errors[`availableDates[${dateIndex}]`] = dateErrors;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
