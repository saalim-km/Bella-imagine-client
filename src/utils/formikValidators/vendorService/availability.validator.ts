
import { Yup } from './yup-extension.validator';
import { isFutureDate, isValidTime, isEndTimeAfterStartTime } from './helper.validator';

export const timeSlotSchema = Yup.object({
  startTime: Yup.string()
    .required('Start time is required')
    .test('is-valid-time', 'Time must be in HH:MM format', isValidTime),
  endTime: Yup.string()
    .required('End time is required')
    .test('is-valid-time', 'Time must be in HH:MM format', isValidTime)
    .test('is-after-start', 'End time must be after start time', function (endTime) {
      const { startTime } = this.parent;
      return isEndTimeAfterStartTime(startTime, endTime);
    }),
  capacity: Yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .typeError('Capacity must be a valid number'),
});

export const dateSlotSchema = Yup.object({
  date: Yup.string()
    .required('Date is required')
    .test('is-future-date', 'Date must be in the future', (value) => value ? isFutureDate(value) : false),
  timeSlots: Yup.array()
    .of(timeSlotSchema)
    .min(1, 'At least one time slot is required'),
});

export const availabilitySchema = Yup.object({
  availableDates: Yup.array()
    .of(dateSlotSchema)
    .min(2, 'At least two available dates are required'),
});
