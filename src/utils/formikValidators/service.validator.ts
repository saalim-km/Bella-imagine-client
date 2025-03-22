import * as Yup from "yup";

export const serviceValidationSchema = Yup.object({
  serviceTitle: Yup.string().required("Service title is required"),
  category: Yup.string(),
  yearsOfExperience: Yup.number()
    .required("Years of experience is required")
    .min(0, "Years of experience must be non-negative"),
  styleSpecialty: Yup.array().of(Yup.string()),
  tags: Yup.array().of(Yup.string()),
  serviceDescription: Yup.string().required("Service description is required"),
  sessionDurations: Yup.array()
    .of(
      Yup.object({
        durationInHours: Yup.number()
          .required("Duration is required")
          .min(0.5, "Duration must be at least 0.5 hours"),
        price: Yup.number()
          .required("Price is required")
          .min(0, "Price must be non-negative"),
      })
    )
    .min(1, "At least one session duration is required"),
  features: Yup.array().of(Yup.string()),
  depositRequirement: Yup.object({
    amount: Yup.number().min(0, "Deposit amount must be non-negative"),
    isPercentage: Yup.boolean(),
  }),
  availableDates: Yup.array().of(
    Yup.object({
      date: Yup.string().required("Date is required"),
      timeSlots: Yup.array()
        .of(
          Yup.object({
            startTime: Yup.string().required("Start time is required"),
            endTime: Yup.string().required("End time is required"),
            capacity: Yup.number()
              .required("Capacity is required")
              .min(1, "Capacity must be at least 1"),
          })
        )
        .min(1, "At least one time slot is required"),
    })
  ),
  recurringAvailability: Yup.array().of(
    Yup.object({
      dayOfWeek: Yup.number().required("Day of week is required").min(0).max(6),
      startTime: Yup.string().required("Start time is required"),
      endTime: Yup.string().required("End time is required"),
    })
  ),
  bufferTime: Yup.number().min(0, "Buffer time must be non-negative"),
  maxBookingsPerDay: Yup.number().min(
    1,
    "Maximum bookings per day must be at least 1"
  ),
  blackoutDates: Yup.array().of(Yup.string()),
  location: Yup.object({
    options: Yup.object({
      studio: Yup.boolean(),
      onLocation: Yup.boolean(),
    }),
    travelFee: Yup.number().min(0, "Travel fee must be non-negative"),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
  }),
  equipment: Yup.array().of(Yup.string()),
  paymentRequired: Yup.boolean(),
  cancellationPolicies: Yup.array()
    .of(Yup.string())
    .min(1, "At least one cancellation policy is required"),
  termsAndConditions: Yup.array()
    .of(Yup.string())
    .min(1, "At least one term and condition is required"),
  customFields: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Field name is required"),
      type: Yup.string().required("Field type is required"),
      required: Yup.boolean(),
      options: Yup.array()
        .of(Yup.string())
        .when("type", {
          is: "enum",
          then: (schema) =>
            schema.min(1, "At least one option is required for enum field"),
        }),
    })
  ),
});
