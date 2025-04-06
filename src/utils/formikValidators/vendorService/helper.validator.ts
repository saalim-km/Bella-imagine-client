
// Helper function for checking if string contains only letters and spaces
export const nameRegex = /^[A-Za-z\s]+$/;

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

// Helper function to check if input is empty or just whitespace
export const isEmptyInput = (value: string) => {
  if (!value) return true;
  return value.trim() === '' || 
         value === 'N/A' || 
         value === '-' || 
         value === '.';
};
